// To run:
// node ./scripts/xmlToSeed.js

const fs = require("file-system");
const convert = require("xml-js");

const fileName = "londonSpots";
const filePath = `./backups/${fileName}.kml`;

fs.readFile(filePath, { encoding: "utf-8" }, (err, xmlData) => {
  if (err) {
    throw err;
  }

  const jsData = convert.xml2js(xmlData, {
    compact: true,
    spaces: 4,
  });

  const parsePlacemark = (p) => {
    const coordinates = p.Point.coordinates._text
      .match(/(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/g)[0]
      .split(",");

    let imgUrls;
    if (p.ExtendedData && p.ExtendedData.Data.value._text) {
      imgUrls = p.ExtendedData.Data.value._text.split(" ");
    } else if (p.ExtendedData && p.ExtendedData.Data.value._cdata) {
      imgUrls = p.ExtendedData.Data.value._cdata.split(" ");
    }

    return {
      name: p.name._text,
      imgUrls,
      coordinates: [coordinates[1], coordinates[0]],
      description: p.description ? p.description._text : undefined,
    };
  };

  const folders = jsData.kml.Document.Folder;
  let formattedJsonData = [];
  const startingPosition = 0;

  for (let i = startingPosition; i < folders.length; i++) {
    const folder = folders[i];
    if (!folder.Placemark) {
      continue;
    }
    if (folder.Placemark.length) {
      formattedJsonData = [].concat(
        formattedJsonData,
        folder.Placemark.map(parsePlacemark)
      );
    } else {
      formattedJsonData = [].concat(
        formattedJsonData,
        parsePlacemark(folder.Placemark)
      );
    }
  }

  const outputFile = `./backups/${fileName}.json`;

  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  fs.writeFile(outputFile, JSON.stringify(formattedJsonData));
});
