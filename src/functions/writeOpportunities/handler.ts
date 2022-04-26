import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import moment from "moment";

import type {
  Properties,
  WebhookEventBridgeEvent,
  WebhookEventBridgeEventSimplified,
} from "@libs/types";
import { middyfy } from "@libs/lambda";

import { hubspotClient } from "./utils/hubspot";
import { createOpportunityObject } from "./utils/createOpportunityObject";

const s3Client = new S3Client({
  region: "us-west-2",
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: process.env.ACE_ASSUME_ROLE_ARN,
      RoleSessionName: "ACE_session",
    },
  }),
});

const writeOpportunity = async (
  event: WebhookEventBridgeEvent
): Promise<void> => {
  hubspotClient.setAccessToken(process.env.HUBSPOT_ACCESS_TOKEN);

  console.log("event", JSON.stringify(event));

  const initProperties: Properties<string> = {
    dealname: undefined,
    dealstage: undefined,
    closedate: undefined,
    hubspot_owner_id: undefined,
    identifiant_ace: undefined,
    source_du_deal: undefined,
  };

  const properties = Object.entries(event.detail.properties).reduce(
    (o, key) => ({ ...o, [key[0]]: key[1].value }),
    initProperties
  );

  const simplifiedEvent: WebhookEventBridgeEventSimplified = {
    ...event,
    detail: { ...event.detail, properties },
  };

  const opportunity = await createOpportunityObject(simplifiedEvent.detail);

  console.log("opportunity", opportunity);

  // TODO: remove test from filename
  const fileName = `opportunity-inbound/TEST_${moment().format(
    "DD-MM-YYYY_HH:mm:SS"
  )}`;

  const fileOpportunityPath = `${fileName}.json`;

  console.log("File Name :", fileOpportunityPath);

  await s3Client.send(
    new PutObjectCommand({
      Key: fileOpportunityPath,
      Bucket: process.env.BUCKET_NAME,
      Body: JSON.stringify(opportunity),
      ACL: "bucket-owner-full-control",
    })
  );
};

export const main = middyfy(writeOpportunity);
