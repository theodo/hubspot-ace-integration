import type { AWS } from '@serverless/typescript';
import type { Lift } from 'serverless-lift';

import hello from '@functions/hello';

const serverlessConfiguration: AWS & Lift = {
  service: 'hubspot-ace-integration',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-lift'],
  constructs: {
    'hubspot-webhook': {
      type: 'webhook',
      path: '/hubspot',
      insecure: true,
    },
    'hubspot-s3': {
      type: 'storage'
    }
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
    profile: "ace-integration-staging",
    eventBridge: {
      useCloudFormation: true
    },
    region: 'eu-west-1'
  },
  // import the function via paths
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
