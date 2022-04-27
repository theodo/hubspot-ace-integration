import type { MiddlewareObj } from "@middy/core";
import { Context } from "aws-lambda";

const ssmMiddleware = (): MiddlewareObj<unknown, unknown, Error, Context> => ({
  before: async () => undefined,
});

export default ssmMiddleware;
