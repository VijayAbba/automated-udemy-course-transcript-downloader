// server.js

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const TurndownService = require("turndown");

const app = express();
const PORT = 3001;

app.use(cors());

// Middleware to parse JSON body of the request
// app.use(express.json()); // Expecting JSON data in the body

// Increase the payload limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const turndownService = new TurndownService();

let count = 0;

app.post("/html-data", (req, res) => {
  count++;
  const divContent = req.body; // Assuming divContent is directly under the body
  const notesFolderPath = path.join(__dirname, "myNotes");
  const notesFilePath = path.join(notesFolderPath, `notesContent${count}.md`);
  const elementsFilePath = path.join(notesFolderPath, `elements${count}.html`);

  // Ensure the new-notes folder exists
  if (!fs.existsSync(notesFolderPath)) {
    fs.mkdirSync(notesFolderPath, { recursive: true });
  }

  // Initialize notes.md and elements.html content
  let notesContent = "";
  let elementsContent = "<div>";

  divContent.forEach((element) => {
    // Convert HTML to Markdown
    const markdownContent = turndownService.turndown(element);
    // Append converted content to notesContent
    notesContent += markdownContent + "\n\n ___ \n\n ";

    // Append HTML content to elementsContent
    elementsContent += element + "\n\n <hr> \n\n";
  });
  // Append or create notes.md with all converted Markdown content
  fs.appendFileSync(notesFilePath, notesContent, "utf8");

  // Append or create elements.html with all HTML content
  fs.writeFileSync(elementsFilePath, elementsContent + "</div>", "utf8");

  console.log(`Content saved in Markdown format in ${notesFilePath}`);
  res.send(
    "Content has been processed and saved in Markdown format in notes.md."
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
