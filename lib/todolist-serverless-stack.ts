import { EmptyModel, MockIntegration, PassthroughBehavior, RestApi } from '@aws-cdk/aws-apigateway';
import { UserPool } from '@aws-cdk/aws-cognito';
import * as cdk from '@aws-cdk/core';

export class TodolistServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todolistUserPool = new UserPool(this, 'todolist', {
      signInAliases: {
        email: true
      }
    });

    const todolistRestApi = new RestApi(this, 'todolistRestApi', {
      restApiName: 'Todolist API'
    });
    todolistRestApi.root.addMethod("GET", new MockIntegration({
      integrationResponses: [{
        statusCode: "200",
        responseParameters: {
          "method.response.header.Access-Control-Allow-Headers":
            "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
          "method.response.header.Access-Control-Allow-Origin": "'*'",
          "method.response.header.Access-Control-Allow-Credentials": "'false'",
          "method.response.header.Access-Control-Allow-Methods": "'GET'",
        }
      }],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": "{\"statusCode\": 200}"
      }
    }), {
      methodResponses: [{
        statusCode: "200",
        responseParameters: {
          "method.response.header.Access-Control-Allow-Headers": true,
          "method.response.header.Access-Control-Allow-Origin": true,
          "method.response.header.Access-Control-Allow-Credentials": true,
          "method.response.header.Access-Control-Allow-Methods": true,
        },
        responseModels: {
          "application/json": new EmptyModel()
        },
      }]
    })
  }
}
