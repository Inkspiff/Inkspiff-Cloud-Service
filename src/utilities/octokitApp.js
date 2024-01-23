import fs from "fs";
import dotenv from "dotenv";
import { App } from "octokit";

dotenv.config();

const appId = process.env.APP_ID;
const webhookSecret = process.env.WEBHOOK_SECRET;
const privateKeyPath = process.env.PRIVATE_KEY_PATH;
const privateKey = fs.readFileSync(privateKeyPath, "utf8");

export const octokitApp = new App({
    appId,
    privateKey,
    webhooks: {
      secret: webhookSecret,
    },
  });
  