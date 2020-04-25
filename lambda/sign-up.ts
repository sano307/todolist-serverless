import * as AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();
const WUNDER_LIST_CLIENT_ID = "5ma31tppl2v2641mlp9q2jsa6q";

export const handler = async (event: any = {}): Promise<any> => { // eslint-disable-line

  if (!event.body) {
    return {
      statusCode: 400,
      body: "invalid request, you are missing the parameter body",
    };
  }

  const item =
    typeof event.body == "object" ? event.body : JSON.parse(event.body);

  const params = {
    ClientId: WUNDER_LIST_CLIENT_ID,
    Username: item["email"],
    Password: item["password"],
  };

  try {
    await cognito.signUp(params).promise();
    return { statusCode: 200, body: "" };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
