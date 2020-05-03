package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/bazelbuild/rules_docker/container/go/pkg/compat"
)

var (
	infoFile    = flag.String("info-file", "", "")
	versionFile = flag.String("version-file", "", "")
	bucket      = flag.String("bucket", "", "")
	manifestKey = flag.String("manifest-key", "", "")
)

func main() {
	flag.Parse()

	sess := session.Must(session.NewSession(aws.NewConfig()))
	client := s3.New(sess)

	stamper, err := compat.NewStamper([]string{*infoFile, *versionFile})
	if err != nil {
		log.Fatal(err)
	}

	stampedBucket := stamper.Stamp(*bucket)

	checksums := make(map[string]string)
	var anyFailed bool
	for _, path := range flag.Args() {
		file, err := os.Open(path)
		if err != nil {
			anyFailed = true
			log.Printf("cannot open %q: %v", path, err)
			continue
		}
		defer file.Close()

		data, err := ioutil.ReadAll(file)
		if err != nil {
			anyFailed = true
			log.Printf("cannot read %q: %v", path, err)
			continue
		}

		funcName := strings.TrimSuffix(filepath.Base(path), ".zip")
		sha256Sum := fmt.Sprintf("%x", sha256.Sum256(data))
		checksums[funcName] = sha256Sum
		key := sha256Sum

		_, err = client.HeadObject(&s3.HeadObjectInput{
			Bucket: aws.String(stampedBucket),
			Key:    aws.String(key),
		})
		if err == nil {
			log.Printf("Skipping %q because it already exists at s3://%s/%s", filepath.Base(path), stampedBucket, key)
			continue
		}

		if aerr, ok := err.(awserr.Error); !ok || aerr.Code() != "NotFound" {
			anyFailed = true
			log.Printf("could not check if %q was already uploaded: %v", path, err)
			if ok {
				log.Printf("  code: %s", aerr.Code())
			}
			continue
		}

		_, err = client.PutObject(&s3.PutObjectInput{
			Body:        bytes.NewReader(data),
			Bucket:      aws.String(stampedBucket),
			ContentType: aws.String("application/zip"),
			Key:         aws.String(key),
		})
		if err != nil {
			anyFailed = true
			log.Printf("cannot upload %q to s3://%s/%s: %v",
				path, stampedBucket, key, err)
			continue
		}

		log.Printf("Uploaded %q to s3://%s/%s", filepath.Base(path), stampedBucket, key)
	}

	manifest, err := json.Marshal(checksums)
	if err != nil {
		log.Fatalf("could not encode manifest: %v", err)
	}

	key := stamper.Stamp(*manifestKey)
	_, err = client.PutObject(&s3.PutObjectInput{
		Body:        bytes.NewReader(manifest),
		Bucket:      aws.String(stampedBucket),
		ContentType: aws.String("application/json"),
		Key:         aws.String(key),
	})
	if err != nil {
		log.Fatalf("could not upload manifest to s3://%s/%s: %v", stampedBucket, key, err)
	}

	log.Printf("Uploaded manifest to s3://%s/%s", stampedBucket, key)

	if anyFailed {
		os.Exit(1)
	}
}
