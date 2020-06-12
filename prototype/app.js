/** Require Setting **/
const http = require("http"),
      express = require("express"),
      path = require("path"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      expressErrorHandler = require("express-error-handler"),
      logger = require('morgan');

/** Server Parameters Setting **/
const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/** Custom Require **/      
require("dotenv").config();
const router = require('./routes');

/** Route **/
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
