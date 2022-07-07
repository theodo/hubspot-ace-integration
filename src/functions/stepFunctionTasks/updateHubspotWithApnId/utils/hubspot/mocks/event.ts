import { InboundApiResult } from "@libs/types";

export const InboutApiMockSuccess: InboundApiResult = {
  warnings: null,
  partnerCrmUniqueIdentifier: "partner12345",
  isSuccess: true,
  errors: null,
  apnCrmUniqueIdentifier: "apn12345",
};

export const InboutApiMockFailure: InboundApiResult = {
  warnings: null,
  partnerCrmUniqueIdentifier: "partner12345",
  isSuccess: false,
  errors: "Some error happened",
  apnCrmUniqueIdentifier: "apn12345",
};
