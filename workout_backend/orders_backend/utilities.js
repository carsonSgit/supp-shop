const fs = require('fs');
const { constants } = require("buffer");

function readFromJsonFile(filename){
    const rawText = fs.readFileSync(filename).toString();
    const parsedJson = JSON.parse(rawText);

    return parsedJson;
}


function writeToJsonFile(filename,data){
    const stringToWrite = JSON.stringify(data);
    fs.writeFileSync(filename, stringToWrite);


}

module.exports = {
    readFromJsonFile,
    writeToJsonFile,
};