import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { Client } from "@hubspot/api-client";
import { opportunityCreatedEvent } from "@libs/event";
import { middyfy } from "@libs/lambda";
import {
  InboundApiResult,
  OpportunityInbound,
  OpportunityResult,
} from "@libs/types";
import { Readable } from "stream";
import { PublishedEvent } from "typebridge";

type OpportunityCreatedEvent = PublishedEvent<typeof opportunityCreatedEvent>;


const s3Client = new S3Client({
  region: "us-west-2",
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: process.env.ACE_ASSUME_ROLE_ARN,
      RoleSessionName: "ACE_session",
    },
  }),
});

export const updateHubspotWithApnId = async (
  event: OpportunityCreatedEvent
): Promise<void> => {
  console.log("Event", event);
  const hubspotClient = new Client({
    accessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  });

  const { fileKey } = event.detail;
  const processedResultsInfo = await readFile(fileKey);

  await updateOpportunitiesInHubspot(
    processedResultsInfo.inboundApiResults,
    hubspotClient
  );
  console.log(`Delete file ${fileKey}`);
  await deleteReadObject(fileKey);

  return;
};

const readFile = async (fileKey) => {
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
  });

  const result = await s3Client.send(getObjectCommand);

  return JSON.parse(
    (await streamToString(result.Body)) as string
  ) as OpportunityResult;
};

const updateOpportunitiesInHubspot = async (
  opportunities: InboundApiResult[],
  client: Client
) => {
  return Promise.all(
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
      await client.crm.deals.basicApi.update(
        opportunity.partnerCrmUniqueIdentifier,
        inputHubspotUpdate
      );
    })
  );
};

const deleteReadObject = async (fileKey: string) => {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: fileKey,
  });

  return s3Client.send(deleteObjectCommand);
};

const streamToString = (stream: Readable) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export const main = middyfy(updateHubspotWithApnId);
