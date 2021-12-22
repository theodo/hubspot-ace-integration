import { handlerPath } from "@libs/handlerResolver";
import { stack } from "serverless";
import { hubspotAccessToken } from "src/resources/ssm";

export default {
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
    BUCKET_NAME: "ace-apn-1588143-beta-us-west-2",
    HUBSPOT_ACCESS_TOKEN_PATH: stack.resolve(hubspotAccessToken.parameterName),
  },
};
