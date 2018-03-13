const mysql = require('mysql');

let state = {
    pool: null
};

exports.connect = function(done){
  state.pool = mysql.createPool({
      host: 'mysql3.csse.canterbury.ac.nz',
      user: 'tke29',
      password: '98112573',
      database: 'tke29'
  });
  done();
};

exports.get_pool = function(){
    return state.pool;
};