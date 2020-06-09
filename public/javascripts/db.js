
const mongoose = require('mongoose');

const user = mongoose.Schema({
    name : 'string',
    phone : 'string',
    temperature : 'string'
});
const userSet = mongoose.model('users', user);

const getUserList = async () => {
    let userdata = {
        result : 'fail',
        code : 500,
        size : 0,
        data : []
    };
    await userSet.find( function(error, userList){
        console.log('--- Read all ---');
        if(error){
            console.log(error);
        }else{
            //console.log(userList);
            userdata.result = 'success'
            userdata.size = userList.length
            userdata.code = 200
            userdata.data = userList;
            //resolve(test);
            //return userdata;
        }
    })
    return userdata;
}

const saveUser = (userInfo) => {
    //const newUserSet = new userSet({name:'Hong Gil Dong', phone:'010-4576-5744', temperature:'37.7'});
    //console.log("!!   "+userInfo);
    const newUserSet = new userSet(JSON.parse(userInfo));
    //console.log(JSON.parse(userInfo));
    newUserSet.save(function(error, data){
      if(error){
          console.log(error);
      }else{
          console.log('Saved!')
      }
    });
}
const getUser = (userName) => {
    userSet.findOne({name:userName}, function(error,student){
        console.log('--- Read one ---');
        if(error){
            console.log(error);
        }else{
            console.log(student);
        }
    });
}

/* 
    ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
      어떤 과정을 반복적으로 수행 하여도 결과가 동일하다. 삭제한 데이터를 다시 삭제하더라도, 존재하지 않는 데이터를 제거요청 하더라도 오류가 아니기 때문에
      이부분에 대한 처리는 필요없다. 그냥 삭제 된것으로 처리
*/
const removeUser = (id) => {
    userSet.remove({_id:id}, function(error,output){
        console.log('--- Delete ---');
        if(error){
            console.log(error);
        }
        console.log('--- deleted ---');
    });
}

module.exports.saveUser = saveUser;
module.exports.getUserList = getUserList;
module.exports.getUser = getUser;
module.exports.removeUser = removeUser;
