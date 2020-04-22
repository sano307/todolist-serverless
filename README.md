# Todolist API built with the serverless

## API Reference

https://github.com/sano307/todolist-serverless/wiki/API-Reference

## Certification

- AWS のアクセスキーIDとシークレットアクセスキーを設定

```shell
$ cat ~/.aws/credentials
[default]
aws_access_key_id = xxx
aws_secret_access_key = yyy
```

## Requirements

| Software                 | Install (Mac)                                | Version |
|--------------------------|----------------------------------------------|-----|
| Node.js                  | `brew install nodebrew`</br>`nodebrew install v12.12.0`</br>`nodebrew use v12.12.0` | `12.12.0` |
| npm                      | - | `6.11.3` |
| AWS CDK                  | `npm install -g aws-cdk` | `1.32.2` |

## Build

```shell
npm run build
```

## Lint

- 事前検知

```shell
npm run lint
```

- 自動的にコードのフォーマットを直し

```shell
npm run lint:fix
```

## Test

```shell
npm run test
```

## Initialize

- CloudFormation で利⽤するデプロイ⽤の S3 バケットを作成
  - 最初だけ必要なコマンド

```shell
cdk bootstrap
```

## Deploy

```shell
cdk diff
cdk deploy
```

