import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import type { WebhookEventBridgeEvent } from '@libs/types';

const s3Client = new S3Client({});

export const main = async (event: WebhookEventBridgeEvent): Promise<void> => {
  console.log(JSON.stringify(event));
  const input: PutObjectCommandInput = {
    Key: 'toto',
    Bucket: process.env.BUCKET_NAME,
    Body: 'hello!!'
  }
  const putCommand = new PutObjectCommand(input);
  await s3Client.send(putCommand)
  return;
}
