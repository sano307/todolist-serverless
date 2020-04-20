import { Buffer } from 'buffer';

const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';

export const handler = async (event: any = {}) : Promise <any> => {

  const sections  = event.headers["Authorization"].split('.');
  const payload = JSON.parse(Buffer.from(sections[1], 'base64').toString());

  const userId = payload["cognito:username"];
  const todoId = event.pathParameters.todoId;
  if (!userId || !todoId) {
    return { statusCode: 400, body: `Error: You are missing the path parameter` };
  }

  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :u and todoId = :t",
    ExpressionAttributeValues: {
      ":u": userId,
      ":t": todoId
    }
  };

  try {
    const response = await db.query(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Items[0]) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
