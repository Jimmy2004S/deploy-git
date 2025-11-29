output "api_endpoint" {
  value       = aws_apigatewayv2_api.http_api.api_endpoint
  description = "Endpoint base del API HTTP"
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.urls.name
  description = "Nombre de la tabla DynamoDB compartida"
}
