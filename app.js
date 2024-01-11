import dotenv from "dotenv";
import express from "express";
import { App } from "octokit";
import { createNodeMiddleware } from "@octokit/webhooks";
import fs from "fs";

dotenv.config();

const appServer = express();
const port = process.env.PORT || 3000;
const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

const octokitApp = new App({
  appId,
  privateKey,
  webhooks: {
    secret: webhookSecret,
  },
});

const messageForNewPRs =
  "Thanks for opening a new PR! Please follow our contributing guidelines to make your PR easier to review.";

async function handlePullRequestOpened({ octokit, payload }) {
  console.log(
    `Received a pull request event for #${payload.pull_request.number}`
  );
  console.log(`${messageForNewPRs} \n ${payload.pull_request.diff_url}`);
  console.log(
    `Pull request from ${payload.pull_request.head.label} to ${payload.pull_request.base.label}`
  );

  if (payload.pull_request.base.ref == payload.repository.default_branch) {
    try {
      await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
          owner: payload.repository.owner.login,
          repo: payload.repository.name,
          issue_number: payload.pull_request.number,
          body: `${messageForNewPRs} \n${payload.pull_request.diff_url}`,
          headers: {
            "x-github-api-version": "2022-11-28",
          },
        }
      );
    } catch (error) {
      if (error.response) {
        console.error(
          `Error! Status: ${error.response.status}. Message: ${error.response.data.message}`
        );
      }
      console.error(error);
    }
  } else {
    console.log("Pull request not to default branch");
  }
}

octokitApp.webhooks.on("pull_request.opened", handlePullRequestOpened);
octokitApp.webhooks.onError((error) => {
  if (error.name === "AggregateError") {
    console.error(`Error processing request: ${error.event}`);
  } else {
    console.error(error);
  }
});

const middleware = createNodeMiddleware(octokitApp.webhooks, {
  path: "/api/webhook",
});

appServer.use(middleware);

appServer.listen(port, () => {
  console.log(`Server is listening for events at: ${port}/api/webhook`);
  console.log("Press Ctrl + C to quit.");
});
