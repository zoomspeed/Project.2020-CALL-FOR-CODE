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

  // 복호화 데이터 생성
  const data = { iv: iv, encryptedData: qr };

  // 복호화
  const decryptData = JSON.parse(decrypt(data));

  const orgList = ["음식점", "학원", "학교", "병원"];

  // 체온 랜덤 생성
  const temperature = Math.random() * (39 - 35.7) + 35.7;
  temperature = temperature.toFixed(1);

  // DB 저장
  MongoClient.connect((err, client) => {
    const collection = client.db("sos").collection("userInOutHistory");

    collection.insertOne(
      {
        ...decryptData,
        org: orgList[Math.floor(Math.random() * 4)],
        temperature: temperature,
        in: new Date(),
      },
      { forceServerObjectId: true },
      function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render("attend", { name: decryptData.name });
        client.close();
      }
    );
  });
});

// 출입
router.post("/leave", function (req, res) {
  const paramId = req.body._id;

  // DB 저장
  MongoClient.connect(async (err, client) => {
    const collection = client.db("sos").collection("userInOutHistory");

    const res = await collection.findOne({
      _id: new ObjectID(paramId),
    });

    const myquery = { _id: new ObjectID(paramId) };
    const newvalues = { $set: { ...res, out: new Date() } };
    collection.updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
  });
});

// 출입
router.get("/history", function (req, res) {
  // DB 저장
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

module.exports = router;
