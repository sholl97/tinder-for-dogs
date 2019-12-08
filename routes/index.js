var express = require('express');
var router = express.Router();
var path = require('path');
var config = require('../db-config.js');

//express sessions
var cookieParser = require('cookie-parser');
var session = require('express-session');
router.use(cookieParser());
router.use(session({secret: 'max'}));


/* ----- Connects to your mySQL database ----- */

var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);




/* ------------------------------------------- */
/* ----- Routers to handle FILE requests ----- */
/* ------------------------------------------- */

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));

});

router.get('/tinder', function(req, res) {
  console.log("tinder start");

  if(req.session.page_views){
      req.session.page_views++;
      console.log("You visited this page " + req.session.page_views + " times");
   } else {
      req.session.page_views = 1;
      console.log("Welcome to this page for the first time!");
  }
  res.sendFile(path.join(__dirname, '../', 'views', 'tinder.html'));
});

// router.get('/final', function(req, res) {
//   res.sendFile(path.join(__dirname, '../', 'views', 'final.html'));
// });

/* Template for a FILE request router:

Specifies that when the app recieves a GET request at <PATH>,
it should respond by sending file <MY_FILE>

router.get('<PATH>', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', '<MY_FILE>'));
});

*/


/* ------------------------------------------------ */
/* ----- Routers to handle data requests ----- */
/* ------------------------------------------------ */

/* ----- Q1 (Dashboard) ----- */
router.get('/dogs', function(req, res) {
  var query = `SELECT s.photo
    FROM stanford s
    ORDER BY RAND()
    LIMIT 12;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


router.get('/:tinder', function(req, res) {
  console.log("start of tinder");

  var query = 
    `SELECT sb.id, sb.breed, s.photo
    FROM stanford s
    JOIN stanford_breeds sb ON s.breed = sb.breed
    ORDER BY RAND()
    LIMIT 1;`;

  console.log("hello router");
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

//router for storing good dog
router.get('/tinder/good/:dog', function (req, res) {
  var inputBreed = req.params.dog;
  console.log("beginning ", req.session.goodDogs);

  if(req.session.goodDogs){
      req.session.goodDogs.push(inputBreed);
      console.log("Updated good list: " + req.session.goodDogs);
      console.log("Updated bad list: " + req.session.badDogs);
   } else {
      req.session.goodDogs = [];
      req.session.goodDogs.push(inputBreed);
      console.log("Initialized good for the first time: " + req.session.goodDogs);
  }
  if(req.session.goodDogs.length > 9 || req.session.goodDogs.length + req.session.badDogs.length > 9){
    console.log("Hey look ma we made it");
    res.json(true);
  }
  console.log("end ", req.session.goodDogs);

  req.session.goodDogs.add(inputBreed);
  console.log("GOBBLDEGOOK");
  //console.log("You're a bad dog: ", req.session.dog_seen);

  //TODO: redirect when 10 swipes are hit

});

//router for storing bad dog
router.get('/tinder/bad/:dog', function (req, res) {
  var inputBreed = req.params.dog;
  console.log("beginning ", req.session.badDogs);

  if(req.session.badDogs){
      req.session.badDogs.push(inputBreed);
      console.log("Updated good list: " + req.session.goodDogs);
      console.log("Updated bad list: " + req.session.badDogs);
   } else {
      req.session.badDogs = [];
      req.session.badDogs.push(inputBreed);
      console.log("Initialized bad for the first time: " + req.session.badDogs);
  }
  
  //redirect when 10 swipes are hit
  if(req.session.badDogs.length > 9 || req.session.goodDogs.length + req.session.badDogs.length > 9) {
    console.log("Hey look ma we made it");
    res.json(true);

    // $http({
    //   url: '/',
    //   method: 'GET'
    // }).then(res => {
    //   console.log("redirect attempt");

    // }, err => {
    //   console.log("Redirect err", err);
    // });
  }
  console.log("end ", req.session.badDogs);

  req.session.badDogs.add(inputBreed);
  console.log("GOBBLDEGOOK");
  //console.log("You're a bad dog: ", req.session.dog_seen);
});
module.exports = router;
