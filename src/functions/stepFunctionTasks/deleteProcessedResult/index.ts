import { handlerPath } from "@libs/handlerResolver";
import { stack } from "serverless";
import { ACES3BucketAccessRole } from "src/resources/iam";

export const deleteProcessedResult = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    BUCKET_NAME: "${param:aceBucketName}",
    ACE_ASSUME_ROLE_ARN: stack.resolve(ACES3BucketAccessRole.roleArn),
    TESTING: "1",
  },
};
