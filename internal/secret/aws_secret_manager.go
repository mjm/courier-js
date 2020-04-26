package secret

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ssm"
	"github.com/aws/aws-sdk-go/service/ssm/ssmiface"
	"github.com/google/wire"

	"github.com/mjm/courier-js/internal/config"
)

var AWSSet = wire.NewSet(
	wire.Bind(new(Keeper), new(*AWSSecretKeeper)),
	wire.Bind(new(config.Secrets), new(*AWSSecretKeeper)),
	NewAWSSecretKeeper)

type AWSSecretKeeper struct {
	prefix string
	ssm    ssmiface.SSMAPI
}

func NewAWSSecretKeeper() (*AWSSecretKeeper, error) {
	sess, err := session.NewSession(aws.NewConfig())
	if err != nil {
		return nil, err
	}

	return &AWSSecretKeeper{
		prefix: os.Getenv("PARAM_PATH_PREFIX"),
		ssm:    ssm.New(sess),
	}, nil
}

func (sk *AWSSecretKeeper) GetSecret(ctx context.Context, key string) (string, error) {
	path := fmt.Sprintf("%s/%s", sk.prefix, key)
	res, err := sk.ssm.GetParameterWithContext(ctx, &ssm.GetParameterInput{
		Name:           aws.String(path),
		WithDecryption: aws.Bool(true),
	})
	if err != nil {
		if _, ok := err.(*ssm.ParameterNotFound); ok {
			log.Printf("Parameter at path %q could not be found", path)
			return "", nil
		}
		return "", err
	}

	return aws.StringValue(res.Parameter.Value), nil
}
