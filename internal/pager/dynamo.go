package pager

import (
	"context"

	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbiface"
)

// DynamoPager defines how to query for a paged results set from DynamoDB.
type DynamoPager interface {
	// EdgesQuery returns the SQL query that will fetch a page of results. Filters, sorting, and
	// limits will be appended to the string to form the final query.
	Query(cursor *Cursor) *dynamodb.QueryInput
	// ScanEdge reads a single row from the query results and constructs an Edge from it.
	ScanEdge(item map[string]*dynamodb.AttributeValue) (Edge, error)
}

func PagedDynamo(ctx context.Context, dynamo dynamodbiface.DynamoDBAPI, p DynamoPager, opts Options) (*Connection, error) {
	if opts.isReversed() {
		panic("reversing paged queries is not supported")
	}

	cursor := opts.cursor()
	input := p.Query(cursor)

	input.SetLimit(int64(opts.limit()))

	res, err := dynamo.QueryWithContext(ctx, input)
	if err != nil {
		return nil, err
	}

	var edges []Edge
	for _, item := range res.Items {
		edge, err := p.ScanEdge(item)
		if err != nil {
			return nil, err
		}

		edges = append(edges, edge)
	}

	var pageInfo PageInfo

	if res.LastEvaluatedKey != nil {
		pageInfo.HasNextPage = true
	}

	if len(edges) > 0 {
		start := edges[0].Cursor()
		pageInfo.StartCursor = &start
		end := edges[len(edges)-1].Cursor()
		pageInfo.EndCursor = &end
	}

	return &Connection{
		Edges:    edges,
		PageInfo: pageInfo,
	}, nil
}
