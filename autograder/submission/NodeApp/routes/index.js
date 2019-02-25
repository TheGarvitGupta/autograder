var express = require('express');
var router = express.Router();
var path = require('path');

// Connect string to MySQL
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'fling.seas.upenn.edu',
  user: 'zhengr',
  password: 'R!ch1456978523',
  database: 'zhengr'
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

router.get('/bestof', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'bestof.html'));
});

router.get('/recommendations', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'recommendations.html'));
});

router.get('/reference', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'reference.html'));
});

// To add a new page, use the templete below
/*
router.get('/routeName', function(req, res) {
  res.sendFile(path.join(__dirname, '../', 'views', 'fileName.html'));
});
*/

router.post('/recommendations', function(req, res) {
  var id = req.body.movie_id;
  if (id != null) {
  var query1 = "SELECT DISTINCT genre " +
             "FROM Genres " + 
           "WHERE movie_id = " + id

    var query2 = "SELECT A.movie_id, A.genre " +
             "FROM Genres A, " + "(" + query1 + ") gen " + 
           "WHERE A.movie_id != " + id + " " + 
           "AND A.genre = gen.genre " + 
           "GROUP BY A.movie_id"
    
    var query3 = "SELECT M.title, Q2.genre " +
             "FROM Movies M, (" + query2 + ") Q2 " +
             "WHERE Q2.movie_id = M.id ORDER BY Q2.genre"
    
    //console.log(query1);
    connection.query(query1, function(err, genres, fields) {
      // console.log("genres", genres);
      // console.log("fields", fields);
      if (err) console.log('insert error: ', err); 

      else {
        //console.log(query3);
        connection.query(query3, function(err, rows, fields) {
          // console.log("rows", rows);
          // console.log("fields", fields);
          if (err) console.log('insert error: ', err); 

          else if (genres.length != 0 && rows.length != 0){
            var result = [];
            var genreArr = [];

            // loop through all genres
            for (i = 0; i < genres.length; i++) {
              var moviesArr = [];

              //categorize movies into each genre
              for (j = 0; j < rows.length; j++) {
                if (rows[j].genre == genres[i].genre) {
                  moviesArr.push(rows[j]);
                }
              }
              genreArr.push(moviesArr);
            }

            var counter = 0;
            //get first element from each genre array until there are 10 in result
            for (i = 0; i < 10; i++) {
              if (genreArr[counter].length != 0) {
                result[i] = genreArr[counter].pop();
              }
              counter++;
              if (counter == genres.length) counter = 0;
            }

            //console.log("sanity check: ");
            //console.log("ActualNumGenres: " + genres.length + " genreArrLength: " + genreArr.length);
            //console.log("numMovies in result: " + result.length);

            res.json({
              result: 'success',
              movies: result
            });
          }
        });
      }
    });
  }
  
});

router.post('/fillUserTable', function(req, res) {
  var query = "SELECT username FROM User";
  //console.log(query);
  connection.query(query, function(err, rows, fields) {
    //console.log("rows", rows);
    //console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success',
        names: rows
      });
    }
  });
});

router.post('/fillMovieTable', function(req, res) {
  var query = "SELECT DISTINCT genre FROM Genres";
  //console.log(query);
  connection.query(query, function(err, rows, fields) {
    //console.log("rows", rows);
    //console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success',
        genres: rows
      });
    }
  });
});


router.post('/bestof', function(req, res) {
  var year = req.body.year;
  var query = "SELECT genre, title, vote_count " +
              "FROM Genres, Movies " +
              "WHERE movie_id = id AND release_year = " + year + " " + 
              "ORDER BY vote_count DESC";
              
  
  //console.log(query);
  connection.query(query, function(err, rows, fields) {
    //console.log("rows", rows);
    //console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else if (rows.length != 0){
      var result = [];
      var seenGenres = []; //keep track of visited genres
      for (i = 0; i < rows.length; i++) {
        // only add genre to result if it is new
        if (!seenGenres.includes(rows[i].genre)) {
          result.push(rows[i]);
          seenGenres.push(rows[i].genre)
          //console.log(rows[i]);
        }
      }

      res.json({
        result: 'success',
        movies: result
      });
    }
  });
});


router.post('/getTopMovies', function(req, res) {
  var genre = req.body.genre;
  var query = "SELECT title, rating, vote_count " + 
  "FROM Movies, (" + "SELECT movie_id FROM Genres WHERE genre = '" + genre + "') mov " + 
  "Where Movies.id = mov.movie_id " +
  "ORDER BY rating DESC, vote_count DESC " +
  "LIMIT 10";
  
  //console.log(query);
  connection.query(query, function(err, rows, fields) {
    //console.log("rows", rows);
    //console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success',
        movies: rows
      });
    }
  });
});


// Login uses POST request
router.post('/login', function(req, res) {
  // use console.log() as print() in case you want to debug, example below:
  // console.log(req.body); will show the print result in your terminal

  // req.body contains the json data sent from the loginController
  // e.g. to get username, use req.body.username

  var query = "INSERT INTO User VALUES ('" + req.body.username + "', '" + req.body.password+ "')" 
  			+ "ON DUPLICATE KEY UPDATE password = '" + req.body.password + "';"; /* Write your query here and uncomment line 21 in javascripts/app.js*/
  connection.query(query, function(err, rows, fields) {
    //console.log("rows", rows);
    //console.log("fields", fields);
    if (err) console.log('insert error: ', err);
    else {
      res.json({
        result: 'success'
      });
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
