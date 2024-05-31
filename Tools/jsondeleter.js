const fs = require("fs");
const path = require("path");

function deleteJsonFiles(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      deleteJsonFiles(filePath); // Recursively call for subdirectories
    } else if (stats.isFile() && path.extname(filePath) === ".json") {
      fs.unlinkSync(filePath);
      console.log(`Deleted ${filePath}`);
    }
  });
}

const targetDir = __dirname; // Replace with your target directory
deleteJsonFiles(targetDir);

console.log("Finished deleting .json files.");
