const fs = require("fs");
const path = require("path");

export function storingTranscriptData(title, content, section, courseName) {
  // Folder With Section Name
  const currentSectionPath = path.join(
    __dirname,
    "..",
    "resources",
    courseName,
    section
  );

  // Folder with Title Name
  const folderPath = path.join(currentSectionPath, title);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const filePath = path.join(folderPath, "transcript.txt"); // Raw Transcript

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(err);
      return console.error("Failed to save the data");
    }
  });
}
