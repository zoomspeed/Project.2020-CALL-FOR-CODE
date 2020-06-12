/** Database Setting **/
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://rhie:" + process.env.DB_PWD + "@rhie-b1dyf.mongodb.net/";

module.exports = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true });