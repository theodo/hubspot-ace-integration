import { Client } from "@hubspot/api-client";
import { opportunityCreatedEvent } from "@libs/event";
import { middyfy } from "@libs/lambda";
import { PublishedEvent } from "typebridge";

type OpportunityCreatedEvent = PublishedEvent<typeof opportunityCreatedEvent>;

export const updateHubspotWithApnId = async (
  event: OpportunityCreatedEvent
): Promise<void> => {
  console.log("Event", event);
  const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  });

  const { partnerCrmUniqueIdentifier: dealId, apnCrmUniqueIdentifier: apnId } =
    event.detail;

  const inputHubspotUpdate = {
    properties: {
      identifiant_ace: apnId,
    },
  };
  console.log(`Update hubspot deal ${dealId} with ACE id ${apnId}`);
  await hubspotClient.crm.deals.basicApi.update(dealId, inputHubspotUpdate);

  return;
};

export const main = middyfy(updateHubspotWithApnId);
