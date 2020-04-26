package main

import (
	"flag"
	"log"
	"os"
	"path/filepath"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/bazelbuild/rules_docker/container/go/pkg/compat"
)

var (
	infoFile    = flag.String("info-file", "", "")
	versionFile = flag.String("version-file", "", "")
	bucket      = flag.String("bucket", "", "")
	keyPrefix   = flag.String("key-prefix", "", "")
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
	stampedKeyPrefix := stamper.Stamp(*keyPrefix)

	var anyFailed bool
	for _, path := range flag.Args() {
		file, err := os.Open(path)
		if err != nil {
			anyFailed = true
			log.Printf("cannot open %q: %v", path, err)
			continue
		}
		defer file.Close()

		key := stampedKeyPrefix + filepath.Base(path)
		_, err = client.PutObject(&s3.PutObjectInput{
			Body:        file,
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

		log.Printf("Uploaded s3://%s/%s", stampedBucket, key)
	}

	if anyFailed {
		os.Exit(1)
	}
}
