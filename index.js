#!/usr/bin/env node

import fetch from "node-fetch";
import unzipper from "unzipper";
import { program } from "commander";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk"; // Import chalk

const GITHUB_ZIP_URL =
  "https://github.com/EmilGramDK/angular-template/archive/refs/heads/main.zip";

program
  .version("1.0.0")
  .argument("<project-name>", "Name of the new Angular project")
  .action(async (projectName) => {
    // Check if project name is entered
    if (!projectName) {
      console.error(chalk.red("Error: No project name entered."));
      console.error(
        chalk.yellow("Usage: npx @emilgramdk/new-angular-app <project-name>")
      );
      process.exit(1);
    }

    const projectPath = path.join(process.cwd(), projectName);

    // Check if the directory already exists
    if (fs.existsSync(projectPath)) {
      console.error(
        chalk.red(`Error: Directory "${projectName}" already exists.`)
      );
      process.exit(1);
    }

    // Create the project directory
    fs.mkdirSync(projectPath);

    // Download the repository as a ZIP file
    console.log(chalk.blue(`Downloading template from ${GITHUB_ZIP_URL}...`));
    const response = await fetch(GITHUB_ZIP_URL);
    if (!response.ok) {
      console.error(chalk.red("Error: Failed to download template."));
      process.exit(1);
    }

    // Unzip the downloaded file
    console.log(chalk.blue("Extracting template..."));
    await response.body.pipe(unzipper.Extract({ path: projectPath })).promise();

    // After unzipping, the contents might be inside a subdirectory
    const extractedDir = path.join(projectPath, "angular-template-main");
    if (fs.existsSync(extractedDir)) {
      fs.readdirSync(extractedDir).forEach((file) => {
        fs.renameSync(
          path.join(extractedDir, file),
          path.join(projectPath, file)
        );
      });

      fs.rmSync(extractedDir, { recursive: true, force: true });
    }

    // Install npm dependencies
    console.log(chalk.blue("Installing npm dependencies..."));
    execSync("npm install", { stdio: "inherit", cwd: projectPath });

    // Success message with colors
    console.log(
      chalk.green(
        `\nNew Angular project "${projectName}" created successfully!`
      )
    );

    // Output a colored message to tell the user to change into the new directory
    console.log(chalk.yellow(`\nTo get started:`));
    console.log(chalk.cyan(`-->  cd ${projectName}  <--`));
    console.log(chalk.cyan(`-->  npm start  <--\n`));
  });

program.parse(process.argv);
