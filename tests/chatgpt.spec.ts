import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

test("notes-creator", async ({ browser }) => {
  test.setTimeout(0);

  // Get List of contents
  const directoryPath = path.join(__dirname, "contents-raw");
  const allContentsList = fs.readdirSync(directoryPath);

  const context = await browser.newContext({
    storageState: "./auth/chatgpt.json",
  });

  const page = await context.newPage();

  for (const singleContent of allContentsList) {
    // https://chatgpt.com/g/g-B694V9Jp7-jarvis?oai-dm=1
    await page.goto("https://chatgpt.com/");

    await page.waitForTimeout(3000);

    //////////////////////////////////////////////////

    // Read the JSON file synchronously
    const rawData = fs.readFileSync(
      path.join(__dirname, "contents-raw", singleContent),
      "utf8"
    );

    // Parse the JSON data
    const allContent = JSON.parse(rawData);

    // Wait until the button is not disabled anymore
    const selector =
      'button[data-testid="fruitjuice-send-button"]:not(.disabled):not([disabled])';

    for (const item of allContent) {
      for (const contentKey of Object.keys(item.content)) {
        const content = item.content[contentKey];

        await page.fill('textarea[id="prompt-textarea"]', content);

        //   await page.waitForTimeout(3000);
        await page.waitForSelector(selector, {
          state: "attached",
        });
        // Click the button once it is enabled
        await page.click(selector);

        await page.waitForTimeout(2000);
      }
    }
  }
});
