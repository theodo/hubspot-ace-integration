import { handlerPath } from "@libs/handlerResolver";
import { stack } from "serverless";
import { hubspotAccessToken } from "src/resources/ssm";
import { ACES3BucketAccessRole } from "src/resources/iam";

export const writeOpportunities = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      eventBridge: {
        eventBus: "${construct:hubspot-webhook.busName}",
        pattern: {
          "detail-type": ["Webhook"],
        },
      },
    },
  ],
  environment: {
    BUCKET_NAME: "${param:aceBucketName}",
    HUBSPOT_ACCESS_TOKEN_PATH: stack.resolve(hubspotAccessToken.parameterName),
    HUBSPOT_API_BASE_URL: "https://api.hubapi.com/crm/v3",
    SPMS_ID: "${param:spmsId}",
    ACE_ASSUME_ROLE_ARN: stack.resolve(ACES3BucketAccessRole.roleArn),
  },
};
