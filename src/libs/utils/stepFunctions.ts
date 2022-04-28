export const getStateName = <R extends Record<string, unknown>>(
  resource: R
): keyof R => {
  if (Object.keys(resource).length !== 1) {
    throw new Error("getStateName can only be used on one state");
  }
  const [resourceName] = Object.keys(resource) as (keyof R)[];

  return resourceName;
};

export const logicalId = <R extends Record<string, unknown>>(
  resource: R
): keyof R => {
  if (Object.keys(resource).length !== 1) {
    throw new Error("logicalId can only be used on one resource");
  }

  const [resourceName] = Object.keys(resource) as (keyof R)[];

  return resourceName;
};

export const getLambdaName = (resource: {
  [functionName: string]: unknown;
}): string =>
  [
    "${self:service}",
    "${opt:stage, self:provider.stage}",
    logicalId(resource),
  ].join("-");

export const getLambdaArn = (resource: {
  [functionName: string]: unknown;
}): string =>
  [
    "arn:aws:lambda:${aws:region}:${aws:accountId}:function",
    getLambdaName(resource),
  ].join(":");

export const LambdaServiceExceptionRetryPolicy = {
  ErrorEquals: [
    "Lambda.ServiceException",
    "Lambda.AWSLambdaException",
    "Lambda.SdkClientException",
  ],
  IntervalSeconds: 2,
  MaxAttempts: 6,
  BackoffRate: 2,
};
