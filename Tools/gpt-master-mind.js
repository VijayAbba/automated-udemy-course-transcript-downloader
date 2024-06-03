const fs = require("fs");
const path = require("path");

// Custom objects to add at the start and end of the array
const customStartObject = {
  title: "Custom Start",
  content: {
    content1:
      "I am currently taking online courses and I need your help to create comprehensive notes using Markdown. Please include code snippets if they are present in the class. Please ensure the notes are well-organized and informative. If you're ready, I'll send you the transcripts.",
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
        const contentObj = {
          content1: `title:"${chapterFolder}" transcript:"${content}"`,
        };
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
  const allContentDir = path.join(sectionDir, "..", "All-Content-GPT");
  if (!fs.existsSync(allContentDir)) {
    fs.mkdirSync(allContentDir);
  }
  const destinationPath = path.join(allContentDir, `${sectionName}.json`);
  fs.copyFileSync(outputFilePath, destinationPath);
  console.log(`Copied ${outputFilePath} to ${destinationPath}`);
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
