import { newlyCreatedOpprutinityEvent } from "@libs/event";
import { handlerPath } from "@libs/handlerResolver";
import { stack } from "serverless";
import { aceBus } from "src/resources/eventBridge";
import { hubspotAccessToken } from "src/resources/ssm";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      eventBridge: {
        eventBus: stack.resolve(aceBus.eventBusArn),
        pattern: newlyCreatedOpprutinityEvent.pattern,
      },
    },
  ],
  environment: {
    BUCKET_NAME: "ace-apn-1588143-beta-us-west-2",
    ACE_BUS_NAME: stack.resolve(aceBus.eventBusName),
    SPMS_ID: "1588143",
    HUBSPOT_ACCESS_TOKEN_PATH: stack.resolve(hubspotAccessToken.parameterName),
    HUBSPOT_API_BASE_URL: "https://api.hubapi.com/crm/v3",
  },
};
