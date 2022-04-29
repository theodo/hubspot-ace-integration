import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { PublishedEvent } from "typebridge";

import { s3Client } from "@libs/s3/client";
import { hubspotClient } from "@libs/hubspot/client";
import { opportunityCreatedEvent } from "@libs/event";
import { middyfy } from "@libs/lambda";

import { fetchOpportunity } from "./utils/s3/fetchOpportunity";
import { updateOpportunities } from "./utils/hubspot/updateOpportunities";

export const updateHubspotWithApnId = async (
  event: PublishedEvent<typeof opportunityCreatedEvent>
): Promise<void> => {
  console.log("Full event:", event);

  /**
   * @debt refacto "Hydrate hubspotClient accessToken in middleware"
   */
  hubspotClient.setAccessToken(process.env.HUBSPOT_ACCESS_TOKEN as string);

  const { fileKey } = event.detail;

  const opportunity = await fetchOpportunity(fileKey);

  if (opportunity.inboundApiResults) {
    const { inboundApiResults: opportunities } = opportunity;
    await updateOpportunities(opportunities);
  }

  if (opportunity.error) {
    const { error, fileName } = opportunity;
    console.error(`Error handling opportunities in ${fileName}: ${error}`);
  }

  console.log(`Deleting file ${fileKey}...`);

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    })
  );
};

export const main = middyfy(updateHubspotWithApnId);
