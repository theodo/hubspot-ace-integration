import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
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

const streamToString = (stream: Readable) =>
  new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export const main = async (event: any) => {
  console.debug(event);

  const fileKey = event.detail.fileKey;

  const s3Response = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    })
  );

  console.debug(s3Response);

  const opportunityFileStream = s3Response.Body;

  const opportunityJSON = (
    await streamToString(opportunityFileStream)
  ).toString();

  return JSON.parse(opportunityJSON);
};
