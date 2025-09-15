const {
  LoginUser,
  RefactorStaged,
  SelectComit,
  GetCommitMessage,
} = require("./services");
const packageInfo = require("./package.json");

async function handleCommands(action) {
  switch (true) {
    case ["help"].includes(action):
      console.log(
        "Usage: comit [command]\n" +
          "Commands:\n" +
          "    version, v, -v, --version	    : Display the current version of the application.\n" +
          //   "    -b <arg>                 	    : Generate branch name using the given argument.\n" +
          //   "    -c, c <arg>              	    : Get a prompt response based on the given argument.\n" +
          "    login, -l, --login <token>  : Login to the application.\n" +
          //   "    -l, l, live, --live       	    : Get a live prompt response.\n" +
          //   "    refactor, r, -r, --refactor	    : Run the refactor command.\n" +
          "    help, h, -h, --help      	    : Show this help message."
      );
      return;
    case ["v", "version", "-v", "--version"].includes(action):
      console.log(packageInfo.version);
      return;
    case ["login", "-l", "--login"].includes(action):
      LoginUser();
      return;
    case ["refactor", "r", "-r", "--refactor"].includes(action):
      RefactorStaged();
      return;
    case [undefined].includes(action):
      const commitMessages = await GetCommitMessage();
      await SelectComit(commitMessages);
      return;
    default:
      console.log("Invalid command run jcomit help for more information");
      return;
  }
}

module.exports = handleCommands;
