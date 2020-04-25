package main

import (

  "github.com/aws/aws-lambda-go/lambda"

  "github.com/mjm/courier-js/internal/functions"
  lambdahandler "{IMPORT_PATH}"
)

const (
  svcname = "{SERVICE_NAME}"
)

func main() {
  handler := functions.WrapInLambda(functions.NewHTTP(svcname, func() (functions.HTTPHandler, error) {
    return lambdahandler.InitializeLambda()
  }))
  lambda.Start(handler)
}
