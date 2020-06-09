var express = require('express');
var router = express.Router();
const util = require('../public/javascripts/util');
const connection = require('../public/javascripts/connection');
const db = require('../public/javascripts/db');
const mongoose = require('mongoose');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*
http://18.219.93.52:3000/attend?qr=510431583195b394abd3c3a5459978f0a52584894308e081eef3c5aa769fd28c2a40d65fe7b4e47e8f3d19386fd9a257881eed96d8ed86bce3358701d1c773f112de58096352c9de6c2b3c1acc864384
*/
router.use('/attend', function(req, res, next) {

  console.log('!!!@@@@@@@@@@@@  request body  ',req.query.qr)
  const decryptInfo = util.decrypt({ encryptedData :  req.query.qr});
  
  console.log('decryptInfo  :    '+decryptInfo );

  if(decryptInfo!==undefined && decryptInfo!=''){
    db.saveUser(decryptInfo);
    db.getUserList();
  }
  res.render('index', { title: decryptInfo});
});

router.use('/getUserList', async function(req, res, next) {

  const dbSelect = await db.getUserList();
  setTimeout(function(){
    return res.json(dbSelect);
  },1000);

});

router.use('/decryptTest', function(req,res,next){
  //res.render('qr', { title: 'Expr3ess' });
  
  const  test= {"name": "사람","phone": "010-1234-5678","temperature": "37.9"};
  //console.log(util.encrypt(test).encryptedData)
  
  res.render('index', { title: util.encrypt(test).encryptedData});
});

router.use('/createQR', function(req,res,next){
  const data = { title: 'ejs init', message: 'Hello World' };
  //res.render('qr', { title: 'Expr3ess' });
  res.render('qr.ejs', data);
});




//mongoose.connection.on('disconnected', connect);


module.exports = router;
/*
module.exports = () => {
  function connect() {
    mongoose.connect('ubuntu@ec2-18-219-93-52.us-east-2.compute.amazonaws.com:27017', function(err) {
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('mongodb connected');
    });
  }
  connect();
  mongoose.connection.on('disconnected', connect);
  //require('./user.js'); // user.js는 나중에 만듭니다.
};

*/