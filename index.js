#!/usr/bin/env node

/* eslint-disable no-console */
const path = require('path');
const fs = require('fs').promises;
const commander = require('commander');
const chalk = require('chalk');
const version = require('./package.json').vesrion;

const BOILERPLATES_PATH = path.join(__dirname, 'boilerplates');

const program = new commander.Command();
program.version('0.0.1');

program
  .option('-g, --generate <boilerplate>', 'generate readline guessing game')
  .option('-p, --path <path>', 'path to write boilerplate to');

program.parse(process.argv);

const requestedBoilerplate = program.generate;
const writePath = program.path;

if (!requestedBoilerplate || !writePath) {
  console.error(chalk.redBright('Missing arguments:'));
  console.table({
    '--generate': requestedBoilerplate,
    '--path': writePath,
  });
  process.exit();
}

let extension = '';

async function getBoilerPlates() {
  try {
    const boilerplates = await fs.readdir(BOILERPLATES_PATH);
    const names = boilerplates.map((boilerplateFileName) => {
      const [name, fileExtension] = boilerplateFileName.split('.');
      extension = fileExtension;
      return name;
    });
    return names;
  } catch (error) {
    throw new Error(chalk.red('Internal Error: Could not get boilerplates. Please try again'));
  }
}

function getBoilerplate() {
  return fs.readFile(path.join(BOILERPLATES_PATH, `${requestedBoilerplate}.${extension}`));
}

function writeBoilerplate(data) {
  return fs.writeFile(path.join(process.cwd(), `${writePath}`, `${requestedBoilerplate}.${extension}`), data);
}


async function write() {
  console.log(`Using version: ${version}`);
  console.dir({
    pcwd: process.cwd(),
    dirname: __dirname,
    writePath: writePath,
    requestedBoilerplate: requestedBoilerplate,
    extension: extension,
  });
  const boilerPlates = await getBoilerPlates();
  try {
    if (!boilerPlates.includes(requestedBoilerplate)) {
      console.info('Available templates:');
      console.info(chalk.cyanBright(boilerPlates.join('\n')));
      throw new Error('boilerplate not found');
    }
    const data = await getBoilerplate();
    await writeBoilerplate(data);
    return true;
  } catch (error) {
    console.error(error);
    if (error.code === 'ENOENT') {
      console.error(chalk.red(`Could not create boilerplate at path: ${chalk.yellow(error.path)}`));
      console.error(chalk.yellowBright('Make sure the path to the file already exists (Pre-make path of directories to the file)'));
    }
    return false;
  }
}

write();
