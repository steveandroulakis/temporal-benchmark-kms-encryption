# Deploy Lambda functions

This AWS Cloud Development Kit (CDK) code deploys a KMS CMK to your environment.

## Build

To build this app, you need to be in this example's root folder. Then run the following:

```bash
npm install -g aws-cdk
npm install
npm run build
```

This will install the necessary CDK, then this example's dependencies.

## Deploy

Run `cdk deploy`. This will deploy / redeploy your Stack including a new KMS key to your AWS Account.