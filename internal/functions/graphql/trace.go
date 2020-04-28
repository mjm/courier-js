package graphql

import (
	"context"

	"github.com/mjm/graphql-go/errors"
	"github.com/mjm/graphql-go/introspection"
	gqltrace "github.com/mjm/graphql-go/trace"
	"go.opentelemetry.io/otel/api/global"
	"go.opentelemetry.io/otel/api/key"
	"go.opentelemetry.io/otel/api/trace"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

var tracer = global.TraceProvider().Tracer("courier.blog/internal/functions/graphql")

var (
	queryKey         = key.New("gql.query")
	operationNameKey = key.New("gql.operation_name")
	typeKey          = key.New("gql.type")
	fieldKey         = key.New("gql.field")
)

// GraphQLTracer implements gqltrace.Tracer for tracing GraphQL requests
type GraphQLTracer struct{}

var _ gqltrace.Tracer = GraphQLTracer{}

func (GraphQLTracer) TraceQuery(ctx context.Context, queryString string, operationName string, variables map[string]interface{}, varTypes map[string]*introspection.Type) (context.Context, gqltrace.TraceQueryFinishFunc) {
	if operationName == "IntrospectionQuery" {
		return ctx, func([]*errors.QueryError) {}
	}

	trace.SpanFromContext(ctx).SetAttributes(operationNameKey.String(operationName))

	ctx, span := tracer.Start(ctx, "graphql.Query",
		trace.WithAttributes(
			queryKey.String(queryString),
			operationNameKey.String(operationName)))

	return ctx, func(errs []*errors.QueryError) {
		for _, err := range errs {
			recordQueryError(ctx, span, err)
		}
		span.End()
	}
}

func (GraphQLTracer) TraceField(ctx context.Context, label, typeName, fieldName string, trivial bool, args map[string]interface{}) (context.Context, gqltrace.TraceFieldFinishFunc) {
	if trivial {
		return ctx, func(*errors.QueryError) {}
	}

	if fieldName == "__schema" || typeName == "__Schema" || typeName == "__Type" {
		return ctx, func(*errors.QueryError) {}
	}

	ctx, span := tracer.Start(ctx, label,
		trace.WithAttributes(
			typeKey.String(typeName),
			fieldKey.String(fieldName)))

	return ctx, func(err *errors.QueryError) {
		if err != nil {
			recordQueryError(ctx, span, err)
		}
		span.End()
	}
}

func recordQueryError(ctx context.Context, span trace.Span, err *errors.QueryError) {
	if err.ResolverError == nil {
		span.RecordError(ctx, err, trace.WithErrorStatus(codes.Unknown))
		return
	}

	span.RecordError(ctx, err.ResolverError, trace.WithErrorStatus(status.Code(err.ResolverError)))
}
