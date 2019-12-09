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


router.get('/final', function(req, res) {
  console.log("we request the FINAL");
  res.sendFile(path.join(__dirname, '../', 'views', 'final.html'));
});


/* ----- guesser ----- */
router.get('/guesser', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'guesser.html'));
});

/* ----- Bonus (Posters) ----- */
router.get('/posters', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'posters.html'));
});

router.get('/reference', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});



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


router.get('/tinder/:tinder', function(req, res) {
  console.log("START OF TINDER");
  console.log("good: ", req.session.goodDogs);
  console.log("bad: ", req.session.badDogs);
  var query = '';

  console.log("DEBUG\n\n");
  ran = Math.random() * 10;
  if(req.session.goodDogs){
    len = req.session.goodDogs.length;
  }
  else{
    len = 0
  }
  console.log(ran);
  console.log(len);
  if(req.session.goodDogs && ran <= len) {
    console.log("we have goodDogs: ", req.session.goodDogs);
    console.log("size: ", len);


    query = `SELECT * FROM
    (SELECT DISTINCT akc.id, (akc.weight_low + akc.weight_high)/2 AS weight_average
      FROM akc JOIN stanford_breeds sb
      ON akc.id = sb.id
      JOIN stanford s
      ON sb.breed = s.breed
      WHERE sb.id IN (${req.session.goodDogs.join()})
    ) t1
    JOIN (
    SELECT s.photo, sb.id, sb.breed, (akc.weight_low + akc.weight_high)/2 AS weight_average
      FROM stanford s
      JOIN stanford_breeds sb ON s.breed = sb.breed
      JOIN akc ON akc.id = sb.id
    ) t2
    WHERE t1.weight_average BETWEEN t2.weight_average-5 AND t2.weight_average+5
    ORDER BY RAND()
    LIMIT 1;`;


    //console.log("scary query: ", query);
    
/*
    //CTE: for each breed liked, what is the average weight
    query += `WITH breeds_liked AS (
                SELECT (akc.weight_low + akc.weight_high)/2 AS weight_average
                FROM akc
                JOIN stanford_breeds sb ON akc.id = sb.id
                JOIN stanford s ON sb.breed = s.breed
                WHERE s.breed IN ${req.sessions.goodDogs.join(',')}
              )`

    //base query
    query += `SELECT sb.id, sb.breed, s.photo
              FROM stanford s
              JOIN stanford_breeds sb ON s.breed = sb.breed
              JOIN akc ON akc.id = sb.id
              WHERE True`;

    //where statements for good dogs
    req.sessions.goodDogs.forEach(myFunction);
    function myFunction(item) {
      if(Math.random() < 0.8) {

        query += `AND (akc.weight_low + akc.weight_high)/2 >= ALL(
                    SELECT (akc2.weight_low + akc2.weight_high)/2 AS average_weight
                    FROM akc akc2
                    WHERE akc2.id = sb.id)  `
      }
    }*/

    //where statements for bad dogs
    //append where statement to the query
    //list of breeds. for each thing in that breed, add a where statement

  } else {
    console.log("RANDOM GENERATIONNNNN")
    query =
      `SELECT s.photo, sb.id, ab.breed_name AS breed
    FROM stanford s
    JOIN stanford_breeds sb ON s.breed = sb.breed
    JOIN akc ON akc.id = sb.id
    JOIN aspca_breeds ab ON ab.id = akc.id
    ORDER BY RAND()
    LIMIT 1;`;
  }
  console.log("hello router");
  console.log(query);
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


router.get('/guesser/:guesser', function (req, res) {
  var query = `SELECT DISTINCT color_1 as color FROM shelter_dogs ORDER BY color`
//   var inputDecade = req.params.decade;
//   // TODO: Part (2) - Edit query below
//   var query = `WITH best as (SELECT genre, max(vote_count) as voters
// FROM Movies
// JOIN Genres
// ON movie_id = id
// WHERE release_year >= ${inputDecade} AND release_year < ${inputDecade} + 10
// GROUP BY genre)
// SELECT best.genre, title, vote_count, release_year
// FROM Movies
// JOIN Genres
// ON movie_id = id
// RIGHT JOIN best
// ON best.genre = Genres.genre AND voters = vote_count
// WHERE release_year >= ${inputDecade} AND release_year < ${inputDecade} + 10
// GROUP BY genre
// ORDER BY genre;`;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


router.get('/guesser/:color/:weight/:height', function (req, res) {
  var query = `SELECT DISTINCT ab.breed_name AS breed
    FROM stanford s
    JOIN stanford_breeds sb ON s.breed = sb.breed
    JOIN akc ON akc.id = sb.id
    JOIN aspca_breeds ab ON ab.id = akc.id
    JOIN breed_freq bf ON bf.breed_id = akc.id
 WHERE akc.height_low < ${req.params.height} + 10 AND akc.height_high > ${req.params.height} - 10
 AND akc.weight_low < ${req.params.weight} + 10 AND akc.weight_low > ${req.params.weight} - 10
 AND bf.color = '${req.params.color}';`
 console.log(query);
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

router.get('/final/:final', function(req, res) {
  console.log('HELLO DARKNESS MY OLD FRIEND\n\n');
  var query = `SELECT pet_id, name, sd.breed, breed_id, color, sd.sex, sd.age FROM (SELECT * FROM (SELECT * FROM (SELECT breed_id FROM breed_freq
WHERE(weight_avg - (SELECT AVG(weight_avg) FROM (SELECT weight_avg FROM breed_freq
WHERE breed_id IN (${req.session.goodDogs.join()}))b) <= 10 AND
weight_avg - (SELECT AVG(weight_avg) FROM (SELECT weight_avg FROM breed_freq
WHERE breed_id IN (${req.session.goodDogs.join()}))b) >= -10))weighted_breeds_good
WHERE breed_id NOT IN
(SELECT breed_id FROM breed_freq
WHERE(weight_avg - (SELECT AVG(weight_avg) FROM (SELECT weight_avg FROM breed_freq
WHERE breed_id IN (${req.session.badDogs.join()}))b) <= 5 AND
weight_avg - (SELECT AVG(weight_avg) FROM (SELECT weight_avg FROM breed_freq
WHERE breed_id IN (${req.session.badDogs.join()}))b) >= -5)))a
NATURAL JOIN sd_final
WHERE color_1 NOT IN (SELECT color FROM(
SELECT bc.color, (bc.count  - IFNULL(gc.count,0)) AS final_count FROM
(SELECT COUNT(*) AS count, color FROM breed_freq
WHERE breed_id IN (${req.session.badDogs.join()}) GROUP BY color)bc LEFT JOIN
(SELECT COUNT(*) AS count, color FROM breed_freq
WHERE breed_id IN (${req.session.goodDogs.join()}) GROUP BY color)gc
ON bc.color = gc.color)tmp
WHERE final_count > 0)
AND color_2 NOT IN (SELECT color FROM(
SELECT bc.color, (bc.count  - IFNULL(gc.count,0)) AS final_count FROM
(SELECT COUNT(*) AS count, color FROM breed_freq
WHERE breed_id IN (${req.session.badDogs.join()}) GROUP BY color)bc LEFT JOIN
(SELECT COUNT(*) AS count, color FROM breed_freq
WHERE breed_id IN (${req.session.goodDogs.join()}) GROUP BY color)gc
ON bc.color = gc.color)tmp
WHERE final_count > 0)
ORDER BY RAND()
LIMIT 1)final JOIN shelter_dogs sd ON final.pet_id = sd.id;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

router.get('/final/final/:breed_id', function(req, res) {
  console.log("getting the PHOTOS");
  var query = `SELECT s.photo
  FROM stanford s
  JOIN stanford_breeds sb ON s.breed = sb.breed
  WHERE sb.id = ${req.params.breed_id}
  LIMIT 24;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});



module.exports = router;
