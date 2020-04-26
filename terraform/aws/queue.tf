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
  function_name    = module.events_function.function_name
  event_source_arn = aws_sqs_queue.events.arn
  batch_size       = 5
}

resource "aws_ssm_parameter" "events-queue-url" {
  name  = "/courier/${var.env}/events/queue-url"
  type  = "String"
  value = aws_sqs_queue.events.id
}

data "aws_iam_policy_document" "enqueue_events" {
  statement {
    actions = [
      "sqs:SendMessage*"
    ]
    resources = [
      aws_sqs_queue.events.arn
    ]
  }
}

resource "aws_iam_policy" "enqueue_events" {
  name   = "courier-${var.env}-enqueue-events"
  policy = data.aws_iam_policy_document.enqueue_events.json
}
