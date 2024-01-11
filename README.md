# Inksespiff AI Agent

## Overview
This project is a GitHub App built with Node.js that automates actions on pull requests. The purpose of this document is to define the requirements and specifications for Inkspiff agent that integrates with user GitHub accounts, listens for events via webhooks, and automates actions related to repository configuration and pull request management. It is currently configured to post a welcoming comment on new pull requests, encouraging use Inkspiff's AI tool for documenting their PR.

## Functionalities Scope
The Inkspiff agent will focus on the following functionalities:
- Leverages the Octokit library to interact with the GitHub API
    - Listening for user events via webhooks
    - Alerting users to configure Inkspiff for new repositories
    - Alerting users to document changes in pull requests to their default branch

## Getting Started Contributing
- Clone this repository. 
    ```
    git clone git@github.com:iChristwin/Inkspiff-AI-agent.git
    ```
- Change working directory to project folder: 
    ```
    cd Inkspiff-AI-agent
    ```
- Install dependencies: 
    ```
    npm install
    ```
- Create a GitHub App and obtain its credentials.
- Set the required environment variables:
    ```
    APP_ID: Your GitHub App's ID
    WEBHOOK_SECRET: Your GitHub App's webhook secret
    PRIVATE_KEY_PATH: Path to your GitHub App's private key file
    ```
- Start the server: 
    ```
    npm run server
    ```

## Implementation Stack
- Express.js for backend service.
- Next.js for frontend service
- Octokit for github API service

## Additional Notes
This project is currently in development.
For more information on GitHub Apps, refer to the official documentation: https://docs.github.com/en/developers/apps

## License
This project is licensed under the MIT License.
