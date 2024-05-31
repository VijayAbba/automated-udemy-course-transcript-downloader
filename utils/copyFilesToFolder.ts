

const fs = require("fs");
const path = require("path");

export function copyFileToAFolder(courseHeadingText) {
  const sourceFolder = path.join(__dirname, "..", "Tools");

  const destinationFolder = path.join(
    __dirname,
    "..",
    "resources",
    courseHeadingText
  );

  // Read all files in the source folder
  fs.readdir(sourceFolder, (error, files) => {
    if (error) {
      console.error("Error reading source folder:", error);
      return;
    }

    // Loop through each file in the source folder
    files.forEach((file) => {
      // Construct the full path to the source file
      const sourceFile = path.join(sourceFolder, file);
      // Construct the full path to the destination file
      const destinationFile = path.join(destinationFolder, file);

      // Create a read stream for the source file
      const readStream = fs.createReadStream(sourceFile);
      // Create a write stream for the destination file
      const writeStream = fs.createWriteStream(destinationFile);

      // Use pipe() method to read from the source file and write to the destination file
      readStream.pipe(writeStream);

      // Listen for the 'finish' event to know when the copy is complete
      writeStream.on("finish", () => console.log(`File copied: ${file}`));

      // Listen for any errors during the copy process
      readStream.on("error", (error) =>
        console.error(`Error copying file ${file}:`, error)
      );
      writeStream.on("error", (error) =>
        console.error(`Error copying file ${file}:`, error)
      );
    });
  });
}
