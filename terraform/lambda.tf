data "archive_file" "lambda_package" {
  type        = "zip"
  source_dir  = "${path.module}/../src"
  output_path = "${path.module}/../lambda.zip"
}

resource "aws_lambda_function" "shorten_lambda" {
  function_name = "${var.project_name}-shorten"
  role          = aws_iam_role.lambda_role.arn
  handler       = "src/handler.handler"
  runtime       = "nodejs16.x"

  filename         = data.archive_file.lambda_package.output_path
  source_code_hash = data.archive_file.lambda_package.output_base64sha256

  environment {
    variables = {
      DYNAMODB_TABLE_NAME = aws_dynamodb_table.urls.name
      BASE_URL            = var.base_url
    }
  }
}
