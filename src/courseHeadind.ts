//

const courseHeadingSelector = 'h1[data-purpose="course-header-title"]';

async function openCourseContent(page) {
  // Open Course Content
  const courseContentSelector = 'button[data-purpose="open-course-content"]';
  const courseContent = await page.$(courseContentSelector);
  if (courseContent) {
    await page.click(courseContentSelector);
    await page.waitForTimeout(3000);
  }
}

export async function courseHeading(page) {
  // Open Course Content
  await openCourseContent(page);

  // 1. COURSE HEADING   data-purpose="course-header-title"
  const courseHeading = await page.$(courseHeadingSelector);
  let courseName = await courseHeading?.textContent();
  if (courseHeading) {
    if (courseName) {
      courseName = courseName.replace(/[^\w\s]/gi, "");
      courseName = courseName.replace(/\s+/g, "-");
    }
    return courseName;
  }
  return "No Course Name Found";
}

const currentTitleSelector = 'li[aria-current="true"]';
const currentTitleSpanSelector = 'span[data-purpose="item-title"]';

export async function titleHeading(page) {
  // Open Course Content
  await openCourseContent(page);
  
  const liElement = await page.$(currentTitleSelector);

  // Within this <li>, find the <span> with attribute data-purpose="item-title"
  if (liElement) {
    const spanElement = await liElement.$(currentTitleSpanSelector);

    if (spanElement) {
      let titleText = await spanElement.textContent();
      titleText = titleText.replace(/[^\w\s]/gi, "");
      titleText = titleText.replace(/\s+/g, "-");
      return titleText;
    }
  }
  return "No Title Name Found";
}

export async function sectionHeading(page) {
  // Open Course Content
  await openCourseContent(page);

  let liElement = await page.$(currentTitleSelector);
  // Find the parent div with class "accordion-panel-module--panel--Eb0it" that contains liElement

  const parentDiv = await liElement.$(
    'xpath=ancestor::div[contains(@class, "accordion-panel-module--panel--Eb0it")]'
  );

  // Find the h3 element within the parent div
  const h3Element = await parentDiv?.$("h3");

  // Get the text content of the h3 element
  const sectionTextContent = await page.evaluate(
    (h3Element) => h3Element?.textContent,
    h3Element
  );

  if (sectionTextContent) {
    let sectionText = sectionTextContent.replace(/[^\w\s]/gi, "");
    sectionText = sectionText.replace(/\s+/g, "-");

    return sectionText;
  }

  return "No Section Name  Found";
}
