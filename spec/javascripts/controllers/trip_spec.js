'use strict';

describe('TripController', function() {

  var $rootScope, $scope, $controller;

  beforeEach(module('hither'));

  beforeEach(inject(function(_$rootScope_, _$controller_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $controller = _$controller_;

    $controller('TripController', {'$rootScope': $rootScope, '$scope': $scope});
  }));

  it('should return a trip that contains an array of flight(s)', function() {
    expect($scope.trips.constructor.name === Array);
  });

})
