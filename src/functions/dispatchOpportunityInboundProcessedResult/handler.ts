import {
  ListObjectsCommand,
  ListObjectsCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";

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
