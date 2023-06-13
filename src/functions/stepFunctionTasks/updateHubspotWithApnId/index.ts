import { handlerPath } from "@libs/handlerResolver";
import { stack } from "serverless";
import { ACES3BucketAccessRole } from "src/resources/iam";
import { hubspotAccessToken } from "src/resources/ssm";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    SPMS_ID: "${param:spmsId}",
    HUBSPOT_ACCESS_TOKEN_PATH: stack.resolve(hubspotAccessToken.parameterName),
    HUBSPOT_API_BASE_URL: "https://api.hubapi.com/crm/v3",
    ACE_ASSUME_ROLE_ARN: stack.resolve(ACES3BucketAccessRole.roleArn),
  },
};
