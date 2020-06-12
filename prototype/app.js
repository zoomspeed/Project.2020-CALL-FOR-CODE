/** Require Setting **/
const http = require("http"),
  express = require("express"),
  path = require("path"),
  static = require("serve-static"),
  bodyParser = require("body-parser"),
  cookieParser = require("cookie-parser"),
  expressErrorHandler = require("express-error-handler"),
  QR = require("qrcode"),
  crypto = require("crypto");
const user = require("./public/data/user.json");
let idx = 0;
const { algorithm, key, iv } = require("./config.json");
require("dotenv").config();

/** Database Setting **/
const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://rhie:" + process.env.DB_PWD + "@rhie-b1dyf.mongodb.net/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

/** Server Parameters Setting **/
const app = express();
app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/public");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/public", static(path.join(__dirname, "public")));

/** Route **/
const router = express.Router();

//////QR 생성하기//////
router.get("/QR", function (req, res) {
  // 체온 랜덤 생성
  const temperature = Math.random() * (39 - 35.7) + 35.7;
  const data = user[idx];
  idx++;
  data.temperature = temperature.toFixed(1);

  const result = encrypt(JSON.stringify(data)).encryptedData; // 암호화
  const url = "https://sos.mybluemix.net/attend?qr=" + result; // 스캔 시 전송할 url 만들기

  QR.toDataURL(url, { errorCorrectionLevel: "L" }, function (err, code) {
    res.render("index", { title: "VISITOR", qr: code });
  });
});

//////QR 데이터 확인//////
router.get("/attend", function (req, res) {
  const qr = req.query.qr;

  // 복호화 데이터 생성
  const data = { iv: iv, encryptedData: qr };

  // 복호화
  const decryptData = decrypt(data);

  client.connect((err, client) => {
    console.log("/attend");
    const collection = client.db("sos").collection("userInOutHistory");

    collection.insertOne(
      JSON.parse(decryptData),
      { forceServerObjectId: true },
      function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render("qr", { result: result });
        client.close();
      }
    );
  });
});

//////Visitor --> Map 정보 보기//////
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

//////Database 서버와 연결이 잘 되었는지 확인//////
router.route("/apitest").get(function (req, res) {
  client.connect((err, client) => {
    console.log("/apitest");
    const collection = client.db("sos").collection("userInOutHistory");
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

/** Function List **/
function encrypt(text) {
  //Buffer.from(key)
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decrypt(text) {
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

/** Server Starter **/
http.createServer(app).listen(app.get("port"), function () {
  console.log("=======================");
  console.log("|   Save Our Signal   |");
  console.log("=======================");
});
