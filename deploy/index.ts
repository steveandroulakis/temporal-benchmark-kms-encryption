import * as cdk from 'aws-cdk-lib';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as iam from 'aws-cdk-lib/aws-iam'; // IAM module for role and policy

export class KMSEncryptionBenchmarkStack extends cdk.Stack {
  constructor(app: cdk.App, id: string) {
    super(app, id);

    // Creates a limited admin policy and assigns to the account root.
    const myCustomPolicy = new iam.PolicyDocument({
      statements: [new iam.PolicyStatement({
        actions: [
          'kms:Create*',
          'kms:Describe*',
          'kms:Enable*',
          'kms:List*',
          'kms:Put*',
          'kms:Get*',
          'kms:GenerateDataKey',
          'kms:Decrypt',
          'kms:Encrypt',
          'kms:ReEncrypt*',
        ],        
        principals: [new iam.AccountRootPrincipal()],
        resources: ['*'],
      })],
    });
    new kms.Key(this, 'steveCDKkey', {
      policy: myCustomPolicy,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}

const app = new cdk.App();
new KMSEncryptionBenchmarkStack(app, 'KMS-Encryption-Benchmark-Stack');
app.synth();
