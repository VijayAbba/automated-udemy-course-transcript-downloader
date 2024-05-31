const { exec } = require("child_process");

export function runShellCommand(command, cwd) {
  // Execute the command in the shell
  exec(command, { cwd }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      return;
    }
    console.log(`Command stdout: ${stdout}`);
  });
}
