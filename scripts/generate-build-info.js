#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getGitCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch (error) {
    console.warn('Warning: Could not get git commit hash');
    return 'unknown';
  }
}

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

const packageJson = require('../package.json');

const buildInfo = {
  version: packageJson.version,
  buildDate: new Date().toISOString(),
  commitHash: getGitCommitHash(),
  branch: getGitBranch(),
  nodeVersion: process.version,
};

// Write to lib directory for server-side usage
const libOutputPath = path.join(__dirname, '../lib/build-info.json');
const libOutputDir = path.dirname(libOutputPath);

if (!fs.existsSync(libOutputDir)) {
  fs.mkdirSync(libOutputDir, { recursive: true });
}

fs.writeFileSync(libOutputPath, JSON.stringify(buildInfo, null, 2));

// Write to public directory for client-side access
const publicOutputPath = path.join(__dirname, '../public/build-info.json');
const publicOutputDir = path.dirname(publicOutputPath);

if (!fs.existsSync(publicOutputDir)) {
  fs.mkdirSync(publicOutputDir, { recursive: true });
}

fs.writeFileSync(publicOutputPath, JSON.stringify(buildInfo, null, 2));

console.log('Build info generated:');
console.log(JSON.stringify(buildInfo, null, 2));
