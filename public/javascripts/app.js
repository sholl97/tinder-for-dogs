var app = angular.module('angularjsNodejsTutorial', []);

// Controller for the Dashboard page
app.controller('dashboardController', function($scope, $http) {
  $scope.genres = {};
  $scope.movies = {};

  $http({
    url: '/genres',
    method: 'GET'
  }).then(res => {
    console.log("Genres: ", res.data);
    $scope.genres = res.data;
  }, err => {
    console.log("Genres ERROR: ", err);
  });

  // get the top rated, voted movies when a genre is clicked
  $scope.showMovies = function(genre) {
    var url = '/movies/' + genre.genre;
    $http({
      url: url,
      method: 'GET'
    }).then(res => {
      console.log(res.data);
      $scope.movies = res.data;
    }, err => {
      console.log("Movies ERROR: ", err);
    });
  };
});

/*/ Controller for the Recommendations Page
app.controller('recommendationsController', function($scope, $http) {

  $scope.submitIds = function () {
    $http({
        url: '/recommend/' + $scope.movieName,
        method: 'GET'
    }).then(res => {
        console.log(res.data);
        $scope.recommendedMovies = res.data;
    }).catch(err => {
        console.log("Error: ", err);
    });
  }
});

// Controller for the Best Of Page
app.controller('bestofController', function($scope, $http) {

  $http({
    url: '/decades',
    method: 'GET'
  }).then(res => {
    console.log("Year: ", res.data);
    $scope.decades = res.data;
  }, err => {
    console.log("Year ERROR: ", err);
  });

  $scope.bestofMovies = '';
  $scope.selectedDecade = '';

  $scope.submitDecade = function() {
    var url = '/bestof/' + $scope.selectedDecade.decade;
    if ($scope.selectedYear !== "") {
      $http({
        url: url,
        method: 'GET'
      }).then(res => {
        console.log(res.data);
        $scope.bestofMovies = res.data;
      }, err => {
        console.log("Movies ERROR: ", err);
      });
    }
  };
});

app.controller('postersController', function($scope, $http) {
  let url = '/get/posters';

  $http({
    url: url,
    method: 'GET'
  }).then(res => {
    const movies = res.data;
    console.log(movies);
    getPosterData(movies);
  });

  const getPosterData = (movies) => {
    $scope.posterMovies = [];
    $scope.showDetails = [];

    movies.forEach((movie, id) => {
      let omdbUrl = 'http://www.omdbapi.com/?i=' + movie.imdb_id + '&apikey=3804c0cd';

      $http({
        url: omdbUrl,
        method: 'GET'
      }).then(res => {
        const moviesOmdb = res.data;
        const data = {};
        data['id'] = id;
        data['posterLink'] = moviesOmdb.Poster;
        data['title'] = moviesOmdb.Title;
        data['hasWebsite'] = moviesOmdb.Website === 'N/A' ? false : true;
        data['websiteLink'] = moviesOmdb.Website;
        data['rated'] = moviesOmdb.Rated;
        data['boxOffice'] = moviesOmdb.BoxOffice;
        data['plot'] = moviesOmdb.Plot;
        data['runtime'] = moviesOmdb.Runtime;
        $scope.posterMovies.push(data);
        $scope.showDetails.push(false);
        console.log(data);
      });
    })
  } */

  $scope.hoverIn = (id) => {
    console.log("hoverIn");
    $scope.showDetails[id] = true;
  }

  $scope.hoverOut = (id) => {
    console.log("hoverOut");
    $scope.showDetails[id] = false;
  }
});
