import {
  AccountPrincipal,
  Effect,
  PolicyStatement,
  Role,
} from "@aws-cdk/aws-iam";

import { stack } from "serverless";

export const ACES3BucketAccessRole = new Role(stack, "ACES3BucketAccessRole", {
  assumedBy: new AccountPrincipal(stack.account),
  roleName: "APN-ACE-Theodo-AccessRole-${sls:stage}",
});

ACES3BucketAccessRole.addToPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["s3:ListBucket"],
    resources: ["arn:aws:s3:::${param:aceBucketName}"],
  })
);

ACES3BucketAccessRole.addToPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "s3:GetObject",
      "s3:PutObjectTagging",
      "s3:GetObjectTagging",
      "s3:DeleteObjectTagging",
      "s3:DeleteObject",
      "s3:PutObject",
      "s3:PutObjectAcl",
    ],
    resources: ["arn:aws:s3:::${param:aceBucketName}/*"],
  })
);

ACES3BucketAccessRole.addToPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: [
      "kms:Encrypt",
      "kms:Decrypt",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:DescribeKey",
    ],
    resources: ["${param:apnKmsArn}"],
  })
);
