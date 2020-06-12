const fs = require("fs");

var data = fs.readFileSync("./sos.json", "utf8");

var parseToJson = JSON.parse(data);

console.log(parseToJson["demo-location"]);

const { algorithm, key, iv } = require("./config.json");

console.log("algorithm", algorithm);
console.log("key", key);
console.log("iv", iv);
