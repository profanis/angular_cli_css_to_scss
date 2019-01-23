const fileParsing = require('./file_parsing');

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/angular-cli");
    process.exit(-1);
}

const directoryPath = process.argv[2];

fileParsing.parseAngularJsonFile(directoryPath);
fileParsing.parseFiles(directoryPath);
fileParsing.report();