import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import TodolistServerless = require('../lib/todolist-serverless-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new TodolistServerless.TodolistServerlessStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
