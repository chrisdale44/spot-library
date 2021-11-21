// To run:
// node ./scripts/csvToJson.js

const fs = require("file-system");
const csv = require("csvtojson");

const fileName = "spots";
const filePath = `./backups/${fileName}.csv`;

csv()
  .fromFile(filePath)
  .then((formattedJsonData) => {
    console.log(formattedJsonData);
    const outputFile = `./backups/${fileName}.json`;

    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile);
    }

    fs.writeFile(
      outputFile,
      JSON.stringify(formattedJsonData.sort((a, b) => a.id - b.id))
    );
  });
