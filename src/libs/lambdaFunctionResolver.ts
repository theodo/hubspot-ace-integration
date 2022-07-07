import { Construct, Fn } from "@aws-cdk/core";
import { Function } from "@aws-cdk/aws-lambda";

export const lambdaFunctionResolver = (
  scope: Construct,
  functionName: string
) => {
  return Function.fromFunctionName(
    scope,
    functionName.charAt(0).toUpperCase() + functionName.slice(1),
    Fn.sub(
      "${AWS::StackName}-" +
        functionName.charAt(0).toLowerCase() +
        functionName.slice(1)
    )
  );
};
