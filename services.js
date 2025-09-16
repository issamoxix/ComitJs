const { Select } = require("enquirer");
const { exec } = require("child_process");
const keytar = require("keytar");
const { marked } = require("marked");
const { default: TerminalRenderer } = require("marked-terminal");
const { default: ora } = require("ora");

const ActionUrl = "https://api.comit.dev/actions";

marked.setOptions({
  renderer: new TerminalRenderer(),
});

RETRIES = 3;

async function GetCommitMessage() {
  const stagedDiff = await getStagedDiff();
  const token = (await loadToken()) || "default";
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const payload = {
    code: stagedDiff,
  };

  const spinner = ora("Fetching commit message").start();
  setTimeout(() => {
    spinner.color = "yellow";
    spinner.text = "Cooking...";
  }, 2000);

  const response = await fetch(`${ActionUrl}/commit?token=${token}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: myHeaders,
  });

  spinner.stop();
  const responseJson = await response.json();
  const commitMessages = responseJson.message;
  return commitMessages;
}

async function SelectComit(comitMessages) {
  if (comitMessages[0].length == 0 && RETRIES > 0) {
    comitMessages = await GetCommitMessage();
    await SelectComit(comitMessages);
    RETRIES--;
    return;
  }

  if (RETRIES == 0 && comitMessages[0].length == 0) {
    console.error("No commit message found");
    return;
  }

  const prompt = new Select({
    name: "Comit",
    message: "Select commit message:",
    choices: ["Refresh", ...comitMessages],
  });

  try {
    const commit = await prompt.run();
    if (commit == "Refresh") {
      await SelectComit([""]);
      return;
    }
    exec(`git commit -m  "${commit}"`, (error, stdout, stderr) => {
      if (stderr) {
        console.log(stderr);
        console.log("Report this issue to https://comit.dev");
      }
    });
  } catch {}
  return;
}

async function LoginUser() {
  const token = process.argv[3];
  if (!token) {
    console.log("Please provide a token");
    return;
  }
  await keytar.setPassword("comit", "token", token);
}

async function loadToken() {
  const token = await keytar.getPassword("comit", "token");
  return token;
}

async function RefactorStaged() {
  const stagedDiff = await getStagedDiff();
  if (stagedDiff.length < 5) {
    console.log("No staged changes");
    return;
  }

  const token = (await loadToken()) || "default";
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const payload = {
    code: stagedDiff,
  };
  const response = await fetch(`${ActionUrl}/refactore?token=${token}`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: myHeaders,
  });

  const responseJson = await response.json();
  console.log(marked(responseJson.message));

  return;
}

function getStagedDiff() {
  return new Promise((resolve, reject) => {
    exec("git --no-pager diff --staged", (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      if (stderr) {
        console.error(stderr);
      }
      if (stdout.length < 5) {
        console.log("No staged changes found");
        return;
      }
      resolve(stdout);
    });
  });
}

module.exports = {
  LoginUser,
  RefactorStaged,
  GetCommitMessage,
  SelectComit,
};
