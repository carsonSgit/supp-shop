const fs = require('fs');
const { constants } = require("buffer");
const fsPromises = fs.promises;

async function readFromJsonFile(filename)
{
    const rawText = (await fsPromises.readFile(filename)).toString();
    const parsedJson = JSON.parse(rawText);

    return parsedJson;
}


async function writeToJsonFile(filename,data)
{
    const stringToWrite = JSON.stringify(data);
    await fsPromises.writeFile(filename, stringToWrite);


}

module.exports = {
    readFromJsonFile,
    writeToJsonFile,
};