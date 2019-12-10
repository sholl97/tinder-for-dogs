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
    $scope.dogs = res.data;
  }, err => {
    console.log("Dogs ERROR: ", err);
  });
});

// Controller for the Tinder page
app.controller('tinderController', function($scope, $http) {
  //$scope.tinder = {};
  console.log("HELLO???");

  // if(res.data === true) {
  //   $http({
  //     url: '/final',
  //     method: 'GET'
  //   }).then(res => {
  //     console.log("Getting you your dog...");
  //   // $scope.tinder = res.data;
  //   }, err => {
  //     console.log("Getting you your dog ERROR: ", err);
  //   });
  // }

  //display dog photo and breed
  $http({
    url: '/tinder/:tinder',
    method: 'GET'
  }).then(res => {
    console.log("First Dog: ", res.data);
    $scope.tinder = res.data;
  }, err => {
    console.log("First Dog ERROR: ", err);
  });

  $scope.nextDog = function() {
    $http({
      url: '/tinder/:tinder',
      method: 'GET'
    }).then(res => {
      console.log("Next Dog: ", res.data);
      $scope.tinder = res.data;
    }, err => {
      console.log("Next Dog ERROR: ", err);
    });
  }

  //If user likes the dog
  $scope.goodDog = function(dog) {
    console.log("Good Dog Start");
    var url = `/tinder/good/${dog.id}`;
    $http({
      url: url,
      method: 'GET'
    }).then(res => {
      console.log("help please god");
      console.log("Good Dog: ", res.data);

      if(res.data === true) {
        console.log("HELP HELP END ME PLEASE");
        $scope.end = true;
      } else {
        $scope.goodDog = res.data;
        console.log("more dogs to go");
        $scope.end = false;
      }
    }, err => {
      console.log("Good Dog ERROR: ", err);
    });
    console.log("Good Dog End");
  };

  //If user dislikes the dog
  $scope.badDog = function(dog) {
    console.log("Bad Dog Start");
    //console.log("Current bad dogs: " + req.session.badDogs);
    var url = `/tinder/bad/${dog.id}`;
    $http({
      url: url,
      method: 'GET'
    }).then(res => {
      console.log("help please bad");
      console.log("Bad Dog: ", res.data);

      if(res.data === true) {
        console.log("HELP HELP END ME PLEASE");
        $scope.end = true;
      } else {
        $scope.badDog = res.data;
        console.log("more dogs to go");
        $scope.end = false;
      }

    }, err => {
      console.log("Bad Dog ERROR: ", err);
    });
    console.log("bad dog ended");
  };
});


// Controller for the final results page
app.controller('finalController', function($scope, $http) {
  console.log("We're in the final controller");
     $http({
        url: '/final/:final',
        method: 'GET'
     }).then(res => {
         console.log(res.data);
         $scope.finalDog = res.data;
     }).catch(err => {
        console.log("Error: ", err);
     });
  $scope.dogPhotos = function(dog) {
    console.log(dog);
    console.log(dog.breed_id);
    var url = `/final/final/${dog.breed_id}`;
    console.log("we calllling\n\n\n");
    $http({
      url: url,
      method: 'GET'
    }).then(res => {
      console.log("Photos: ", res.data);
      $scope.dogPhotos = res.data;
      /*const pics = {};
      res.data.forEach(e =>
        pics.push('https://www.seas.upenn.edu/~hosa/cis550/' + dogs.photo))*/
    }, err => {
      console.log("Good Dog ERROR: ", err);
    });
    console.log("Good Dog End");
  };

});


// Controller for the Best Of Page
app.controller('guesserController', function($scope, $http) {

  $http({
    url: '/guesser/:guesser',
    method: 'GET'
  }).then(res => {
    console.log("Colors: ", res.data);
    $scope.breeds = res.data;
    $scope.weights = [5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120];
    $scope.heights = [5,10,15,20,25,30,35,40,45,50,55,60,65,70];
  }, err => {
    console.log("color ERROR: ", err);
  });



  $scope.submit = function() {
    var url = `/guesser/${$scope.selectedColor.color}/${$scope.selectedWeight}/${$scope.selectedHeight}`;
    console.log(url);
    if ($scope.selectedColor !== "") {
      $http({
        url: url,
        method: 'GET'
      }).then(res => {
        console.log("res contains: ",res.data);
        if(res.data !== undefined && res.data.length != 0){
          console.log("help this train");
        $scope.dog = res.data;
      }
      else {
        console.log("MADE IT");
        $scope.dog = [{breed: "Sorry we couldn't find a breed with those qualities"}];
      }
      }, err => {
        console.log("Movies ERROR: ", err);
      });
    }
  };
});
/*
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
