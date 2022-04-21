import type { AWS } from "@serverless/typescript";
import type { Lift } from "serverless-lift";

import { App, Stack } from "@aws-cdk/core";

// TODO make initialization in a separate file
const app = new App();
export const stack = new Stack(app);
import { functions } from "@functions/index";
import { ACES3BucketAccessRole } from "src/resources/iam";
import { hubspotAccessToken } from "src/resources/ssm";
import { aceBus } from "src/resources/eventBridge";

const serverlessConfiguration: AWS & Lift = {
  service: "hubspot-ace-integration",
  variablesResolutionMode: "20210326",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-lift"],
  constructs: {
    "hubspot-webhook": {
      type: "webhook",
      path: "/hubspot",
      insecure: true,
    },
  },
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    lambdaHashingVersion: "20201221",
    eventBridge: {
      useCloudFormation: true,
    },
    region: "eu-west-1",
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sts:AssumeRole",
            Resource: stack.resolve(ACES3BucketAccessRole.roleArn),
          },
          {
            Effect: "Allow",
            Action: "ssm:GetParameters",
            Resource: stack.resolve(hubspotAccessToken.parameterArn),
          },
          {
            Effect: "Allow",
            Action: "events:PutEvents",
            Resource: stack.resolve(aceBus.eventBusArn),
          },
          {
            Effect: "Allow",
            Resource: "arn:aws:s3:::mock-apn-bucket-adeleg",
            Action: "s3:ListBucket",
          },
          {
            Effect: "Allow",
            Resource:
              "arn:aws:s3:::mock-apn-bucket-adeleg/opportunity-inbound-processed-results/*",
            Action: ["s3:GetObject", "s3:DeleteObject"],
          },
        ],
      },
    },
  },
  params: {
    staging: {
      aceBucketName: "ace-apn-1588143-beta-us-west-2",
      spmsId: "1588143",
      apnKmsArn:
        "arn:aws:kms:us-west-2:460522042068:key/8df608f6-7332-4678-af42-722e706b829d",
    },
    prod: {
      aceBucketName: "ace-apn-1588143-prod-us-west-2",
      spmsId: "1588143",
      apnKmsArn:
        "arn:aws:kms:us-west-2:249845964689:key/9fc269db-553b-422f-b9f7-de95c2c1352c",
    },
  },
  // import the function via paths
  functions,
  package: { individually: true },
  resources: app.synth().getStackByName(stack.stackName).template,
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
