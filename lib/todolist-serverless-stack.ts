import { LambdaRestApi } from '@aws-cdk/aws-apigateway';
import { UserPool } from '@aws-cdk/aws-cognito';
import { AssetCode, Function, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export class TodolistServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todolistFunction = new Function(this, 'todolistFunction', {
      runtime: Runtime.NODEJS_12_X,
      code: new AssetCode('lambda'),
      handler: 'index.handler'
    });

    const todolistUserPool = new UserPool(this, 'todolist', {
      signInAliases: {
        email: true
      }
    });

    const todolistLambdaRestApi = new LambdaRestApi(this, 'todolistRestApi', {
      restApiName: 'Todolist API',
      handler: todolistFunction,
      proxy: false
    });
    todolistLambdaRestApi.root.addMethod("GET")
  }
}
