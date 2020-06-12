const express = require('express');
const router = express.Router();
const { iv } = require('/config.json');
const { decrypt } = require('javascripts/utils');

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

// 출입
router.get("/attend", function (req, res) {
  const qr = req.query.qr;

  // 복호화 데이터 생성
  const data = { iv: iv, encryptedData: qr };

  // 복호화
  const result = JSON.parse(decrypt(data));

  res.render("attend", { result: result.name });
});

module.exports = router;