import * as AWS from "aws-sdk";
import { Buffer } from "buffer";

const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";

export const handler = async (event: any = {}): Promise<any> => {
  const sections = event.headers["Authorization"].split(".");
  const payload = JSON.parse(Buffer.from(sections[1], "base64").toString());

  const userId = payload["cognito:username"];
  if (!userId) {
    return {
      statusCode: 400,
      body: `Error: You are missing the path parameter`,
    };
  }

  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :u",
    ExpressionAttributeValues: {
      ":u": userId,
    },
  };

  try {
    const response = await db.query(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Items) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
