import { getStateName } from "@libs/utils/stepFunctions";
import { opportunityCreatedEvent } from "@libs/event";
import { stack } from "serverless";
import { aceBus } from "src/resources/eventBridge";

import { LogEvent } from "./logEvent";
import { Success } from "./endStates";

export const UpdateProcessedAceOpportunitiesInHubspot = {
  events: [
    {
      eventBridge: {
        eventBus: stack.resolve(aceBus.eventBusName),
        event: opportunityCreatedEvent.pattern,
        retryPolicy: { maximumRetryAttempts: 0 },
      },
    },
  ],
  definition: {
    StartAt: getStateName({ LogEvent }),
    States: {
      LogEvent,
      Success,
    },
  },
};
