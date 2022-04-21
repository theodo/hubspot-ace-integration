import { stack } from "serverless";
import { handlerPath } from "@libs/handlerResolver";
import { ACES3BucketAccessRole } from "src/resources/iam";
import { aceBus } from "src/resources/eventBridge";

export const dispatchOpportunityProcessedResult = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      //todo: 5 min ou 1 min
      schedule: "rate(10 hours)",
    },
  ],
  environment: {
    BUCKET_NAME: "${param:aceBucketName}",
    ACE_ASSUME_ROLE_ARN: stack.resolve(ACES3BucketAccessRole.roleArn),
    ACE_BUS_NAME: stack.resolve(aceBus.eventBusName),
  },
};