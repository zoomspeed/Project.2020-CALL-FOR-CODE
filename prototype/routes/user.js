const express = require('express');
const router = express.Router();
const user = require('data/user.json');

// 사용자 데이터 불러올 때 index 계산
let idx = 0;

router.get('/', function(req, res) {
  res.send('respond with a resource');
});

// QR 생성
router.get('/QR', (req, res) => {
  // 체온 랜덤 생성
  const temperature = Math.random() * (39 - 35.7) + 35.7;
  const data = user[idx]; 
  data.temperature = temperature.toFixed(1);
  
  const result = encrypt(JSON.stringify(data)).encryptedData; // 암호화
  const url = "https://sos.mybluemix.net/attend?qr=" + result; // 스캔 시 전송할 url 만들기

  QR.toDataURL(url, { errorCorrectionLevel: "L" }, function (err, code) {
    res.render("scan", { title: "VISITOR", qr: code });
  });
});

module.exports = router;
