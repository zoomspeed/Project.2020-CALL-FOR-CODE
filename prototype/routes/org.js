const express = require("express");
const router = express.Router();
const { iv } = require("../config.json");
const { decrypt } = require("../public/javascripts/utils");
const MongoClient = require("../database/connection");
const ObjectID = require("mongodb").ObjectID;

router.get("/", function (req, res) {
  res.send("respond with a resource");
});

// 출입
router.get("/attend", (req, res) => {
  const qr = req.query.qr;
  console.log(qr);
  // 복호화 데이터 생성
  const data = { iv: iv, encryptedData: qr };

  // 복호화
  const decryptData = JSON.parse(decrypt(data));
  console.log(decryptData);
  const orgList = ["음식점", "학원", "학교", "병원"];
  const orgName = orgList[Math.floor(Math.random() * 4)];
  decryptData.org = orgName;
  const nowTime = new Date();
  decryptData.in = nowTime;
  // 체온 랜덤 생성
  let temperature = Math.random() * (39 - 35.7) + 35.7;
  temperature = temperature.toFixed(1);
  decryptData.temperature = temperature;

  // DB 저장
  MongoClient.connect((err, client) => {
    const collection = client.db("sos").collection("userInOutHistory");

    collection.insertOne(decryptData, { forceServerObjectId: true }, function (
      err,
      result
    ) {
      if (err) throw err;
      console.log(result);
      res.render("attend", { name: decryptData.name });
      client.close();
    });
  });
});

// 출입
router.post("/leave", function (req, res) {
  const paramId = req.body._id;

  // DB 저장
  MongoClient.connect(async (err, client) => {
    const collection = client.db("sos").collection("userInOutHistory");

    const doc = await collection.findOne({
      _id: new ObjectID(paramId),
    });

    const myquery = { _id: new ObjectID(paramId) };
    const newvalues = { $set: { ...doc, out: new Date() } };
    collection.updateOne(myquery, newvalues, function (err, result) {
      if (err) throw err;
      console.log("1 document updated");
      res.send({ result: "success" });
    });
  });
});

// 출입
router.get("/history", function (req, res) {

  MongoClient.connect((err, client) => {
    const collection = client.db("sos").collection("userInOutHistory");
    query = {};
    if (err) throw err;
    collection.find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render("userList", { userList: { data: result } });
    });
  });
});

router.get("/getUserList.json", function (req, res) {
  // DB 저장
  MongoClient.connect((err, client) => {
    const collection = client.db("sos").collection("userInOutHistory");
    query = {};
    if (err) throw err;
    collection.find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.json({ userList: { data: result } });
    });
  });
});

module.exports = router;
