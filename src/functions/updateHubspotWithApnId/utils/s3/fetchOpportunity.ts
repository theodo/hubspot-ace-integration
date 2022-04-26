import { GetObjectCommand } from "@aws-sdk/client-s3";
import type { Readable } from "stream";

import { s3Client } from "@libs/s3/client";
import { OpportunityResult } from "@libs/types";

const streamToString = (stream: Readable) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

export const fetchOpportunity = async (fileKey: string) => {
  const { Body: opportunityFileStream } = await s3Client.send(
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    })
  );

  const opportunityJSON = (
    await streamToString(opportunityFileStream)
  ).toString();

  return JSON.parse(opportunityJSON) as OpportunityResult;
};
