const addTestCase = (lang, code, testCases) => {
    //console.log(lang);
    //console.log(testCases);
    if (lang === "python") {
        code += testCases.publicTestCases.map(x => `print(${x.input} == ${x.output})\n`).reduce((x, y) => x + y);
        code += testCases.privateTestCases.map(x => `print(${x.input} == ${x.output})\n`).reduce((x, y) => x + y);
    }

    if (lang === "javascript") {
        code += testCases.publicTestCases.map(x => `console.log(${x.input} == ${x.output})\n`).reduce((x, y) => x + y);
        code += testCases.privateTestCases.map(x => `console.log(${x.input} == ${x.output})\n`).reduce((x, y) => x + y);
    }
    //console.log(code);
    return code;
}


exports.addTestCase = addTestCase;