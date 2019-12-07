var app = angular.module('angularjsNodejsTutorial', []);

// Controller for the Dashboard page
app.controller('dashboardController', function($scope, $http) {
  $scope.dogs = {};
  $scope.movies = {};

  $http({
    url: '/dogs',
    method: 'GET'
  }).then(res => {
    console.log("Dogs: ", res.data);
    const dogs = res.data;
    console.log(dogs);
    getPicData(dogs);
  }, err => {
    console.log("Dogs ERROR: ", err);
  });

  // get the top rated, voted movies when a genre is clicked
  const getPicData = (dogs) => {
    $scope.dogs = [];

    dogs.forEach((dogs) => {
      $http({
        url: '/dogs',
        method: 'GET'
      }).then(res => {
        const photos = res.data;
        const data = {};
        data['photo'] = 'https://www.seas.upenn.edu/~hosa/cis550/' + dogs.photo;
        $scope.dogs.push(data);
        console.log(data);
      });
    })
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

//   $scope.hoverIn = (id) => {
//     console.log("hoverIn");
//     $scope.showDetails[id] = true;
//   }

//   $scope.hoverOut = (id) => {
//     console.log("hoverOut");
//     $scope.showDetails[id] = false;
//   }
// });
