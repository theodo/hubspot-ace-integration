import { middyfy } from "@libs/lambda";

export const logEvent = async (event: unknown): Promise<void> => {
  console.log(event);
};

export const main = middyfy(logEvent);
