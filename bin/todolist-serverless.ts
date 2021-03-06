#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { TodolistServerlessStack } from "../lib/todolist-serverless-stack";
import { bundleNpm } from "../lib/process/setup";

bundleNpm();
const app = new cdk.App();
new TodolistServerlessStack(app, "TodolistServerlessStack");
