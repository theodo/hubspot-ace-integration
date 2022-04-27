import { PutObjectCommand } from "@aws-sdk/client-s3";

import { s3Client } from "@libs/s3/client";
import { hubspotClient } from "@libs/hubspot/client";
import type { WebhookEventBridgeEvent } from "@libs/types";
import { middyfy } from "@libs/lambda";

import { createOpportunityObject } from "./utils/createOpportunityObject";
import { simplifyWebhookEvent } from "./utils/simplifyWebhookEvent";
import { getAceOpportunityFilename } from "./utils/getAceOpportunityFilename";

const writeOpportunity = async (
  event: WebhookEventBridgeEvent
): Promise<void> => {
  /**
   * @debt refacto "Hydrate hubspotClient accessToken in middleware"
   */
  hubspotClient.setAccessToken(process.env.HUBSPOT_ACCESS_TOKEN);

  console.log("event", JSON.stringify(event));

  const { detail: simplifiedEventDetail } = simplifyWebhookEvent(event);

  const opportunity = await createOpportunityObject(simplifiedEventDetail);

  console.log("opportunity", opportunity);

  const aceOpportunityFilename = getAceOpportunityFilename();

  console.log("File Name :", aceOpportunityFilename);

  await s3Client.send(
    new PutObjectCommand({
      Key: aceOpportunityFilename,
      Bucket: process.env.BUCKET_NAME,
      Body: JSON.stringify(opportunity),
      ACL: "bucket-owner-full-control",
    })
  );
};

export const main = middyfy(writeOpportunity);

interface EnvironmentVars {
  NAME: string;
  OS: string;

  // Unknown properties are covered by this index signature.
  [propName: string]: string;
}

declare const env: EnvironmentVars;
const sysName = env.NAME;
const os = env.OS;
const nodeEnv = env.NODE_ENV;
