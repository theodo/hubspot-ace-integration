import {
  ListObjectsCommand,
  ListObjectsCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-west-2" });

export const main = async (): Promise<void> => {
  await listOutboundFiles();

  return;
};

const listOutboundFiles = async () => {
  const listInput: ListObjectsCommandInput = {
    Bucket: process.env.BUCKET_NAME,
  };
  const listCommand = new ListObjectsCommand(listInput);

  const listOutbounds = await s3Client.send(listCommand);
  console.log(listOutbounds);
};
