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
    })

    request.success(function(response) {
      // success
      console.log(response);
      if (response.result === "success") {
        // After you've written the INSERT query in routes/index.js, uncomment the following line
        window.location.href = "http://localhost:8081/dashboard"
      }
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };
});

app.controller('usersController', function($scope, $http) {
  // Angular variable
  // To check in the console if the variables are correctly storing the input:
  // console.log($scope.username, $scope.password);

  var request = $http({
    url: '/fillUserTable',
    method: "POST",
  })

  request.success(function(response) {
    // success
    console.log(response);
    if (response.result === "success") {
      // After you've written the INSERT query in routes/index.js, uncomment the following line
      $scope.users = response.names;
    }
  });
  request.error(function(err) {
    // failed
    console.log("error: ", err);
  });
});

app.controller('recoController', function($scope, $http) {

  $scope.search = function() {
    var id = $scope.movie;

    if (id != null) {
      $scope.recos = [];
      $scope.searchMovie = "Searching for ID: " + id;
      var request = $http({
        url: '/recommendations',
        method: "POST",
        data: {
          'movie_id': $scope.movie
        }
      });

      request.success(function(response) {
        // success
        console.log(response);
        if (response.result === "success") {
          $scope.recos = response.movies;
        }
      });
      request.error(function(err) {
        // failed
        console.log("error: ", err);
      });
    }

  };
});

app.controller('genreController', function($scope, $http) {
  $scope.status = "Pleae select a genre"
  var request = $http({
    url: '/fillMovieTable',
    method: "POST",
  })

  request.success(function(response) {
    // success
    console.log(response);
    if (response.result === "success") {
      $scope.genres = response.genres;
    }
  });
  request.error(function(err) {
    // failed
    console.log("error: ", err);
  });

  $scope.showGenre = function(genre) {
    $scope.status = genre
    $scope.movies = [];
    var request = $http({
        url: '/getTopMovies',
        method: "POST",
        data: {
          'genre': genre
        }
    })

    request.success(function(response) {
      // success
      console.log(response);
      if (response.result === "success") {
        $scope.movies = response.movies;
      }
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });

  };
});


app.controller('bestofController', function($scope, $http) {
  $scope.Years = [];
  $scope.year = 2000;
  $scope.searchfor = "Please select a year and submit"
  for (yr = 2000; yr <= 2017; yr++) {
    $scope.Years.push(yr);
  }

  $scope.searchYear = function(year) {
    $scope.mostVoted = [];
    $scope.searchfor = "Selected year: " + year;
    var request = $http({
        url: '/bestof',
        method: "POST",
        data: {
          'year': year
        }
    })

    request.success(function(response) {
      // success
      console.log(response);
      if (response.result === "success") {
        $scope.mostVoted = response.movies;
      }
    });
    request.error(function(err) {
      // failed
      console.log("error: ", err);
    });
  };
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
