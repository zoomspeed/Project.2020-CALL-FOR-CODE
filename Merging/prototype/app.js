/** Require Setting **/
const http = require("http"),
  express = require("express"),
  path = require("path"),
  static = require("serve-static"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  expressErrorHandler = require("express-error-handler");
require("dotenv").config();

/** Database Setting **/
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://rhie:" + process.env.DB_PWD + "@rhie-b1dyf.mongodb.net/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/** Route **/
const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/public");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/public", static(path.join(__dirname, "public")));

const router = express.Router();
// Visitor --> Map 정보 보기
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

//Database 서버와 연결이 잘 되었는지 확인
router.route("/apitest").get(function (req, res) {
  client.connect((err, client) => {
    console.log("/apitest");
    const collection = client.db("ratlas").collection("users");
    collection.findOne({}, function (err, result) {
      if (err) throw err;
      res.send(result);
      client.close();
    });
  });
});

app.use("/", router);

/** Error Handle **/
const errPath = path.join(__dirname, "public", "404.html");
const errHandler = expressErrorHandler({
  static: {
    "404": errPath,
  },
});

app.use(expressErrorHandler.httpError(404));
app.use(errHandler);

/** Server Starter **/
http.createServer(app).listen(app.get("port"), function () {
  console.log("=======================");
  console.log("|   Save Our Signal   |");
  console.log("=======================");
});
