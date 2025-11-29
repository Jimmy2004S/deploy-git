resource "aws_dynamodb_table" "urls" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "code"

  attribute {
    name = "code"
    type = "S"
  }

  # Aquí se podrían agregar índices secundarios si tu profe/luego lo pide
}
