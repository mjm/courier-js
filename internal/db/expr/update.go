package expr

import (
	"fmt"
	"strings"

	"github.com/aws/aws-sdk-go/service/dynamodb"
)

type UpdateBuilder struct {
	setClauses    []string
	removeClauses []string
	vals          map[string]*dynamodb.AttributeValue
}

func (b *UpdateBuilder) SetString(col string, val string) {
	if val == "" {
		b.Remove(col)
	} else {
		b.Set(col, &dynamodb.AttributeValue{S: &val})
	}
}

func (b *UpdateBuilder) Set(col string, val *dynamodb.AttributeValue) {
	b.initValsIfNeeded()

	c := fmt.Sprintf("#%s = :%s", col, col)
	b.setClauses = append(b.setClauses, c)
	b.vals[":"+col] = val
}

func (b *UpdateBuilder) Remove(col string) {
	b.removeClauses = append(b.removeClauses, "#"+col)
}

func (b *UpdateBuilder) Apply(input *dynamodb.UpdateItemInput) {
	input.SetUpdateExpression(b.buildUpdateExpression())

	if input.ExpressionAttributeValues == nil {
		input.ExpressionAttributeValues = make(map[string]*dynamodb.AttributeValue)
	}

	for k, v := range b.vals {
		input.ExpressionAttributeValues[k] = v
	}
}

func (b *UpdateBuilder) initValsIfNeeded() {
	if b.vals == nil {
		b.vals = make(map[string]*dynamodb.AttributeValue)
	}
}

func (b *UpdateBuilder) buildUpdateExpression() string {
	var clauses []string

	if len(b.setClauses) > 0 {
		c := "SET " + strings.Join(b.setClauses, ", ")
		clauses = append(clauses, c)
	}

	if len(b.removeClauses) > 0 {
		c := "REMOVE " + strings.Join(b.removeClauses, ", ")
		clauses = append(clauses, c)
	}

	return strings.Join(clauses, " ")
}
