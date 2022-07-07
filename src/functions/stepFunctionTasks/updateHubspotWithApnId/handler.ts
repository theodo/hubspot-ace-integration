import { hubspotClient } from "@libs/hubspot/client";
import { middyfy } from "@libs/lambda";
import { InboundApiResult } from "@libs/types";

import { updateOpportunity } from "./utils/hubspot/updateOpportunity";

export const updateHubspotWithApnId = async (
  opportunity: InboundApiResult
): Promise<void> => {
  console.log("Full opportunity:", opportunity);

  /**
   * @debt refacto "Hydrate hubspotClient accessToken in middleware"
   */
  hubspotClient.setAccessToken(process.env.HUBSPOT_ACCESS_TOKEN as string);

  await updateOpportunity(opportunity);
};

export const main = middyfy(updateHubspotWithApnId);
