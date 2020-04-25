import * as AWS from "aws-sdk";

const cognito = new AWS.CognitoIdentityServiceProvider();
const CLIENT_ID = process.env.CLIENT_ID || "";

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
    ClientId: CLIENT_ID,
    Username: item["email"],
    ConfirmationCode: item["code"],
  };

  try {
    await cognito.confirmSignUp(params).promise();
    return { statusCode: 200, body: "" };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
