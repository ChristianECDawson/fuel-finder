# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

When running the tests, local node_modules may have to be edited due to package version issues.

The required changes are as follows:

    node_modules/jest-watch-typeahead/build/file_name_plugin/plugin.js

### `import jestWatcher from 'jest-watcher'; const { Prompt } = jestWatcher;`

    node_modules/jest-watch-typeahead/build/file_name_plugin/prompt.js

### `import pkg from 'jest-watcher'; const { PatternPrompt, printPatternCaret, printRestoredPatternCaret } = pkg; import escStrForRegex from 'jest-regex-util'; const { escapeStrForRegex } = escStrForRegex;`