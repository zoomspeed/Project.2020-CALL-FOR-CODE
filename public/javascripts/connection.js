const mongoose = require('mongoose');
const config = require('../config/config.json')

function connect() {
    //mongoose.set('useNewUrlParser', true);    // 1
    //mongoose.set('useFindAndModify', false);  // 1
    //mongoose.set('useCreateIndex', true);     // 1
    //mongoose.set('useUnifiedTopology', true); // 1
    mongoose.connect(config.mongoip, {  user: config.mongouser, pass: config.mongopwd  },function(err) {
      if (err) {
        console.error('mongodb connection error', err);
      }
      console.log('mongodb connected');
      
    });
}
connect();