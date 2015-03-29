var myAppModule = angular.module('hither', []);

//create hotel controller
angular.module('hither').controller('TripController', ['$scope', 'FlightFactory', function($scope, FlightFactory) {
  FlightFactory.fetchFlights().success(function(data) {
      var flight_input = data.trips.tripOption[0].slice[0].segment[0];
      var trip_input = data.trips.tripOption;
      $scope.trips = new Trip(createFlights(flight_input), {price: "USD320.50"});
  });
}] );

// create flight factory
angular.module('hither').factory('FlightFactory', ['$http', function($http) {
  var factory = {};

  var thing = {
    "request": {
      "slice": [
      {
        "origin": "JAN",
        "destination": "KTN",
        "date": "2015-03-27"
      }
      ],
      "passengers": {
        "adultCount": 1,
        "infantInLapCount": 0,
        "infantInSeatCount": 0,
        "childCount": 0,
        "seniorCount": 0
      },
      "solutions": 1,
      "refundable": false
    }
  }

  factory.fetchFlights = function() {
    return $.ajax({
      type: 'POST',
      url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyAZwVwEPSvSSXXKzLrt-h-lQMN2T3woqCs',
      contentType: 'application/json',
      data: JSON.stringify(thing),
      dataType: "json"
    });
  };

  return factory;
}] );

//flight class definition
function Flight(flight_data){
  this.carrier_abbv = flight_data.carrier_abbv;
  this.airport_ori_code = flight_data.origin;
  this.airport_dest_code = flight_data.destination;
  this.duration = flight_data.duration;
}

//create flights function
function createFlights(flight_input){
  return flight_input.map(function(flight_data) {return new Flight(flight_data)})
}

//trip class definition
function Trip(flight_array, trip_data){
  this.price = trip_data.price;
  this.flights = flight_array;
  this.duration = function(){
    duration = 0;
    this.flights.forEach(function(flight){duration = duration + flight.duration});
    return duration
  }
}