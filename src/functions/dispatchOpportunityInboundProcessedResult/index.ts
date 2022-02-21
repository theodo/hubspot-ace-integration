import { stack } from "serverless";
import { handlerPath } from "@libs/handlerResolver";
import { ACES3BucketAccessRole } from "src/resources/iam";

export const dispatchOpportunityInboundProcessedResult = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      schedule: "rate(10 hours)",
    },
  ],
  environment: {
    BUCKET_NAME: "${param:aceBucketName}",
    ACE_ASSUME_ROLE_ARN: stack.resolve(ACES3BucketAccessRole.roleArn),
  },
};
