resource "aws_sqs_queue" "events" {
  name                      = "courier-${var.env}-events"
  message_retention_seconds = 86400

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.events_dead_letter.arn,
    maxReceiveCount     = 10,
  })

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

resource "aws_sqs_queue" "events_dead_letter" {
  name                      = "courier-${var.env}-events-dead-letter"
  message_retention_seconds = 604800

  tags = {
    Project     = "courier"
    Environment = var.env
  }
}

resource "aws_lambda_event_source_mapping" "events" {
  function_name    = aws_lambda_function.events.function_name
  event_source_arn = aws_sqs_queue.events.arn
  batch_size       = 5
}
