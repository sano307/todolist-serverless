import { SynthUtils } from '@aws-cdk/assert';
import { App } from '@aws-cdk/core';
import { TodolistServerlessStack } from '../lib/todolist-serverless-stack';

describe('todolist', () => {
  test('default', () => {
    const app = new App();
    const stack = new TodolistServerlessStack(app, "TestTodolistServerlessStack");
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
  });
});
