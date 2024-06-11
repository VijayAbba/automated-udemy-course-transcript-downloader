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
    .filter((file) => path.extname(file) === ".json")
    .forEach((file) => {
      // Extract the number part using a regular expression
      const match = file.match(/^(Section-)(\d+)(-.+\.json)$/);
      if (match) {
        const num = parseInt(match[2], 10);
        const paddedNum = padNumber(num, 3);
        const newFileName = `${match[1]}${paddedNum}${match[3]}`;
        const oldFilePath = path.join(directory, file);
        const newFilePath = path.join(directory, newFileName);

        fs.rename(oldFilePath, newFilePath, (err) => {
          if (err) {
            console.error(`Error renaming file ${file}:`, err);
          } else {
            console.log(`Renamed ${file} to ${newFileName}`);
          }
        });
      } else {
        console.error(`File ${file} does not match the expected format.`);
      }
    });
});
