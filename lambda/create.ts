import * as AWS from "aws-sdk";
import { DateTime } from "luxon";
import * as uuid from "uuid";

const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || "";

const RESERVED_RESPONSE = `Error: You're using AWS reserved keywords as attributes`,
  DYNAMODB_EXECUTION_ERROR = `Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.`;

export const handler = async (event: any = {}): Promise<any> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: "invalid request, you are missing the parameter body",
    };
  }

  const sections = event.headers["Authorization"].split(".");
  const payload = JSON.parse(Buffer.from(sections[1], "base64").toString());

  const currentTime = DateTime.utc().toMillis();
  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);
  item["userId"] = payload["cognito:username"];
  item["todoId"] = uuid.v4();
  item["createdAt"] = currentTime;
  item["updatedAt"] = currentTime;

  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };

  try {
    await db.put(params).promise();

    return { statusCode: 201, body: "" };
  } catch (dbError) {
    const errorResponse =
      dbError.code === "ValidationException" &&
      dbError.message.includes("reserved keyword")
        ? DYNAMODB_EXECUTION_ERROR
        : RESERVED_RESPONSE;

    return { statusCode: 500, body: errorResponse };
  }
};
