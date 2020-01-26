package trace

import (
	"context"

	"github.com/graph-gophers/graphql-go/errors"
	"github.com/graph-gophers/graphql-go/introspection"
	"github.com/graph-gophers/graphql-go/trace"
)

// GraphQLTracer implements trace.Tracer for tracing GraphQL requests
type GraphQLTracer struct{}

var _ trace.Tracer = GraphQLTracer{}

func (GraphQLTracer) TraceQuery(ctx context.Context, queryString string, operationName string, variables map[string]interface{}, varTypes map[string]*introspection.Type) (context.Context, trace.TraceQueryFinishFunc) {
	if operationName == "IntrospectionQuery" {
		return ctx, func([]*errors.QueryError) {}
	}

	spanCtx := Start(ctx, "GraphQL request")

	Add(spanCtx, Fields{
		"gql.query":          queryString,
		"gql.operation_name": operationName,
	})

	return spanCtx, func(errs []*errors.QueryError) {
		if len(errs) > 0 {
			msg := errs[0].Error()
			if len(errs) > 1 {
				for _, err := range errs[1:] {
					msg += "\n" + err.Error()
				}
			}

			// TODO maybe combine this into an actual multi-error thing
			AddField(ctx, "error", msg)
		}

		Finish(spanCtx)
	}
}

func (GraphQLTracer) TraceField(ctx context.Context, label, typeName, fieldName string, trivial bool, args map[string]interface{}) (context.Context, trace.TraceFieldFinishFunc) {
	if trivial {
		return ctx, func(*errors.QueryError) {}
	}

	if fieldName == "__schema" || typeName == "__Schema" || typeName == "__Type" {
		return ctx, func(*errors.QueryError) {}
	}

	spanCtx := Start(ctx, label)
	Add(spanCtx, Fields{
		"gql.type":  typeName,
		"gql.field": fieldName,
	})

	return spanCtx, func(err *errors.QueryError) {
		if err != nil {
			Error(spanCtx, err)
		}
		Finish(spanCtx)
	}
}
