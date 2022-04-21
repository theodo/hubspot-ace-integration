import { opportunityCreatedEvent } from "@libs/event";
import { handlerPath } from "@libs/handlerResolver";
import { stack } from "serverless";
import { aceBus } from "src/resources/eventBridge";
import { hubspotAccessToken } from "src/resources/ssm";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      eventBridge: {
        eventBus: stack.resolve(aceBus.eventBusName),
        pattern: opportunityCreatedEvent.pattern,
        retryPolicy: {
          maximumRetryAttempts: 1,
        },
      },
    },
  ],
  environment: {
    ACE_BUS_NAME: stack.resolve(aceBus.eventBusName),
    SPMS_ID: "${param:spmsId}",
    HUBSPOT_ACCESS_TOKEN_PATH: stack.resolve(hubspotAccessToken.parameterName),
    HUBSPOT_API_BASE_URL: "https://api.hubapi.com/crm/v3",
  },
};
