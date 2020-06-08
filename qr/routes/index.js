const express = require('express');
const router = express.Router();
const QR = require('qrcode');
const crypto = require('crypto');
const { algorithm, key, iv } = require('../config.json');

/* GET home page. */
router.get('/', function(req, res) {
  // 체온 랜덤 생성
  const temperature = Math.random() * (39 - 35.7) + 35.7;
  
  // QR 데이터 생성
  const data = {
    name: "박찬형",
    phone: "010-1234-5678",
    temperature: temperature.toFixed(1),
  }

  // 암호화
  const result = encrypt(JSON.stringify(data)).encryptedData;

  // 스캔 시 전송할 url 만들기
  const url = "fetch3.ddns.net:3000/QR?qr=" + result;

  // QR코드 생성
  QR.toDataURL(url, { errorCorrectionLevel: 'L' }, function (err, code) {
    res.render('index', { title: 'Express', qr: code });
  });
});

// QR 데이터 확인
router.get('/attend', function(req, res) {
  const qr = req.query.qr;

  // 복호화 데이터 생성
  const data = { iv: iv, encryptedData: qr }

  // 복호화
  const result = decrypt(data);

  res.render('qr', { result: result });
});

function encrypt(text) {//Buffer.from(key)
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

 function decrypt(text) {
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

module.exports = router;
