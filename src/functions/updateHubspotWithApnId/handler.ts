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
  /**
   * @debt refacto "Hydrate hubspotClient accessToken in middleware"
   */
  hubspotClient.setAccessToken(process.env.HUBSPOT_ACCESS_TOKEN as string);

  console.log("Event", event);

  const { fileKey } = event.detail;

  const { inboundApiResults: opportunities } = await fetchOpportunity(fileKey);

  await updateOpportunities(opportunities);

  console.log(`Delete file ${fileKey}`);

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    })
  );
};

export const main = middyfy(updateHubspotWithApnId);
