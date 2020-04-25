import '@aws-cdk/assert/jest'
import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { TodolistServerlessStack } from '../lib/todolist-serverless-stack';

describe('todolist', () => {
  test('Snapshot', () => {
    const app = new App();
    const stack = new TodolistServerlessStack(app, "TestTodolistServerlessStack");
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });

  test('Fine-grained for AWS::ApiGateway', () => {
    const app = new App();
    const stack = new TodolistServerlessStack(app, "TestTodolistServerlessStack");

    expect(stack).toHaveResource('AWS::ApiGateway::Authorizer', {
      RestApiId: {
        Ref: "todolistRestApi76E97FC8"
      },
      Type: "COGNITO_USER_POOLS",
      IdentitySource: "method.request.header.Authorization",
      Name: "TodolistAPIAuthorizer",
      ProviderARNs: [
        {
          "Fn::GetAtt": [
            "todolist5A026F19",
            "Arn"
          ]
        }
      ]
    })
  })

  test('Fine-grained for AWS::Cognito', () => {
    const app = new App();
    const stack = new TodolistServerlessStack(app, "TestTodolistServerlessStack");

    expect(stack).toHaveResource('AWS::Cognito::UserPool', {
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: false
      },
      AutoVerifiedAttributes: [
        "email"
      ],
      EmailVerificationMessage: "Hello {username}, Your verification code is {####}",
      EmailVerificationSubject: "Verify your new account",
      SmsConfiguration: {
        ExternalId: "TestTodolistServerlessStacktodolist27FB5F4F",
        SnsCallerArn: {
          "Fn::GetAtt": [
            "todolistsmsRoleA9EEDED2",
            "Arn"
          ]
        }
      },
      SmsVerificationMessage: "The verification code to your new account is {####}",
      UsernameAttributes: [
        "email"
      ],
      VerificationMessageTemplate: {
        DefaultEmailOption: "CONFIRM_WITH_CODE",
        EmailMessage: "Hello {username}, Your verification code is {####}",
        EmailSubject: "Verify your new account",
        SmsMessage: "The verification code to your new account is {####}"
      }
    })
  });

  test('Fine-grained for AWS::DynamoDB', () => {
    const app = new App();
    const stack = new TodolistServerlessStack(app, "TestTodolistServerlessStack");

    expect(stack).toHaveResource('AWS::DynamoDB::Table', {
      KeySchema: [
        {
          AttributeName: "userId",
          KeyType: "HASH"
        },
        {
          AttributeName: "todoId",
          KeyType: "RANGE"
        }
      ],
      AttributeDefinitions: [
        {
          AttributeName: "userId",
          AttributeType: "S"
        },
        {
          AttributeName: "todoId",
          AttributeType: "S"
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      TableName: "todolist"
    })
  });
});
