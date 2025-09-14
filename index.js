#!/usr/bin/env node
const { exec } = require("child_process");
const { Select } = require("enquirer");

const actionUrl = "https://api.comit.dev/actions";

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

async function getCommitMessage(stagedDiff) {
  const payload = {
    code: stagedDiff,
  };
  const response = await fetch(`${actionUrl}/commit?token=default`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: myHeaders,
  });

  const responseJson = await response.json();
  const commitMessages = responseJson.message;
  return commitMessages;
}

async function SelectComit(comitMessages, stdout = null) {
  if (comitMessages[0].length == 0 && stdout != null) {
    comitMessages = await getCommitMessage(stdout);
    await SelectComit(comitMessages, stdout);
    return;
  }
  const prompt = new Select({
    name: "Comit",
    message: "Select commit message:",
    choices: comitMessages,
  });

  try {
    const commit = await prompt.run();
    exec(`git commit -m  "${commit}"`, (error, stdout, stderr) => {
      if (stderr) {
        console.log(stderr);
        console.log("Report this issue to https://comit.dev");
      }
    });
  } catch {}
  return;
}

exec("git --no-pager diff --staged", async (error, stdout, stderr) => {
  if (stdout.length > 5) {
    const commitMessages = await getCommitMessage(stdout);
    await SelectComit(commitMessages, stdout);
  }
});
