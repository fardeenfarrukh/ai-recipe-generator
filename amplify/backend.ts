
import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";

const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      // Claude Sonnet 4.6 global inference profile
      "arn:aws:bedrock:us-east-1:*:inference-profile/global.anthropic.claude-sonnet-4-6",

      // Foundation model resources used by global cross-Region inference
      "arn:aws:bedrock:*::foundation-model/anthropic.claude-sonnet-4-6",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);
