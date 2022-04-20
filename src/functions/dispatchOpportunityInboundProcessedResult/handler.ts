import {
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { opportunityCreatedEvent } from "@libs/event";
import { OpportunityResult } from "@libs/types";
import { Readable } from "stream";

const s3Client = new S3Client({
  // region: "us-west-2",
  // credentials: fromTemporaryCredentials({
  //   params: {
  //     RoleArn: process.env.ACE_ASSUME_ROLE_ARN,
  //     RoleSessionName: "ACE_session",
  //   },
  // }),
});

const MOCK_BUCKET_NAME = "mock-apn-bucket-adeleg";

export const main = async (): Promise<void> => {
  // Get all file names since last time
  const processedOpportunities = await listProcessedInboundOpportunities();
  console.log("Processed Opportunities Files", processedOpportunities);

  // For each file name
  // Get content
  // Put event if update was successful

  await Promise.all(
    processedOpportunities.map(async (fileKey, index) => {
      const getFileOpportunityResultInput: GetObjectCommandInput = {
        Key: fileKey,
        Bucket: MOCK_BUCKET_NAME,
      };
      const fileOpportunityResult: GetObjectCommandOutput = await s3Client.send(
        new GetObjectCommand(getFileOpportunityResultInput)
      );
      const opportunityResult: OpportunityResult = JSON.parse(
        (await streamToString(fileOpportunityResult.Body)) as string
      );
      console.log(`Opportunity ${index} content`, opportunityResult);

      const event = {
        apnCrmUniqueIdentifier:
          opportunityResult.inboundApiResults[0].apnCrmUniqueIdentifier,
        partnerCrmUniqueIdentifier:
          opportunityResult.inboundApiResults[0].partnerCrmUniqueIdentifier,
      };

      await opportunityCreatedEvent.publish(event);

      return event;
    })
  );

  return;
};

const listProcessedInboundOpportunities = async (): Promise<string[]> => {
  const prefix = "opportunity-inbound-processed-results";
  const listInput: ListObjectsCommandInput = {
    Bucket: MOCK_BUCKET_NAME,
    Prefix: prefix,
  };
  const listCommand = new ListObjectsCommand(listInput);

  const processedOpportunities = await s3Client.send(listCommand);
  console.log(processedOpportunities);

  return processedOpportunities.Contents.map((file) => file.Key).filter(
    (key) => key !== `${prefix}/`
  );
};

const streamToString = (stream: Readable) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
