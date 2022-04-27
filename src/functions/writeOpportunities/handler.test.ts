import { Context } from "aws-lambda";
import MockDate from "mockdate";
import { mockClient } from "aws-sdk-client-mock";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@libs/s3/client";

import { main as writeOpportunity } from "./handler";
import * as createOpportunityObjectModule from "./utils/createOpportunityObject";
import { getAceOpportunityFilename } from "./utils/getAceOpportunityFilename";

import { aceOpportunityMock, eventMock, simplifiedEventMock } from "./mocks";

const s3ClientMock = mockClient(s3Client);

describe("writeOpportunity", () => {
  MockDate.set("2022-01-01");

  jest.spyOn(console, "log").mockImplementation();

  const createOpportunityObjectMock = jest
    .spyOn(createOpportunityObjectModule, "createOpportunityObject")
    .mockResolvedValue(aceOpportunityMock);

  const aceOpportunityFilenameMock = getAceOpportunityFilename();

  it("Writes opportunity on s3", async () => {
    await writeOpportunity(eventMock, {} as Context, () => undefined);

    const { detail: simplifiedEventMockDetail } = simplifiedEventMock;

    expect(createOpportunityObjectMock).toHaveBeenCalledTimes(1);
    expect(createOpportunityObjectMock).toHaveBeenCalledWith(
      simplifiedEventMockDetail
    );

    expect(
      s3ClientMock.commandCalls(PutObjectCommand, {
        Key: aceOpportunityFilenameMock,
        Bucket: process.env.BUCKET_NAME,
        Body: JSON.stringify(aceOpportunityMock),
        ACL: "bucket-owner-full-control",
      })
    ).toHaveLength(1);
  });
});
