var express = require('express');
var router = express.Router();
var path = require('path');
var config = require('../db-config.js');

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


/* ----- Bonus (Posters) ----- */



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
