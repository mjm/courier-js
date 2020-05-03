package main

import (
  "github.com/aws/aws-lambda-go/lambda"

  "github.com/mjm/courier-js/internal/trace"

  lambdahandler "{IMPORT_PATH}"
)

const (
  svcname = "{SERVICE_NAME}"
)

func main() {
  trace.InitLambda(svcname)
  h, err := lambdahandler.InitializeLambda()
  if err != nil {
    panic(err)
  }

  lambda.Start(h.{HANDLER_FUNC})
}
