# Automated Udemy Course Transcript Downloader

This project allows you to automate the process of downloading Udemy courses using Playwright. Follow these detailed instructions to set up and run the project.

## Prerequisites

Ensure you have Node.js and npm installed on your system. You can download Node.js from [here](https://nodejs.org/).

```sh
npm init playwright@latest
```

## Setup Instructions

1. **Generate Authentication Storage**:

   - Open a terminal or command prompt.
   - Run the following command to start Playwright's code generation tool, which will save your authentication state:

     ```sh
     npx playwright codegen --save-storage=udemy-auth.json

     or


     npx playwright codegen --save-storage=udemy-auth.json --browser=firefox

     ```

2. **Log into Your Udemy Account**:

   - A browser window will open automatically after running the above command.
   - Use this browser window to log into your Udemy account.
   - Ensure that you successfully log in and can access your courses.

3. **Close the Browser**:

   - Once you are logged in and can see your courses, close the browser window.
   - This action will generate the `udemy-auth.json` file, which contains your saved authentication state.

4. **Create an Auth Folder and Move the JSON File**:

   - In your project directory, create a folder named `auth`.
   - Move the `udemy-auth.json` file into the `auth` folder. Your project directory should look like this:
     ```
     your-project-directory/
     ├── auth/
     │   └── udemy-auth.json
     ├── tests/
     │   └── udemy.spec.ts
     ├── package.json
     ├── ...
     ```

5. **Update the URL in `udemy.spec.ts`**:

   - Open the `udemy.spec.ts` file located in the `tests` folder.
   - Find the `MyGlobalVariable` object within the file.
   - Replace the `URL` key value with the URL of the first class of the course you want to download. It should look something like this:
     ```typescript
     const MyGlobalVariable = {
       URL: "https://www.udemy.com/course/course-name/learn/lecture/lecture-id",
     };
     ```

6. **Start the Test**:
   - In your IDE or code editor, locate the `udemy.spec.ts` file.
   - Click the play button beside the test in the `udemy.spec.ts` file to start the test.

## Additional Notes

- Ensure that the Playwright extension is installed and enabled in your IDE to see the play button beside the test file.
- If you encounter any issues, refer to the Playwright [documentation](https://playwright.dev/docs/intro) for more detailed information on configuration and troubleshooting.

By following these steps, you should be able to automate the downloading of your Udemy courses efficiently. Enjoy your learning!
