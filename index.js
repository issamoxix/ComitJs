#!/usr/bin/env node
const handleCommands = require("./handler");

async function main() {
  const args = process.argv;
  await handleCommands(args[2]);
}

main();
