const express = require('express');
const router = express.Router();
const MongoClient = require("../database/connection");

router.get('/', function(req, res) {
  MongoClient.connect((err, client) => {
    const collection = client.db("sos").collection("userInOutHistory");
    query = {};
    if (err) throw err;
    collection.find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.render('admin/index', { userList: { data: result } });
    });
  });
});
  
module.exports = router;
  