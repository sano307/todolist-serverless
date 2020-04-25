import {
  AuthorizationType,
  CfnAuthorizer,
  LambdaIntegration,
  RestApi,
} from "@aws-cdk/aws-apigateway";
import { UserPool } from "@aws-cdk/aws-cognito";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import {
  AssetCode,
  Function,
  LayerVersion,
  Runtime,
} from "@aws-cdk/aws-lambda";
import { NODE_LAMBDA_LAYER_DIR } from "./process/setup";
import * as cdk from "@aws-cdk/core";

export class TodolistServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const TODOLIST_TABLE_NAME = "todolist";
    const TODOLIST_TABLE_PARTITION_KEY = "userId";
    const TODOLIST_TABLE_SORT_KEY = "todoId";

    const todolistTable = new Table(this, "todolistTable", {
      partitionKey: {
        name: TODOLIST_TABLE_PARTITION_KEY,
        type: AttributeType.STRING,
      },
      sortKey: { name: TODOLIST_TABLE_SORT_KEY, type: AttributeType.STRING },
      tableName: "todolist",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const nodeModulesLayer = new LayerVersion(this, "NodeModulesLayer", {
      code: AssetCode.fromAsset(NODE_LAMBDA_LAYER_DIR),
      compatibleRuntimes: [Runtime.NODEJS_12_X],
    });

    const signUpLambda = new Function(this, "signUpFunction", {
      runtime: Runtime.NODEJS_12_X,
      code: new AssetCode("lambda"),
      handler: "sign-up.handler"
    });

    const confirmSignUpLambda = new Function(this, "confirmSignUpFunction", {
      runtime: Runtime.NODEJS_12_X,
      code: new AssetCode("lambda"),
      handler: "confirm-sign-up.handler"
    });

    const createTodolistLambda = new Function(this, "createTodolistFunction", {
      runtime: Runtime.NODEJS_12_X,
      code: new AssetCode("lambda"),
      handler: "create.handler",
      layers: [nodeModulesLayer],
      environment: {
        TABLE_NAME: TODOLIST_TABLE_NAME,
      },
    });

    const readAllTodolistLambda = new Function(
      this,
      "readAllTodolistFunction",
      {
        runtime: Runtime.NODEJS_12_X,
        code: new AssetCode("lambda"),
        handler: "read-all.handler",
        environment: {
          TABLE_NAME: TODOLIST_TABLE_NAME,
        },
      }
    );

    const readOneTodolistLambda = new Function(
      this,
      "readOneTodolistFunction",
      {
        runtime: Runtime.NODEJS_12_X,
        code: new AssetCode("lambda"),
        handler: "read-one.handler",
        environment: {
          TABLE_NAME: TODOLIST_TABLE_NAME,
          PARTITION_KEY: TODOLIST_TABLE_PARTITION_KEY,
          SORT_KEY: TODOLIST_TABLE_SORT_KEY,
        },
      }
    );

    const updateTodolistLambda = new Function(this, "updateTodolistFunction", {
      runtime: Runtime.NODEJS_12_X,
      code: new AssetCode("lambda"),
      handler: "update.handler",
      layers: [nodeModulesLayer],
      environment: {
        TABLE_NAME: TODOLIST_TABLE_NAME,
        PARTITION_KEY: TODOLIST_TABLE_PARTITION_KEY,
        SORT_KEY: TODOLIST_TABLE_SORT_KEY,
      },
    });

    const deleteTodolistLambda = new Function(this, "deleteTodolistFunction", {
      runtime: Runtime.NODEJS_12_X,
      code: new AssetCode("lambda"),
      handler: "delete.handler",
      environment: {
        TABLE_NAME: TODOLIST_TABLE_NAME,
        PARTITION_KEY: TODOLIST_TABLE_PARTITION_KEY,
        SORT_KEY: TODOLIST_TABLE_SORT_KEY,
      },
    });

    todolistTable.grantWriteData(createTodolistLambda);
    todolistTable.grantReadData(readAllTodolistLambda);
    todolistTable.grantReadData(readOneTodolistLambda);
    todolistTable.grantWriteData(updateTodolistLambda);
    todolistTable.grantWriteData(deleteTodolistLambda);

    const todolistRestApi = new RestApi(this, "todolistRestApi", {
      restApiName: "Todolist API",
    });

    const todolistUserPool = new UserPool(this, "todolist", {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
      },
    });

    const authorizer = new CfnAuthorizer(this, "cfnAuth", {
      restApiId: todolistRestApi.restApiId,
      name: "TodolistAPIAuthorizer",
      type: "COGNITO_USER_POOLS",
      identitySource: "method.request.header.Authorization",
      providerArns: [todolistUserPool.userPoolArn],
    });

    const cognitoAuthorization = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.ref,
      },
    };

    const signUpIntegration = new LambdaIntegration(signUpLambda);
    todolistRestApi.root.addResource("signup").addMethod("POST", signUpIntegration);

    const confirmSignUpIntegration = new LambdaIntegration(confirmSignUpLambda);
    todolistRestApi.root.addResource("confirm_signup").addMethod("POST", confirmSignUpIntegration);

    const todolist = todolistRestApi.root.addResource("todolists");
    const createIntegration = new LambdaIntegration(createTodolistLambda);
    todolist.addMethod("POST", createIntegration, cognitoAuthorization);

    const readAllIntegration = new LambdaIntegration(readAllTodolistLambda);
    todolist.addMethod("GET", readAllIntegration, cognitoAuthorization);

    const todolistForSingle = todolist.addResource("{todoId}");
    const readOneIntegration = new LambdaIntegration(readOneTodolistLambda);
    todolistForSingle.addMethod(
      "GET",
      readOneIntegration,
      cognitoAuthorization
    );

    const updateIntegration = new LambdaIntegration(updateTodolistLambda);
    todolistForSingle.addMethod(
      "PATCH",
      updateIntegration,
      cognitoAuthorization
    );

    const deleteIntegration = new LambdaIntegration(deleteTodolistLambda);
    todolistForSingle.addMethod(
      "DELETE",
      deleteIntegration,
      cognitoAuthorization
    );
  }
}
