import * as AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();

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
    ClientId: event.headers["client-id"],
    Username: item["email"],
    Password: item["password"],
  };

  try {
    await cognito.signUp(params).promise();
    return { statusCode: 200, body: "" };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify(e) };
  }
};
