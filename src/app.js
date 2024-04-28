import dotenv from "dotenv";
import express, { response } from "express";
import { createNodeMiddleware } from "@octokit/webhooks";
import { getDocs, updateDoc, serverTimestamp } from "@firebase/firestore";

import { generateMd } from "./utilities/generate.js";
import { octokitApp } from "./utilities/index.js";
import { getAutomations, getMdContent } from "./utilities/index.js";

dotenv.config();

const appServer = express();
const port = process.env.PORT || 3000;
const editorUrl = process.env.INKSPIFF_EDITOR_URL;
let mdEditors = [];

async function handlePullRequestOpened({ octokit, payload }) {
  console.log(payload.repository.full_name);
  if (payload.pull_request.base.ref == payload.repository.default_branch) {
    // Create a query to get markdowns associated with the PR repository

    const diff = await fetch(payload.pull_request.diff_url);
    const q = getAutomations(payload.repository.full_name);
    
    await getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach(async (docSnap) => {
          if (docSnap.type === "auto-suggest") {
            const content = getMdContent(docSnap.id);
            const data = generateMd(diff, content);
            updateDoc(docSnap(db, "markdowns", docSnap.id), {
              content: data.result,
              lastUpdated: serverTimestamp(),
            });
            const stylizedUrl = `\n✨ ${editorUrl}/${docSnap.id}?pr=${payload.number} ✨`;
            mdEditors.push(stylizedUrl);
            console.log(stylizedUrl);
          }
        });
        console.log(mdEditors);
        try {
          octokit.request(
            "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
            {
              owner: payload.repository.owner.login,
              repo: payload.repository.name,
              issue_number: payload.pull_request.number,
              body: `Spotted some neat updates in your PR! But before it merges, let's use Inkspiff's AI to keep your documentation in sync.${mdEditors.join()}`,
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
      })
      .catch((error) => {
        console.error(error);
      });

    try {
      if (mdEditors.length !== 0) {
        await octokit.request(
          "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
          {
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            issue_number: payload.pull_request.number,
            body: `Spotted some neat updates in your PR! But before it merges, let's use Inkspiff's AI to keep your documentation in sync.${mdEditors.join()}`,
            headers: {
              "x-github-api-version": "2022-11-28",
            },
          }
        );
      } else {
        console.log("no automations found");
      }
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
