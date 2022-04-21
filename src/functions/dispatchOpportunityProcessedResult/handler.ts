import {
  DeleteObjectsCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  ListObjectsCommand,
  ListObjectsCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
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

  if (processedOpportunities.length === 0) {
    console.log("Nothing new to process");

    return;
  }

  const publishedEvents = await publishEvents(processedOpportunities);
  console.log(`Successfully published ${publishedEvents.length}`);
  const deleteObjectsResponse = await deleteReadObjects(processedOpportunities);
  console.log(
    "Successfully deleted read objects from bucket",
    deleteObjectsResponse
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

const publishEvents = async (fileKeys: string[]) => {
  const events = await Promise.all(
    fileKeys.map(async (fileKey, index) => {
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

      return Promise.all(
        opportunityResult.inboundApiResults.map(async (opportunityData) => {
          const event = {
            apnCrmUniqueIdentifier: opportunityData.apnCrmUniqueIdentifier,
            partnerCrmUniqueIdentifier:
              opportunityData.partnerCrmUniqueIdentifier,
          };
          await opportunityCreatedEvent.publish(event);

          return event;
        })
      );
    })
  );

  return events.flat();
};

const deleteReadObjects = async (fileKeys: string[]) => {
  const deleteObjectsCommand = new DeleteObjectsCommand({
    Bucket: MOCK_BUCKET_NAME,
    Delete: {
      Objects: fileKeys.map((fileKey) => ({
        Key: fileKey,
      })),
    },
  });

  return s3Client.send(deleteObjectsCommand);
};

const streamToString = (stream: Readable) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
