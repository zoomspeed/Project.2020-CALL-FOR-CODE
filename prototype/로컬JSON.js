const fs = require("fs");

var data = fs.readFileSync("./sos.json", "utf8");

var parseToJson = JSON.parse(data);

console.log(parseToJson["demo-location"]);
