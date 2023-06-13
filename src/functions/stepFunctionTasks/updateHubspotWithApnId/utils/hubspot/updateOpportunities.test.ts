import { hubspotClient } from "@libs/hubspot/client";
import { InboutApiMockFailure, InboutApiMockSuccess } from "./mocks/event";
import { updateOpportunity } from "./updateOpportunity";

describe("Update APN id on hubspot", () => {
  const mockedHubspotClientUpdate = jest
    .spyOn(hubspotClient.crm.deals.basicApi, "update")
    .mockImplementation();
  jest.spyOn(console, "log").mockImplementation();
  const consoleErrorMock = jest.spyOn(console, "error").mockImplementation();

  beforeEach(() => {
    mockedHubspotClientUpdate.mockClear();
  });

  it("Test implementation with successful data", async () => {
    await updateOpportunity(InboutApiMockSuccess);

    expect(mockedHubspotClientUpdate).toHaveBeenCalledTimes(1);
    expect(mockedHubspotClientUpdate).toHaveBeenCalledWith(
      InboutApiMockSuccess.partnerCrmUniqueIdentifier,
      {
        properties: {
          identifiant_ace: InboutApiMockSuccess.apnCrmUniqueIdentifier,
        },
      }
    );
  });

  it("Test implementation with failed data", async () => {
    await updateOpportunity(InboutApiMockFailure);

    expect(mockedHubspotClientUpdate).toHaveBeenCalledTimes(0);

    expect(consoleErrorMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      "opportunity was not added to APN correctly with error",
      InboutApiMockFailure.errors
    );
  });
});
