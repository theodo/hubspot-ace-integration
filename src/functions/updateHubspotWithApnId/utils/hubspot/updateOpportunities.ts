import { InboundApiResult } from "@libs/types";
import { hubspotClient } from "@libs/hubspot/client";

export const updateOpportunities = (opportunities: InboundApiResult[]) =>
  Promise.all(
    opportunities.map(async (opportunity) => {
      if (!opportunity.isSuccess) {
        // TODO: handle errors
        return;
      }

      const inputHubspotUpdate = {
        properties: {
          identifiant_ace: opportunity.apnCrmUniqueIdentifier,
        },
      };

      console.log(
        `Update hubspot deal ${opportunity.partnerCrmUniqueIdentifier} with ACE id ${opportunity.apnCrmUniqueIdentifier}`
      );

      await hubspotClient.crm.deals.basicApi.update(
        opportunity.partnerCrmUniqueIdentifier,
        inputHubspotUpdate
      );
    })
  );
