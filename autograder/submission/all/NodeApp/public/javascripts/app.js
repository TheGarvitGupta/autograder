var app = angular.module('angularjsNodejsTutorial', []);

app.controller('loginController', function($scope, $http) {
  $scope.verifyLogin = function() {
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);

    var request = $http({
      url: '/login',
      method: "POST",
      data: {
        'username': $scope.username,
        'password': $scope.password
      }
    });

    request.success(function(response) {
      // success
      console.log(response);
      if (response.result === "success") {
        // After you've written the INSERT query in routes/index.js, uncomment the following line
        window.location.href = "http://localhost:8081/dashboard";
      }
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  };
});

app.controller('dashBoardController', function($scope, $http) {

  $scope.verifyUser = function() {
    // To check in the console if the variables are correctly storing the input:
    // console.log($scope.username, $scope.password);

    // getting users
    var request = $http({
      url: '/user',
      method: "GET"
    });

    request.success(function(response) {
      // success
      console.log(response);
      $scope.usernames = response;

    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };

  // getting genres
  $scope.verifyGenre = function() {
    var request = $http({
      url: '/genre',
      method: "GET"
    });
    request.success(function(response) {
      // success
      console.log(response);
      $scope.movieGenres = response;
    
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };

  // getting top movies
  $scope.getTopMovies = function(genreIn) {
    var request = $http.get('/topMovies/'+ genreIn);
    request.success(function(response) {
      // success
      console.log(response);
      $scope.topMovies = response;
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  };

  $scope.verifyUser();
  $scope.verifyGenre();

});


app.controller('bestOfController', function($scope, $http) {

      // getting top movies for each year
  $scope.years = ["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011"];
  $scope.bestList = function() {
    var request = $http.get('/bestOf/'+ $scope.yearIn);
    request.success(function(response) {
      // success
      console.log(response);
      $scope.yearMovies = response;
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  };

});


app.controller('recommendController', function($scope, $http) {
   // recommend movies
  $scope.recommendMovies = function() {
    var request = $http.get('/recommendMovies/'+ $scope.movieId);
    request.success(function(response) {
      // success
      console.log(response);
      var genSet = response;
      var genSize = genSet.length;
      var genList = [];
      for (i = 0; i < genSize; i++){
        genList.push(genSet[i].genre);
      }
      var recMoviesLst = [];
      var count = 10;
      // loop throught the gen sets
      var iter = 0;
      for (j = 0; j < 10; j++){
        var request2Mov = $http.get('/recommendMoviesFor/'+ genList[iter]);
        request2Mov.success(function(response2) {
            console.log(response2[0].title)
            console.log(genList[iter])
            recMoviesLst.push({title: response2[0].title, genre: genList[iter]})
            iter = iter + 1;
            //reset iterator
            if (iter == genSize) {
              iter = 0;
            } 
        });
        request2Mov.error(function(err) {
          console.log("error: ",err);
        });
      }
      $scope.recMovies = recMoviesLst;
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  };
});

app.controller('postersController', function($scope, $http) {
  // getting top movies for each year
  var request = $http({
      url: '/posterMovies',
      method: "GET"
    });
  $scope.posterlists = function() {
    request.success(function(response) {
      // success
      console.log(response)
      var postMoviesLst = [];
      for (i = 0; i < response.length; i++){
        var imdbId = response[i].imdb_id;
        console.log(response[i].imdb_id)
        var requestPost = $http.get("http://www.omdbapi.com/?i="+ imdbId +"&apikey=a546188c");
        // making request
        requestPost.success(function(response2) {
            console.log(response2);
            var titleKey = response2.Title
            var posterKey = response2.Poster;
            var websiteKey = response2.Website;
            console.log(titleKey);
            console.log(posterKey);
            console.log(websiteKey);  
            postMoviesLst.push({title:titleKey, poster:posterKey, website:websiteKey});          
        });
        requestPost.error(function(err) {
          console.log("error: ",err);
        });
      }
      $scope.postMovies = postMoviesLst;
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  };
  $scope.posterlists();
});


// Template for adding a controller
/*
app.controller('dummyController', function($scope, $http) {
  // normal variables
  var dummyVar1 = 'abc';

  // Angular scope variables
  $scope.dummyVar2 = 'abc';

  // Angular function
  $scope.dummyFunction = function() {

  };
});
*/
