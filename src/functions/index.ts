import writeOpportunities from "./writeOpportunities";
import { dispatchOpportunityProcessedResult } from "./dispatchOpportunityProcessedResult";
import updateHubspotWithApnId from "./updateHubspotWithApnId";

export const functions = {
  writeOpportunities,
  dispatchOpportunityProcessedRslt: dispatchOpportunityProcessedResult,
  updateHubspotWithApnId,
};
