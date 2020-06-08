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

function connectDB() {
  const databaseURL = "mongodb://localhost:27017";
  const dbName = "local";
  const mongoClient = MongoClient(databaseURL, { useUnifiedTopology: true });
  mongoClient.connect(function (err, client) {
    app.set("database", client.db(dbName));
  });
}
app.set("views", __dirname + "/public");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/public", static(path.join(__dirname, "public")));

router.route("/map").get(function (req, res) {
  var context = { API_KEY: process.env.API_KEY };
  req.app.render("map", context, function (err, html) {
    res.end(html);
  });
});

router.route("/process/addUser").post(function (req, res) {});

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
  connectDB();
});
