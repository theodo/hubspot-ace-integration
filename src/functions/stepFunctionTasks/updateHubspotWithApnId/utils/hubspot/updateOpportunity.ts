import { InboundApiResult } from "@libs/types";
import { hubspotClient } from "@libs/hubspot/client";
import { StatusCodes } from "http-status-codes";

export const updateOpportunity = async (opportunity: InboundApiResult) => {
  if (!opportunity.isSuccess) {
    // TODO: handle errors
    console.error(
      "opportunity was not added to APN correctly with error",
      opportunity.errors
    );

    return;
  }

  const inputHubspotUpdate = {
    properties: {
      identifiant_ace: opportunity.apnCrmUniqueIdentifier,
    },
  };

  const { partnerCrmUniqueIdentifier, apnCrmUniqueIdentifier } = opportunity;

  console.log(
    `Update hubspot deal ${partnerCrmUniqueIdentifier} with ACE id ${apnCrmUniqueIdentifier}`
  );

  // Possible if Hubspot is providing the lead: We should create instead of update in this case
  if (!partnerCrmUniqueIdentifier) return;

  try {
    await hubspotClient.crm.deals.basicApi.update(
      partnerCrmUniqueIdentifier,
      inputHubspotUpdate
    );
  } catch (e) {
    const statusCode = (e as Record<string, unknown>)?.statusCode;
    if (statusCode === StatusCodes.NOT_FOUND) {
      // Deal has been deleted in Hubspot
      return;
    }
    throw e;
  }
};
