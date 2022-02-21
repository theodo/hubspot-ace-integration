import writeOpportunities from "./writeOpportunities";
import { dispatchOpportunityInboundProcessedResult } from "./dispatchOpportunityInboundProcessedResult";
import updateHubspotWithApnId from "./updateHubspotWithApnId";

export const functions = {
  writeOpportunities,
  dispatchOpportunityInboundProcessedResult,
  updateHubspotWithApnId,
};
