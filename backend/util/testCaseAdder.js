const addTestCase = (lang, code, testCases) => {
    //console.log(lang);
    //console.log(testCases);
    if (lang === "python") {
        code += testCases.publicTestCases.map(x => `print(${x.input} == ${x.output})\n`).reduce((x, y) => x + y);
        code += testCases.privateTestCases.map(x => `print(${x.input} == ${x.output})\n`).reduce((x, y) => x + y);
    }

    if (lang === "javascript") {
        code += testCases.publicTestCases.map(x => `console.log(${x.input} == ${x.output});\n`).reduce((x, y) => x + y);
        code += testCases.privateTestCases.map(x => `console.log(${x.input} == ${x.output});\n`).reduce((x, y) => x + y);
    }

    if (lang === "java") {
        //TODO: working properly, but only for basic algorithms and scripting-like functions
        let main_code = "public static void main(String[] args) {";
        main_code += testCases.publicTestCases.map(x => `System.out.println(Main.${x.input} == ${x.output});`).reduce((x, y) => x + y);
        main_code += testCases.privateTestCases.map(x => `System.out.println(Main.${x.input} == ${x.output});`).reduce((x, y) => x + y);
        main_code += "}"
        console.log(main_code);
        code = code.trim();

        code = code.substring(0, code.length - 1) + main_code + "}";
        
        console.log(code);
        return code;
    }
    //console.log(code);
    return code;
}


exports.addTestCase = addTestCase;