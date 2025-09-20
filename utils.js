const fs = require("fs");
const readline = require("readline");

async function readFile(fileName) {
  try {
    const data = await fs.readFile(fileName, "utf8");
    console.log(data);
  } catch (error) {
    console.error("Error reading file:", error);
  }
}

async function readLines(filename, startLine, endLine) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentLine = 0;
  const lines = [];

  for await (const line of rl) {
    currentLine++;

    if (currentLine >= startLine && currentLine <= endLine) {
      lines.push(line);
    }

    // Stop reading once we've passed the end line
    if (currentLine > endLine) {
      break;
    }
  }

  return lines.join("\n");
}

module.exports = {
  readFile,
  readLines,
};
