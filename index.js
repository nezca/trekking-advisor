//------------ npm express setting --------------
var express = require('express');
var app = express();
var multer = require('multer');
app.use(express.static('public'));
var bootstrap = require("express-bootstrap-service");
var bodyPaser = require('body-parser');

//------------ local server port setting ---------
app.set('port', (process.env.PORT || 5000));

//----------- pug(former 'jade') setting -----------
app.set('view engine','pug');
app.set('views', './views');
app.use(bootstrap.serve);
app.use(bodyPaser.urlencoded({extended:false}));

//--------- ClearDB(mysql) Setting -------------------
var mysql      = require('mysql');
var db_config = {
  host     : 'us-cdbr-iron-east-03.cleardb.net', 
  user     : 'b52b1fabc5d89f',
  password : '3fda8c47',
  database : 'heroku_e54ff6534eba235'
};
var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config);
  connection.connect(function(err) {              
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }                                     
  });                                     
                                          
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();                         
    } else {
      throw err;                                  
    }
  });
}


handleDisconnect();

//------------ Pages Routing -------------------------
  //------------ main(search) page -------------------------
app.get('/', function(req,res){
  res.render('intro');
});

  //------------ sub(about) page -------------------------
app.get('/about_us', function(req,res){
  res.render('about_us');
});
  //------------ 결과 페이지 난이도 조건만 넣음 ---------------

app.post('/return', function(req,res){
  var country_code = req.body.country_code;
  var province_code = req.body.province_code;
  var course_type_code = req.body.course_type_code;
  var difficulty_type_code = req.body.difficulty_type_code;
  var budget = req.body.budget;
  var sql = 'SELECT * FROM course_table WHERE country_code = ? and province_code = ? and course_type_code = ? and difficulty_type_code <= ? and budget <= ?';
  connection.query(sql, [country_code, province_code, course_type_code, difficulty_type_code, budget], function(err, gilhub, fields){
    if(err){
      console.log(err);
      res.status(500).send('what the hell!');
      }
    res.render('return',{gilhub:gilhub});   
  });
});     


//----- node.js tutorial's app.listen method -----
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});