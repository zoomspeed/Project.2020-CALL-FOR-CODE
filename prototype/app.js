const http = require("http"),
  express = require("express"),
  path = require("path"),
  static = require("serve-static"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  expressErrorHandler = require("express-error-handler");

const MongoClient = require("mongodb").MongoClient;

const app = express();
const router = express.Router();
require("dotenv").config();

app.set("views", __dirname + "/public");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/public", static(path.join(__dirname, "public")));

router.route("/map").get(function (req, res) {
  let query = req.query.qry;
  let context = {
    query: query,
    API_KEY: process.env.API_KEY,
  };
  req.app.render("map", context, function (err, html) {
    res.end(html);
  });
});

router.route("/apiTest").get(function (req, res) {
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
      res.send(result);
      client.close();
    });
  });
});

app.use("/", router);

const errPath = path.join(__dirname, "public", "404.html");
const errHandler = expressErrorHandler({
  static: {
    "404": errPath,
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errHandler);

http.createServer(app).listen(3000, function () {
  console.log("Server Started");
});
