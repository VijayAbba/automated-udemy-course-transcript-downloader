import fs from "fs";
import path from "path";
import { test, expect } from "@playwright/test";

import { copyFileToAFolder } from "../utils/copyFilesToFolder";

import { runShellCommand } from "../utils/runShellCommand";

import {
  courseHeading,
  titleHeading,
  sectionHeading,
} from "../src/courseHeadind";

import {
  extractDocument,
  extractTranscript,
} from "../src/documentAndTranscript";

//
//

enum MyGlobalVariable {
  URL = "https://www.udemy.com/course/git-github-practical-guide/learn/lecture/28082344?start=45#overview",
}

test("udemy course Transcript downloader ", async ({ browser }) => {
  test.setTimeout(0);

  const context = await browser.newContext({
    storageState: "./auth/udemy-auth.json",
  });
  const page = await context.newPage();

  await page.goto(MyGlobalVariable.URL);
  await page.waitForTimeout(7000);

  // Close reminder
  const remindMeLaterSelector = 'button[data-purpose="remind-me-later-cta"]';
  const remindMeLater = await page.$(remindMeLaterSelector);
  if (remindMeLater) {
    await page.click(remindMeLaterSelector);
  }

  await page.waitForTimeout(3000);

  //Course Heading
  const courseHeadingText = await courseHeading(page);

  let thisIsTheLastLeture = false;

  // loop from here
  for (let i = 0; !thisIsTheLastLeture; i++) {
    // current title and section heading
    let titleText = await titleHeading(page);
    let sectionText = await sectionHeading(page);

    await page.waitForTimeout(3000);

    const transcriptBtnSelector = 'button[data-purpose="transcript-toggle"]';
    const transcriptBtnElement = await page.$(transcriptBtnSelector);

    if (transcriptBtnElement) {
      await extractTranscript(page, titleText, sectionText, courseHeadingText);
    } else if (
      // [1] for other non Transcript Classes
      !transcriptBtnElement &&
      !titleText.startsWith("Quiz")
    ) {
      await extractDocument(page, titleText, sectionText, courseHeadingText);
    }

    await page.waitForTimeout(3000);

    // check next button
    const nextLetureBtn = await page.$('div[data-purpose="go-to-next"]');

    if (nextLetureBtn) {
      await page.click('div[data-purpose="go-to-next"]');
    } else {
      // this will be the last so end the loop
      thisIsTheLastLeture = true;

      // Add
      // This is end to json

      // copying file to course folder
      copyFileToAFolder(courseHeadingText);

      await page.waitForTimeout(10000);

      /*
runShellCommand(
        `node master-mind.js`,
        path.join(__dirname, "..", "resources", courseHeadingText)
      );
*/

      /*
      await page.waitForTimeout(30000);

      runShellCommand(
        `bash manipulateRunner.bash`,
        path.join(__dirname, "..", "resources", courseHeadingText)
      );
      */
    }
  }
});
