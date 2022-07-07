import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";

export const s3Client = new S3Client({
  region: "us-west-2",
  credentials: fromTemporaryCredentials({
    params: {
      RoleArn: process.env.ACE_ASSUME_ROLE_ARN,
      RoleSessionName: "ACE_session",
    },
  }),
});

export const main = async (event: { detail: { fileKey: string } }) => {
  console.debug(event);

  const fileKey = event.detail.fileKey;

  const s3Response = await s3Client.send(
    new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    })
  );

  return s3Response.DeleteMarker;
};
