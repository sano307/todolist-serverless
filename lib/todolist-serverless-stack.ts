import * as cdk from '@aws-cdk/core';
import { UserPool } from '@aws-cdk/aws-cognito'

export class TodolistServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todolistUserPool = new UserPool(this, 'todolist', {
      signInAliases: {
        email: true
      }
    })
  }
}
