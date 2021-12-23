import type { AWS } from "@serverless/typescript";
import type { Lift } from "serverless-lift";

import { App, Stack } from "@aws-cdk/core";

// TODO make initialization in a separate file
const app = new App();
export const stack = new Stack(app);
import functions from "@functions/index";
import { ACES3BucketAccessRole } from "src/resources/iam";
import { hubspotAccessToken } from "src/resources/ssm";

const serverlessConfiguration: AWS & Lift = {
  service: "hubspot-ace-integration",
  frameworkVersion: "2",
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
    profile: "ace-integration-staging",
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
        ],
      },
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
