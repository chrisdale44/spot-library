/* 

Uploading data to database from json

- Ensure database credentials in .env file are correct
- Generate a spots.json file, if it doesn't already exist, using either of the xmlToJson.js or csvToJson.js scripts
- Move loadFromJson.js into ./pages dir
- npm run dev
- Navigate to localhost:3000/loadFromJson (this page must not be published for production)
- Click the 'Load' button

*/

const payload = require("../../backups/spots.json");
//const payload = require("../backups/tags.json");

function LoadFromBackup() {
  return (
    <button
      onClick={async () => {
        try {
          await fetch("/api/spots/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ spots: payload }),
          });
        } catch (e) {
          console.error(e);
        }
      }}
    >
      Load
    </button>
  );
}
export default LoadFromBackup;
