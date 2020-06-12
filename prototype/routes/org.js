const express = require('express');
const router = express.Router();
const { iv } = require('../config.json');
const { decrypt } = require('../public/javascripts/utils');
const MongoClient = require('../database/connection');

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

// 출입
router.get('/attend', (req, res) => {
  const qr = req.query.qr;

  // 복호화 데이터 생성
  const data = { iv: iv, encryptedData: qr };

  // 복호화
  const decryptData = JSON.parse(decrypt(data));

  // DB 저장
  MongoClient.connect((err, client) => {
    const collection = client.db('sos').collection('userInOutHistory');

    collection.insertOne(
      { ...decryptData, org: "박물관", in: new Date() },
      { forceServerObjectId: true },
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('attend', { name: decryptData.name });
        client.close();
      }
    );
  });
});

// 출입자 데이터
router.get('/history', (req, res) => {
  MongoClient.connect(async (err, client) => {
    const collection = client.db('sos').collection('userInOutHistory');
    // console.log(collection);
    const result = await collection.find();
    console.log(result);
    res.render('userList', { userList: result });
  });
});

module.exports = router;