package main

import (
	"context"
	"log"
	"net/http"
	"os"

	events2 "github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/segmentio/ksuid"

	"github.com/mjm/courier-js/internal/trace"
)

var port string

func main() {
	handleAllFunctions()
	trace.InitLambda("courier")

	port = os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleAllFunctions() {
	http.Handle("/graphql", graphQLHandler)
	http.Handle("/ping", pingHandler)
	http.Handle("/pusher-auth", pusherAuthHandler)
	http.Handle("/stripe-callback", stripeCallbackHandler)

	go pollForEvents()
}

func pollForEvents() {
	ctx := context.Background()
	sess := session.Must(session.NewSession())
	client := sqs.New(sess)

	for {
		select {
		case <-ctx.Done():
			return
		default:
			res, err := client.ReceiveMessageWithContext(ctx, &sqs.ReceiveMessageInput{
				MaxNumberOfMessages: aws.Int64(5),
				QueueUrl:            aws.String(os.Getenv("QUEUE_URL")),
				WaitTimeSeconds:     aws.Int64(20),
			})
			if err != nil {
				log.Fatal(err)
				return
			}

			if len(res.Messages) == 0 {
				continue
			}

			var msgs []events2.SQSMessage
			for _, m := range res.Messages {
				attrs := make(map[string]string)
				for k, v := range m.Attributes {
					attrs[k] = aws.StringValue(v)
				}
				msgAttrs := make(map[string]events2.SQSMessageAttribute)
				for k, v := range m.MessageAttributes {
					msgAttrs[k] = events2.SQSMessageAttribute{
						StringValue:      v.StringValue,
						BinaryValue:      v.BinaryValue,
						StringListValues: aws.StringValueSlice(v.StringListValues),
						BinaryListValues: v.BinaryListValues,
						DataType:         aws.StringValue(v.DataType),
					}
				}

				msg := events2.SQSMessage{
					MessageId:              aws.StringValue(m.MessageId),
					ReceiptHandle:          aws.StringValue(m.ReceiptHandle),
					Body:                   aws.StringValue(m.Body),
					Md5OfBody:              aws.StringValue(m.MD5OfBody),
					Md5OfMessageAttributes: aws.StringValue(m.MD5OfMessageAttributes),
					Attributes:             attrs,
					MessageAttributes:      msgAttrs,
					EventSourceARN:         "",
					EventSource:            "",
					AWSRegion:              "",
				}
				msgs = append(msgs, msg)
			}

			if err := eventsHandler.HandleSQS(ctx, events2.SQSEvent{Records: msgs}); err != nil {
				log.Println(err)
				continue
			}

			var deleteEntries []*sqs.DeleteMessageBatchRequestEntry
			for _, m := range res.Messages {
				deleteEntries = append(deleteEntries, &sqs.DeleteMessageBatchRequestEntry{
					Id:            aws.String(ksuid.New().String()),
					ReceiptHandle: aws.String(*m.ReceiptHandle),
				})
			}

			_, err = client.DeleteMessageBatchWithContext(ctx, &sqs.DeleteMessageBatchInput{
				Entries:  deleteEntries,
				QueueUrl: aws.String(os.Getenv("QUEUE_URL")),
			})
			if err != nil {
				log.Println(err)
				return
			}
		}
	}
}
