#!/usr/bin/env node

import fetch from "node-fetch";
import { program } from "commander";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import chalk from "chalk";
import AdmZip from "adm-zip";
import os from "os";

const GITHUB_ZIP_URL =
  "https://github.com/EmilGramDK/angular-template/archive/refs/heads/main.zip";

program
  .version("1.0.0")
  .argument("<project-name>", "Name of the new Angular project")
  .action(async (projectName) => {
    if (!projectName) {
      console.error(chalk.red("Error: No project name entered."));
      console.error(
        chalk.yellow("Usage: npx @emilgramdk/new-angular-app <project-name>")
      );
      process.exit(1);
    }

    const projectPath = path.join(process.cwd(), projectName);

    if (fs.existsSync(projectPath)) {
      console.error(
        chalk.red(`Error: Directory "${projectName}" already exists.`)
      );
      process.exit(1);
    }

    fs.mkdirSync(projectPath);

    // Create a temporary path for the ZIP file
    const tempZipPath = path.join(
      os.tmpdir(),
      `angular-template-${Date.now()}.zip`
    );
    const tempExtractPath = path.join(
      os.tmpdir(),
      `angular-template-${Date.now()}`
    );

    console.log(chalk.blue(`Downloading template from ${GITHUB_ZIP_URL}...`));
    const response = await fetch(GITHUB_ZIP_URL);
    if (!response.ok) {
      console.error(chalk.red("Error: Failed to download template."));
      process.exit(1);
    }

    // Write the downloaded ZIP file to the temp directory
    const fileStream = fs.createWriteStream(tempZipPath);
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on("error", reject);
      fileStream.on("finish", resolve);
    });

    console.log(chalk.blue("Extracting template..."));
    const zip = new AdmZip(tempZipPath);
    zip.extractAllTo(tempExtractPath, true); // Extract all contents to tempExtractPath

    // Move the contents from "angular-template-main" to projectPath
    const extractedFolder = fs
      .readdirSync(tempExtractPath)
      .find((folder) => folder.includes("angular-template"));

    const extractedPath = path.join(tempExtractPath, extractedFolder);

    function moveRecursiveSync(src, dest) {
      const entries = fs.readdirSync(src, { withFileTypes: true });

      entries.forEach((entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          if (!fs.existsSync(destPath)) {
            fs.mkdirSync(destPath);
          }
          moveRecursiveSync(srcPath, destPath);
        } else {
          fs.renameSync(srcPath, destPath);
        }
      });
    }

    moveRecursiveSync(extractedPath, projectPath);

    // Clean up the temporary files and folders
    fs.rmSync(tempZipPath, { recursive: true, force: true });
    fs.rmSync(tempExtractPath, { recursive: true, force: true });

    console.log(chalk.blue("Installing npm dependencies..."));
    execSync("npm install", { stdio: "inherit", cwd: projectPath });

    console.log(
      chalk.green(
        `\nNew Angular project "${projectName}" created successfully!`
      )
    );
    console.log(chalk.yellow(`\nTo get started:`));
    console.log(chalk.cyan(`-->  cd ${projectName}  <--`));
    console.log(chalk.cyan(`-->  npm start  <--\n`));
  });

program.parse(process.argv);
