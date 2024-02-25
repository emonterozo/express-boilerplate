#!/usr/bin/env node

import { fileURLToPath } from 'url';
import util, { promisify } from "util";
import cp from "child_process";
import path from "path";
import fs from "fs";
import ora from "ora";

import { createFolder, copyFile, copyFolder } from './utils.mjs';

const exec = promisify(cp.exec);

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const configPath = path.join(__dirname, '../template/config');
const srcPath = path.join(__dirname, '../template/src');
const preCommitPath = path.join(__dirname, '../template/pre-commit');
const testPath = path.join(__dirname, '../template/__test__');


if (fs.existsSync(projectPath)) {
  console.log(`The file ${projectName} already exists in the current directory, please give it another name.`);
  process.exit(1);
} else {
  const expressSpinner = ora("Initializing Express project...").start();
  await createFolder(projectName);
  expressSpinner.succeed();

  process.chdir(projectName);

  const copySpinner = ora("Copying template...").start();
  await createFolder(`${projectPath}/src`);
  await copyFolder(srcPath, `${projectPath}/src`);
  await createFolder(`${projectPath}/__test__`);
  await copyFolder(testPath, `${projectPath}/__test__`);
  await copyFolder(configPath, `${projectPath}/`);
  copySpinner.succeed();

  const installSpinner = ora("Installing dependencies...").start();
  await exec("yarn add @types/express @types/node concurrently cors dotenv express helmet joi module-alias rimraf typescript");
  await exec("yarn add -D @commitlint/cli @commitlint/config-conventional @types/cors @typescript-eslint/parser eslint husky lint-staged nodemon prettier typescript-eslint @types/jest @types/supertest jest supertest ts-jest");
  installSpinner.succeed();

  const finalSpinner = ora("Finalizing project...").start();
  await exec("git init");
  await exec("git add .");
  await exec('git commit -m "Initial Commit"');
  await exec("npx husky init");
  await copyFile(preCommitPath, `${projectPath}/.husky/pre-commit`);
  finalSpinner.succeed();
}




