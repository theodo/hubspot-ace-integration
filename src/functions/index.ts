import { writeOpportunities } from "./writeOpportunities";
import { dispatchOpportunityProcessedRslt } from "./dispatchOpportunityProcessedResult";
import { updateHubspotWithApnId } from "./updateHubspotWithApnId";

export const functions = {
  writeOpportunities,
  dispatchOpportunityProcessedRslt,
  updateHubspotWithApnId,
};
