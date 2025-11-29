variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "project_name" {
  type        = string
  description = "Nombre del proyecto/módulo"
}

variable "dynamodb_table_name" {
  type        = string
  description = "Nombre de la tabla DynamoDB compartida"
}

variable "base_url" {
  type        = string
  description = "URL base para los links acortados (ej: https://miweb.com)"
}
