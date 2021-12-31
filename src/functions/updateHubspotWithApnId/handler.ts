import { newlyCreatedOpprutinityEvent } from "@libs/event";
import { middyfy } from "@libs/lambda";
import { PublishedEvent } from "typebridge";

export const updateHubspotWithApnId = async (
  event: PublishedEvent<typeof newlyCreatedOpprutinityEvent>
): Promise<void> => {
  console.log("Event", event);

  return;
};

export const main = middyfy(updateHubspotWithApnId);
