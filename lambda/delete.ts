import * as AWS from "aws-sdk";

const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";
const PARTITION_KEY = process.env.PARTITION_KEY || "";
const SORT_KEY = process.env.SORT_KEY || "";

export const handler = async (event: any = {}): Promise<any> => { // eslint-disable-line
  const sections = event.headers["Authorization"].split(".");
  const payload = JSON.parse(Buffer.from(sections[1], "base64").toString());

  const userId = payload["cognito:username"];
  const todoId = event.pathParameters.todoId;
  if (!userId || !todoId) {
    return {
      statusCode: 400,
      body: `Error: You are missing the path parameter`,
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      [PARTITION_KEY]: userId,
      [SORT_KEY]: todoId,
    },
  };

  try {
    await db.delete(params).promise();

    return { statusCode: 200, body: "" };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
