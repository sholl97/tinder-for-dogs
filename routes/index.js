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

/* ----- Q2 (Recommendations) ----- */
router.get('/recommendations', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'recommendations.html'));
});

/* ----- Q3 (Best Of Decades) ----- */
router.get('/bestof', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'bestof.html'));
});

/* ----- Bonus (Posters) ----- */
router.get('/posters', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'posters.html'));
});

router.get('/reference', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

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
    LIMIT 6;`;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

router.get('/genres/:genre', function (req, res) {
  var inputGenre = req.params.genre;
  var query = `;`

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
  console.log("good: ", req.session.goodDogs);
  console.log("bad: ", req.session.badDogs);
  var query = '';

  if(req.session.goodDogs) {
    console.log("we have goodDogs: ", req.session.goodDogs);
    


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
    query =
      `SELECT s.photo, sb.id, sb.breed
    FROM stanford s
    JOIN stanford_breeds sb ON s.breed = sb.breed
    JOIN akc ON akc.id = sb.id
    JOIN aspca_breeds ab ON ab.id = akc.id
    ORDER BY RAND()
    LIMIT 1;`;
  }
  console.log("hello router");
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });

    /*
  console.log("start of tinder");

  var query = `SELECT *
    FROM (SELECT s.photo, sd.breed_1, sd.breed_2, sd.color_1, sd.color_2,
    (akc.height_low + akc.height_high)/2 AS avg_height, (akc.weight_low + akc.weight_high)/2 AS avg_weight
    FROM stanford s
    JOIN stanford_breeds sb ON s.breed = sb.breed
    JOIN akc on akc.id = sb.id
    JOIN aspca_breeds ab ON ab.id = sb.id
    JOIN shelter_dogs sd ON ab.breed_name = sd.breed
    ORDER BY RAND()) AS T
    LIMIT 1;`;
*/
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





/* ----- Q2 (Recommendations) ----- */

/*router.get('/recommendations/:movie', function (req, res) {
  var inputMovie = req.params.movie;
  // TODO: Part (2) - Edit query below
  var query = `WITH all_gen as (SELECT genre
FROM Genres
where movie_id =(SELECT id from Movies where title='${inputMovie}'))
SELECT title, id, rating, vote_count FROM Movies
LEFT JOIN Genres ON id=movie_id
LEFT JOIN all_gen ON Genres.genre = all_gen.genre
WHERE title <> '${inputMovie}'
GROUP BY title, id, rating, vote_count
HAVING COUNT(all_gen.genre) >= ALL (SELECT COUNT(genre) FROM all_gen)
ORDER BY rating DESC, vote_count DESC
LIMIT 5;`;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


----- Q3 (Best Of Decades) -----

router.get('/decades', function(req, res) {
  var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) y
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

router.get('/bestOf/:decade', function (req, res) {
  var inputDecade = req.params.decade;
  // TODO: Part (2) - Edit query below
  var query = `WITH best as (SELECT genre, max(vote_count) as voters
FROM Movies
JOIN Genres
ON movie_id = id
WHERE release_year >= ${inputDecade} AND release_year < ${inputDecade} + 10
GROUP BY genre)
SELECT best.genre, title, vote_count, release_year
FROM Movies
JOIN Genres
ON movie_id = id
RIGHT JOIN best
ON best.genre = Genres.genre AND voters = vote_count
WHERE release_year >= ${inputDecade} AND release_year < ${inputDecade} + 10
GROUP BY genre
ORDER BY genre;`;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


/* ----- Bonus (Posters) -----
router.get('/get/posters', function(req, res) {

  var year = req.params.year; // year parameter from url
  var query = 'SELECT * from Movies ORDER BY RAND() LIMIT 12';

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
});

*/

/* General Template for GET requests:

router.get('/routeName/:customParameter', function(req, res) {
  // Parses the customParameter from the path, and assigns it to variable myData
  var myData = req.params.customParameter;
  var query = '';
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      // Returns the result of the query (rows) in JSON as the response
      res.json(rows);
    }
  });
});
*/
module.exports = router;
