const payload = require("../backups/spots.json");
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
