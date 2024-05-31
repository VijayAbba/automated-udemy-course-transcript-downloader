import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

test("notes", async ({ browser }) => {
  test.setTimeout(0);

  // Get List of contents
  const directoryPath = path.join(__dirname, "contents");
  const allContentsList = fs.readdirSync(directoryPath);

  ///////////////////////////////////////////////// /

  const context = await browser.newContext({
    storageState: "./auth/codedamn-auth.json",
  });

  const page = await context.newPage();

  //////////////////////////////////////////////////

  // loo form here

  for (const singleContent of allContentsList) {
    await page.goto(
      "https://codedamn.com/learn/http-fundamentals/start/guide.before-you-start"
    );
    await page.waitForTimeout(3000);

    await page.click(
      'div[class="fixed bottom-10 right-3 z-[1000] bg-indigo-600 cursor-pointer w-[54px] h-[54px] rounded-full flex items-center justify-center text-white opacity-80 hover:opacity-100"]'
    );

    await page.waitForTimeout(3000);

    //////////////////////////////////////////////////

    // Read the JSON file synchronously
    const rawData = fs.readFileSync(
      path.join(__dirname, "contents", singleContent),
      "utf8"
    );

    // Parse the JSON data
    const allContent = JSON.parse(rawData);

    // Wait until the button is not disabled anymore
    const selector =
      'button[class="absolute bottom-1.5 right-2 rounded-md p-1 text-white transition-colors enabled:bg-indigo-600 disabled:text-gray-400 disabled:opacity-40 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent md:bottom-3 md:right-3 md:p-2"]:not(.disabled):not([disabled])';

    for (const item of allContent) {
      for (const contentKey of Object.keys(item.contents)) {
        const content = item.contents[contentKey];
        // console.log(content);

        await page.fill('textarea[id="ai-user-input-textarea"]', content);

        await page.waitForSelector(selector, {
          state: "attached",
          timeout: 30000000,
        });
        // Click the button once it is enabled
        await page.click(selector);
      }
    }
  }
});
