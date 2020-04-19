# todolist-serverless

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

## Test

```shell
npm run test
```

## Deploy

```shell
cdk diff
cdk deploy
```
