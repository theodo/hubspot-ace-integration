import { handlerPath } from "@libs/handlerResolver";
import { stack } from "serverless";
import { aceBus } from "src/resources/eventBridge";
import { ACES3BucketAccessRole } from "src/resources/iam";
import { hubspotAccessToken } from "src/resources/ssm";

export const logEvent = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  timeout: 900,
  environment: {
    ACE_BUS_NAME: stack.resolve(aceBus.eventBusName),
    SPMS_ID: "${param:spmsId}",
    HUBSPOT_ACCESS_TOKEN_PATH: stack.resolve(hubspotAccessToken.parameterName),
    HUBSPOT_API_BASE_URL: "https://api.hubapi.com/crm/v3",
    ACE_ASSUME_ROLE_ARN: stack.resolve(ACES3BucketAccessRole.roleArn),
    BUCKET_NAME: "${param:aceBucketName}",
  },
};
