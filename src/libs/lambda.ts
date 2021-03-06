import middy from "@middy/core";
import ssm from "@middy/ssm";

export const middyfy = (handler: any) =>
  middy(handler).use(
    ssm({
      fetchData: {
        HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN_PATH as string,
      },
      setToEnv: true,
    })
  );
