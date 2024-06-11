const fs = require("fs");
const path = require("path");

function padNumber(num, length) {
  return String(num).padStart(length, "0");
}

const directory = __dirname;

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error("Unable to scan directory:", err);
    return;
  }

  files
    .filter((file) => fs.lstatSync(path.join(directory, file)).isDirectory())
    .forEach((folder) => {
      // Extract the number part using a regular expression
      const match = folder.match(/^(Section-)(\d+)(-.+)$/);
      if (match) {
        const num = parseInt(match[2], 10);
        const paddedNum = padNumber(num, 3);
        const newFolderName = `${match[1]}${paddedNum}${match[3]}`;
        const oldFolderPath = path.join(directory, folder);
        const newFolderPath = path.join(directory, newFolderName);

        fs.rename(oldFolderPath, newFolderPath, (err) => {
          if (err) {
            console.error(`Error renaming folder ${folder}:`, err);
          } else {
            console.log(`Renamed ${folder} to ${newFolderName}`);
          }
        });
      } else {
        console.error(`Folder ${folder} does not match the expected format.`);
      }
    });
});
