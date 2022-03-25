# Jest JSON Result

JSON test results processor for Jest.

Deal with jest results and only output statistics and error information。And strip ANSI strings.

## Setup

```
npm install --save-dev jest-json-result
```

Then add to Jest config in the package.json

```
...
"jest": {
  "testResultsProcessor": "./node_modules/jest-json-result"
},
...
```

## Configure

### output file name

By default, output file goes to test-results.json. You can configure it by adding a outputFile field under jestJsonReporter in your package.json file:

```
"jestJsonResult": {
  "outputFile": "tests/results.json"
},
```

> Inspire by Jest JSON Reporter. Many Thanks.
