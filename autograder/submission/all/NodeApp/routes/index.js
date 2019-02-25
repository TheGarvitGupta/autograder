var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'fling.seas.upenn.edu',
  user: 'mingcao',
  password: 'Ming3847097!',
  database: 'mingcao'
});

connection.connect(function(err) {
  if (err) {
    console.log("Error Connection to DB" + err);
    return;
  }
  console.log("Connection established...");
});

/* GET home page. */
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'login.html'));
});

router.get('/dashboard', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'dashboard.html'));
});

router.get('/reference', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

router.get('/recommend', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'recommend.html'));
});

router.get('/bestOf', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'bestOf.html'));
});

router.get('/posters', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'posters.html'));
});

// To add a new page, use the templete below
/*
router.get('/routeName', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'fileName.html'));
});
*/

// Login uses POST request
router.post('/login', function(req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username
  var username = req.body.username;
  var password = req.body.password;
  var query = "INSERT IGNORE INTO test.User (username, password) VALUES ('" + username + "', '" + password + "');"; /* Write your query here and uncomment line 21 in javascripts/app.js*/
  connection.query(query, function(err, rows, fields) {
    console.log("rows", rows);
    console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success'
      });
    }
  });
});

// dashboard select users
router.get('/user', function(req, res) {

  var query = 'SELECT username FROM test.User;';

  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


// dashboard - get movie genres
router.get('/genre', function(req, res) {
  var query = 'SELECT DISTINCT genre FROM test.Genres;';
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


// dashboard get top movies for each genre
router.get('/topMovies/:genreIn', function(req, res) {
  var input  = req.params.genreIn;
  var query = "SELECT DISTINCT M.title, M.rating, M.vote_count FROM test.Genres G JOIN test.Movies M ON G.movie_id = M.id WHERE genre = '" + input + "' ORDER BY M.rating DESC, M.vote_count DESC LIMIT 0, 10;";
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


// dashboard get top movies for each genre
router.get('/bestOf/:yearIn', function(req, res) {
  var input  = req.params.yearIn;
  var query = "SELECT G2.genre, M2.title, M2.vote_count FROM test.Genres G2 JOIN test.Movies M2 ON G2.movie_id = M2.id WHERE M2.release_year = '"+ input +"' AND M2.vote_count = "+
            "(SELECT M1.vote_count FROM test.Genres G1 JOIN test.Movies M1 ON G1.movie_id = M1.id WHERE G1.genre = G2.genre " +  
              "AND M1.release_year = '" + input +"' ORDER BY M1.vote_count DESC LIMIT 0,1);";
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

// recommend genres
router.get('/recommendMovies/:movieId', function(req, res) {
  var input  = req.params.movieId;
  console.log(input)
  var query = "SELECT G.genre FROM test.Genres G JOIN test.Movies M ON G.movie_id = M.id WHERE movie_id = '"+ input +"';";
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


// recommend movies
router.get('/recommendMoviesFor/:genreId', function(req, res) {
  var input  = req.params.genreId;
  console.log(input)
  var query = "SELECT M.title FROM test.Genres G JOIN test.Movies M ON G.movie_id = M.id WHERE G.genre = '"+ input +"' ORDER BY RAND() LIMIT 0,1;";
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});

// movies posters 
router.get('/posterMovies', function(req, res) {
  var query = "SELECT M.imdb_id FROM test.Movies M ORDER BY RAND() LIMIT 0, 10;";
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });
});


// template for GET requests
/*
router.get('/routeName/:customParameter', function(req, res) {

  var myData = req.params.customParameter;    // if you have a custom parameter
  var query = '';

  // console.log(query);

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
});
*/

module.exports = router;
