import { writeOpportunities } from "./writeOpportunities";
import { dispatchOpportunityProcessedRslt } from "./dispatchOpportunityProcessedResult";
import { updateHubspotWithApnId } from "./updateHubspotWithApnId";
import { logEvent } from "./logEvent";

export const functions = {
  writeOpportunities,
  dispatchOpportunityProcessedRslt,
  updateHubspotWithApnId,
  logEvent,
};
