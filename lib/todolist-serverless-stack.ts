import { AuthorizationType, CfnAuthorizer, LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { UserPool } from '@aws-cdk/aws-cognito';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { AssetCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export class TodolistServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todolistTable = new Table(this, 'todolistTable', {
      partitionKey: {
        name: 'todoId', type: AttributeType.STRING
      },
      tableName: 'todolist',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const createTodolistLambda = new Function(this, 'createTodolistFunction', {
      runtime: Runtime.NODEJS_12_X,
      code: new AssetCode('lambda'),
      handler: 'create.handler',
      environment: {
        TABLE_NAME: todolistTable.tableName
      }
    });

    todolistTable.grantWriteData(createTodolistLambda);

    const todolistRestApi = new RestApi(this, 'todolistRestApi', {
      restApiName: 'Todolist API'
    });

    const todolistUserPool = new UserPool(this, 'todolist', {
      signInAliases: {
        email: true
      }
    });

    const authorizer = new CfnAuthorizer(this, 'cfnAuth', {
      restApiId: todolistRestApi.restApiId,
      name: 'TodolistAPIAuthorizer',
      type: 'COGNITO_USER_POOLS',
      identitySource: 'method.request.header.Authorization',
      providerArns: [todolistUserPool.userPoolArn],
    });

    const cognitoAuthorization = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.ref
      }
    };

    const todolist = todolistRestApi.root.addResource('todolist');
    const createIntegration = new LambdaIntegration(createTodolistLambda);
    todolist.addMethod("POST", createIntegration, cognitoAuthorization);
  }
}
