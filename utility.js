const fs = require("fs/promises");
const path = require("path");

async function readDataJson() {
  return await fs.readFile(path.join(__dirname, "db.json")).then((buffer) => {
    if (buffer.length != 0) return JSON.parse(buffer.toLocaleString());
    return null;
  });
}

async function writeDataJson(data) {
  let ifError = undefined;
  await fs.writeFile(path.join(__dirname, "db.json"), data).catch((e) => {
    ifError = new Error(e.message);
  });

  if (ifError) return ifError;

  return { message: "Data inserted succesfully" };
}

module.exports = { readDataJson, writeDataJson };
