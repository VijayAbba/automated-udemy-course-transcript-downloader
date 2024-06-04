const fs = require("fs");
const path = require("path");

const MAX_CONTENT_LENGTH = 5700;

// Custom text variables
const startingText = (chapterFolder) =>
  `Create Good Notes from,Title:${chapterFolder}, Transcript: "`;
const endingText = '"';

const splitContentStartingText = (index, chapterFolder) =>
  `don't create notes yet wait For the Next Part of the transcript,Title:${chapterFolder}, This is transcript part${index}:`;
const splitContentEndingText = (index, chapterFolder) =>
  `Create Good Notes from all parts 1 to ${index},Title:${chapterFolder}, transcript part${index}:`;

// Custom objects to add at the start and end of the array
const customStartObject = {
  title: "Custom Start",
  content: {
    content1:
      "I am currently taking online courses and I need your help to create comprehensive notes using Markdown. Please include code snippets if they are present in the class. Sometimes the lessons are lengthy, so I will divide the transcript for longer classes and paste them like this: 'Transcript Part 1: ...', 'Transcript Part 2: ...', and so on. For shorter classes, I will simply paste 'Transcript: ...'. Please ensure the notes are well-organized and informative. If you're ready, I'll send you the transcripts.",
  },
};

const customEndObject = {
  title: "Custom End",
  content: {
    content1: "Thank you this is end of this section",
  },
};

// Function to collect transcript contents from chapter folders
function collectTranscripts(sectionDir) {
  // Read the contents of the section directory
  let chapterFolders;
  try {
    chapterFolders = fs.readdirSync(sectionDir);
  } catch (err) {
    console.error(`Error reading directory ${sectionDir}:`, err);
    return;
  }

  const sectionName = path.basename(sectionDir);
  const transcripts = [];

  // Loop through the chapter folders
  chapterFolders.forEach((chapterFolder) => {
    const chapterDir = path.join(sectionDir, chapterFolder);

    // Check if the directory contains transcript.txt
    const transcriptPath = path.join(chapterDir, "transcript.txt");
    if (fs.existsSync(transcriptPath)) {
      try {
        const content = fs.readFileSync(transcriptPath, "utf-8");
        const contentParts = splitContent(content);

        const contentObj = {};
        contentParts.forEach((part, index) => {
          contentObj[`content${index + 1}`] = part;
        });

        if (contentParts.length === 1) {
          // Add custom text for single content
          contentObj.content1 = `${startingText(chapterFolder)}\n${
            contentObj.content1
          }\n${endingText}`;
        } else {
          // Add custom text for multiple content parts
          contentParts.forEach((part, index) => {
            if (index === contentParts.length - 1) {
              contentObj[`content${index + 1}`] = `${splitContentEndingText(
                index + 1,
                chapterFolder
              )}"${part}"`;
            } else {
              contentObj[`content${index + 1}`] = `${splitContentStartingText(
                index + 1,
                chapterFolder
              )}"${part}"`;
            }
          });
        }

        transcripts.push({
          title: chapterFolder,
          content: contentObj,
        });
      } catch (err) {
        console.error(`Error reading file ${transcriptPath}:`, err);
      }
    }
  });

  // Add custom objects at the start and end of the array
  transcripts.unshift(customStartObject);
  transcripts.push(customEndObject);

  // Write all transcript data to <sectionName>.json in the section folder
  const outputFilePath = path.join(sectionDir, `${sectionName}.json`);
  try {
    fs.writeFileSync(
      outputFilePath,
      JSON.stringify(transcripts, null, 2),
      "utf-8"
    );
    console.log(
      `Transcripts for ${sectionName} have been collected and saved to ${outputFilePath}`
    );
  } catch (err) {
    console.error(`Error writing to ${outputFilePath}:`, err);
  }

  // Copy the JSON file to All-Content directory
  const allContentDir = path.join(sectionDir, "..", "All-Content");
  if (!fs.existsSync(allContentDir)) {
    fs.mkdirSync(allContentDir);
  }
  const destinationPath = path.join(allContentDir, `${sectionName}.json`);
  fs.copyFileSync(outputFilePath, destinationPath);
  console.log(`Copied ${outputFilePath} to ${destinationPath}`);
}

// Function to split content into parts of given maximum length without breaking words
function splitContent(content) {
  const parts = [];
  let currentPart = "";
  let currentLength = 0;

  const words = content.split(" ");
  words.forEach((word) => {
    if (currentLength + word.length + 1 > MAX_CONTENT_LENGTH) {
      parts.push(currentPart);
      currentPart = "";
      currentLength = 0;
    }
    currentPart += (currentLength === 0 ? "" : " ") + word;
    currentLength += (currentLength === 0 ? 0 : 1) + word.length;
  });

  if (currentPart.length > 0) {
    parts.push(currentPart);
  }

  return parts;
}

// Start with the desired directory (root directory containing section folders)
const startDir = "."; // Change this to your root directory
const sectionFolders = fs
  .readdirSync(startDir)
  .map((dir) => path.join(startDir, dir));

// Loop through each section folder and collect transcripts
sectionFolders.forEach((sectionDir) => {
  // Check if it's a directory
  if (fs.statSync(sectionDir).isDirectory()) {
    collectTranscripts(sectionDir);
  }
});
