# Inksespiff AI Agent

## Overview

This project is a GitHub App built with Node.js that automates actions on pull requests. It is currently configured to post a welcoming comment on new pull requests, encouraging contributors to follow the project's guidelines.

## Key Features

Automatically comments on new pull requests
Leverages the Octokit library to interact with the GitHub API
Includes error handling and logging for troubleshooting
Built with Node.js and Express

## Getting Started

Clone this repository.
Install dependencies: npm install
Create a GitHub App and obtain its credentials.
Set the required environment variables:
```
APP_ID: Your GitHub App's ID
WEBHOOK_SECRET: Your GitHub App's webhook secret
PRIVATE_KEY_PATH: Path to your GitHub App's private key file
```
Start the server: node app.js

## Configuration

The message for new PRs can be customized in the app.js file.
Additional webhook events and actions can be configured as needed.

## Additional Notes

This project is currently in development.
For more information on GitHub Apps, refer to the official documentation: https://docs.github.com/en/developers/apps

## Contributing

We welcome contributions! Please follow the standard fork-and-pull request workflow.

## License

This project is licensed under the MIT License.
