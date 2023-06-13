import writeOpportunities from "./writeOpportunities";
import { dispatchOpportunityProcessedResult } from "./dispatchOpportunityProcessedResult";
import updateHubspotWithApnId from "./stepFunctionTasks/updateHubspotWithApnId";
import { fetchProcessedResult } from "./stepFunctionTasks/fetchProcessedResult";
import { deleteProcessedResult } from "./stepFunctionTasks/deleteProcessedResult";

export const functions = {
  writeOpportunities,
  dispatchOpportunityProcessedRslt: dispatchOpportunityProcessedResult,
  updateHubspotWithApnId,
  fetchProcessedResult,
  deleteProcessedResult,
};
