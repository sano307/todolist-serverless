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
| Node.js                  | `brew install nodebrew` | `12.16.2` |
| npm                      | - | `6.14.4` |
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
