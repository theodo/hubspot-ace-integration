import moment from "moment";

export const getAceOpportunityFilename = (): string =>
  `opportunity-inbound/TEST_${moment().format("DD-MM-YYYY_HH:mm:SS")}.json`;
