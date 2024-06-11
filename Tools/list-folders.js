const fs = require("fs");
const path = require("path");

fs.readdir(process.cwd(), (err, files) => {
  if (err) {
    return console.error("Unable to scan directory:", err);
  }

  files.forEach((file) => {
    const filePath = path.join(process.cwd(), file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        return console.error("Unable to stat file:", err);
      }

      if (stats.isDirectory()) {
        console.log(file);
      }
    });
  });
});
