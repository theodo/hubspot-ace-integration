// import * as cdk from "@aws-cdk/core";
import * as sfn from "@aws-cdk/aws-stepfunctions";
import * as tasks from "@aws-cdk/aws-stepfunctions-tasks";
import * as targets from "@aws-cdk/aws-events-targets";
import { Construct } from "@aws-cdk/core";
import * as sqs from "@aws-cdk/aws-sqs";
import { opportunityCreatedEvent } from "@libs/event";
import * as events from "@aws-cdk/aws-events";
import { lambdaFunctionResolver } from "@libs/lambdaFunctionResolver";
import { ACES3BucketAccessRoleSfn } from "./iamSfn";
import { aceBus } from "./eventBridge";

export class Machine extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const startState = new sfn.Pass(this, "StartState");

    const getFileLambda = lambdaFunctionResolver(this, "fetchProcessedResult");

    const getFileLambdaInvoke = new tasks.LambdaInvoke(
      this,
      "getObjectFromACEInvoke",
      {
        lambdaFunction: getFileLambda,
        resultSelector: {
          "data.$": "$.Payload.inboundApiResults",
        },
        resultPath: "$.file",
      }
    );

    const LoopOverChanges = new sfn.Map(this, "LoopOverChanges", {
      itemsPath: "$.file.data",
      resultPath: sfn.JsonPath.DISCARD,
    });

    const idPushLambda = lambdaFunctionResolver(this, "updateHubspotWithApnId");

    const ErrorQueue = new sqs.Queue(this, "ErrorQueue");

    const ChooseOnFileState = new sfn.Choice(this, "isSuccess?")
      .when(
        sfn.Condition.booleanEquals("$.isSuccess", true),
        new tasks.LambdaInvoke(this, "handleIdChange", {
          lambdaFunction: idPushLambda,
        })
      )
      .otherwise(
        new tasks.SqsSendMessage(this, "appendErrorToQueue", {
          queue: ErrorQueue,
          messageBody: sfn.TaskInput.fromJsonPathAt("$.errors"),
        })
      );

    LoopOverChanges.iterator(ChooseOnFileState);

    const delFileLambda = lambdaFunctionResolver(this, "deleteProcessedResult");

    const delFileLambdaInvoke = new tasks.LambdaInvoke(
      this,
      "delObjectFromACEInvoke",
      {
        lambdaFunction: delFileLambda,
        // inputPath: sfn.JsonPath.stringAt("$.detail.fileKey"),
      }
    );

    const newFileHandlingMachine = new sfn.StateMachine(
      this,
      "newFileHandling",
      {
        definition: startState
          //.next(getFile)
          .next(getFileLambdaInvoke)
          .next(LoopOverChanges)
          .next(delFileLambdaInvoke),
        role: ACES3BucketAccessRoleSfn as any,
      }
    );

    const eventRule = new events.Rule(this, "ForwardToSfn", {
      eventBus: aceBus,
      eventPattern: opportunityCreatedEvent.pattern,
      enabled: true,
    });

    eventRule.addTarget(new targets.SfnStateMachine(newFileHandlingMachine));
  }
}
