import * as AWS from "aws-sdk";
import { Buffer } from "buffer";
import { DateTime } from "luxon";

const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";
const PARTITION_KEY = process.env.PARTITION_KEY || "";
const SORT_KEY = process.env.SORT_KEY || "";

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

export const handler = async (event: any = {}): Promise<any> => { // eslint-disable-line
  if (!event.body) {
    return {
      statusCode: 400,
      body: "invalid request, you are missing the parameter body",
    };
  }

  const sections = event.headers["Authorization"].split(".");
  const payload = JSON.parse(Buffer.from(sections[1], "base64").toString());

  const userId = payload["cognito:username"];
  const todoId = event.pathParameters.todoId;
  if (!userId || !todoId) {
    return {
      statusCode: 400,
      body: "invalid request, you are missing the path parameter",
    };
  }

  const currentTime = DateTime.utc().toMillis();
  const editedItem =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  editedItem["updatedAt"] = currentTime;

  const editedItemProperties = Object.keys(editedItem);
  if (!editedItem || editedItemProperties.length < 1) {
    return { statusCode: 400, body: "invalid request, no arguments provided" };
  }

  const firstProperty = editedItemProperties.splice(0, 1);
  const params: any = { // eslint-disable-line
    TableName: TABLE_NAME,
    Key: {
      [PARTITION_KEY]: userId,
      [SORT_KEY]: todoId,
    },
    UpdateExpression: `set ${firstProperty} = :${firstProperty}`,
    ExpressionAttributeValues: {},
    ReturnValues: "UPDATED_NEW",
  };
  params.ExpressionAttributeValues[`:${firstProperty}`] =
    editedItem[`${firstProperty}`];

  editedItemProperties.forEach((property) => {
    params.UpdateExpression += `, ${property} = :${property}`;
    params.ExpressionAttributeValues[`:${property}`] = editedItem[property];
  });

  try {
    await db.update(params).promise();

    return { statusCode: 204, body: "" };
  } catch (dbError) {
    const errorResponse =
      dbError.code === "ValidationException" &&
      dbError.message.includes("reserved keyword")
        ? DYNAMODB_EXECUTION_ERROR
        : RESERVED_RESPONSE;

    return { statusCode: 500, body: errorResponse };
  }
};
