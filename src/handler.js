const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const BASE_URL = process.env.BASE_URL; // ej: https://miweb.com

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

function generateCode(length = 6) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event));

  try {
    const body =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;

    if (!body || !body.url) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Campo 'url' es requerido" }),
      };
    }

    const originalUrl = body.url;

    if (!isValidUrl(originalUrl)) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "URL inválida" }),
      };
    }

    const code = generateCode();
    const now = new Date().toISOString();

    const item = {
      code,
      originalUrl,
      createdAt: now,
      clicksTotal: 0,
    };

    await dynamo
      .put({
        TableName: TABLE_NAME,
        Item: item,
        ConditionExpression: "attribute_not_exists(code)", // no sobrescribir
      })
      .promise();

    const shortUrl = `${BASE_URL}/${code}`;

    return {
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        shortUrl,
        originalUrl,
      }),
    };
  } catch (err) {
    console.error("Error acortando URL:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error interno" }),
    };
  }
};
