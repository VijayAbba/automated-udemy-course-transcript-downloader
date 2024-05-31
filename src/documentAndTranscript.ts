

import { storingTranscriptData } from "../utils/storingData";

const transcriptBtnSelector = 'button[data-purpose="transcript-toggle"]';

export async function extractTranscript(
  page,
  titleText,
  sectionText,
  courseHeadingText
) {
  //1. Clicking Transcript buttion
  await page.click(transcriptBtnSelector);
  await page.waitForTimeout(5000);

  const transcriptDivElement = await page.$("#ct-sidebar-scroll-container");

  if (transcriptDivElement) {
    //2. Copy Transcript
    const transcriptText = await transcriptDivElement.textContent();
    // 3. Sending transcript
    storingTranscriptData(
      titleText,
      transcriptText,
      sectionText,
      courseHeadingText
    );
  }
  //4. Close Transcript
  await page.waitForTimeout(3000);
  await page.click(transcriptBtnSelector);
}

export async function extractDocument(
  page,
  titleText,
  sectionText,
  courseHeadingText
) {
  const docDivElement = await page.$(".text-viewer--content--JQnss");
  if (docDivElement) {
    const docText = await docDivElement.textContent();
    storingTranscriptData(
      `${titleText} DOC`,
      docText,
      sectionText,
      courseHeadingText
    );
  }
}
