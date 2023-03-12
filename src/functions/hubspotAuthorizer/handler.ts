import { APIGatewayProxyEventV2, Callback, Context } from "aws-lambda";

export const main = (
  event: APIGatewayProxyEventV2,
  context: Context,
  callback: Callback
) => {
  console.log("event", event);

  console.log("context", context);

  callback(null, { isAuthorized: true });
};
