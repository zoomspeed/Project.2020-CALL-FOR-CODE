const express = require("express");
const router = express.Router();
const QR = require("qrcode");
const user = require("../public/data/user.json");
const { encrypt } = require("../public/javascripts/utils");

// 사용자 데이터 불러올 때 index
let idx = 0;

// QR 생성
router.get("/QR", (req, res) => {
  // 체온 랜덤 생성
  const temperature = Math.random() * (39 - 35.7) + 35.7;

  // index로 user 데이터 가져오기
  const data = user[idx];
  idx++;
  if (idx >= data.length) {
    idx = 0;
  }

  // 암호화
  const result = encrypt(JSON.stringify(data)).encryptedData;

  // 스캔 시 전송할 url
  const url = "https://sos.mybluemix.net/org/attend?qr=" + result;

  // QR 생성
  QR.toDataURL(url, { errorCorrectionLevel: "L" }, function (err, code) {
    res.render("scan", { title: "VISITOR", qr: code });
  });
});

// Map
router.get("/map", (req, res) => {
  const query = req.query.qry;
  const context = {
    query: query,
    API_KEY: process.env.API_KEY,
  };

  res.render("map", context, function (err, html) {
    res.end(html);
  });
});

module.exports = router;
