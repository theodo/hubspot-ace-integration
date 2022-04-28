import {
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { EventBus, opportunityCreatedEvent } from "@libs/event";

const s3Client = new S3Client({
  region: "us-west-2",
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: process.env.ACE_ASSUME_ROLE_ARN,
      RoleSessionName: "ACE_session",
    },
  }),
});

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

  return;
};

const listProcessedInboundOpportunities = async (): Promise<string[]> => {
  const prefix = "opportunity-inbound-processed-results/";

  const listInput: ListObjectsV2CommandInput = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: prefix,
  };

  const listCommand = new ListObjectsV2Command(listInput);

  // TODO: handle the cas when results are paginated over a single page
  const processedOpportunities = await s3Client.send(listCommand);
  console.log(processedOpportunities);

  if (processedOpportunities.Contents === undefined) {
    return [];
  }

  return processedOpportunities.Contents.map(
    (file) => file.Key as string
  ).filter((key) => key !== prefix);
};

const publishEvents = async (fileKeys: string[]) => {
  const events = fileKeys.map((key) =>
    opportunityCreatedEvent.create({
      fileKey: key,
    })
  );
  await EventBus.put(events);

  return events;
};
