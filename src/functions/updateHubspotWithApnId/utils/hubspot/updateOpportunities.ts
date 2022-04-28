import { InboundApiResult } from "@libs/types";
import { hubspotClient } from "@libs/hubspot/client";

export const updateOpportunities = (opportunities: InboundApiResult[]) =>
  Promise.all(
    opportunities.map(async (opportunity) => {
      if (!opportunity.isSuccess) {
        // TODO: handle errors
        console.log(
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

      const { partnerCrmUniqueIdentifier, apnCrmUniqueIdentifier } =
        opportunity;

      console.log(
        `Update hubspot deal ${partnerCrmUniqueIdentifier} with ACE id ${apnCrmUniqueIdentifier}`
      );

      // Possible if Hubspot is providing the lead: We should create instead of update in this case
      if (!partnerCrmUniqueIdentifier) return;

      await hubspotClient.crm.deals.basicApi.update(
        partnerCrmUniqueIdentifier,
        inputHubspotUpdate
      );
    })
  );
