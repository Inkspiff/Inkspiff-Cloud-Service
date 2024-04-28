import dotenv from "dotenv";
import { App } from "octokit";

dotenv.config();

const appId = process.env.GITHUB_APP_ID;
const webhookSecret = process.env.GITHUB_APP_WEBHOOK_SECRET;
const privateKey = process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, '\n')
;

export const octokitApp = new App({
    appId,
    privateKey,
    webhooks: {
      secret: webhookSecret,
    },
  });
  