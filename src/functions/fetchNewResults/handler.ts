import {
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-west-2" });

export const main = async (): Promise<void> => {
  await listOutboundFiles();

  return;
};

const listOutboundFiles = async () => {
  const listInput: ListObjectsV2CommandInput = {
    Bucket: process.env.BUCKET_NAME,
  };
  const listCommand = new ListObjectsV2Command(listInput);

  const listOutbounds = await s3Client.send(listCommand);
  console.log(listOutbounds);
};
