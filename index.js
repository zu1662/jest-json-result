const fs = require('fs');
const readPkg = require('read-pkg');

function stripAnsi(s){
  // 控制台着色 ANSI 代码去除
  const pattern = [
    '[\\u001b\\u001B\\u009b\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
  ].join('|');
  const ansiRegex = new RegExp(pattern, 'g');
  return s.replace(ansiRegex, '')
}

module.exports = (testFinalResult) => {
  const failedResults = []
  const testResultsArr = testFinalResult.testResults
  for (let i = 0; i < testResultsArr.length; i++) {
    const item = testResultsArr[i];
    if(item.failureMessage) {
      failedResults.push(item)
    }
  }

  delete testFinalResult.testResults 
  delete testFinalResult.coverageMap 
  let testResultsString = JSON.stringify({
    ...testFinalResult,
    testResults: failedResults
  });

  // 正则无法针对 JSON 转义后的字符串有效替换。使用 JSON.parse 的函数方式，针对 value 未转义的字符串进行替换
  testResultsString = JSON.stringify(JSON.parse(testResultsString, (key, value) => {
    return typeof value === 'string' ?  stripAnsi(value) : value
  }))
  const packagedData = readPkg.sync(process.cwd())
  const config = packagedData.jestJsonResult || {};

  const outputFile = config.outputFile || './test-results.json';

  fs.writeFile(outputFile, testResultsString, (err) => {
    if (err) {
      console.warn('Unable to write test results JSON', err);
    }
  });

  return testFinalResult;
};
