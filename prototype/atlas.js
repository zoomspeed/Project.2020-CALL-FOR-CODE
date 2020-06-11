const http = require("http"),
  express = require("express"),
  bodyParser = require("body-parser"),
  MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

http.createServer(app).listen(3000, function () {
  console.log("Server Started");

  const uri = "mongodb+srv://rhie:12341234@rhie-b1dyf.mongodb.net/";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  client.connect((err, client) => {
    console.log("connecting");
    const collection = client.db("ratlas").collection("users");
    // collection.find({}).toArray(function (err, result) {
    //   console.log(result);
    // });
    collection.findOne({}, function (err, result) {
      if (err) throw err;
      console.log(result);
      client.close();
    });
  });
});
