package model

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/service/dynamodb"

	"github.com/mjm/courier-js/internal/db"
)

func typeAssert(expected string, attrs map[string]*dynamodb.AttributeValue) error {
	if typeStr := aws.StringValue(attrs[db.Type].S); typeStr != expected {
		return fmt.Errorf("expected a %s, got a %s", expected, typeStr)
	}
	return nil
}
