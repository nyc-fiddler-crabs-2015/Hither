myAppModule.controller('SearchController', ['$scope', '$rootScope', 'searchFactory', 'userSession',
    function($scope, $rootScope, searchFactory, userSession) {

      userSession.checkSession().success(function(data) {
        $rootScope.user = data;
      });

      $scope.show_input = true;
      $scope.show_filter = false;
      $scope.show_flight_results = true;

      $scope.search = searchFactory.buildSearch();
      $scope.airports = autocomplete_source;

      $scope.onItemSelected = function() {
        console.log('selected=' + $scope.search.depart_location);
      };


      $scope.submit = function() {
        console.log($scope.search);

        $rootScope.search = $scope.search;
      };

    }
  ]);

myAppModule.directive('typeahead', ['searchFactory', '$timeout', function(searchFactory, $timeout) {
  return {
    restrict: 'AEC',
    scope: {
      items: '=',
      prompt: '@',
      title: '@',
      subtitle: '@',
      city: '@',
      model: '=',
      onSelect: '&'
    },
    link: function(scope, elem, attrs) {
      scope.handleSelection = function(selectedItem) {
        scope.model = searchFactory.buildLocation(selectedItem);
        console.log(scope.model);
        scope.current = 0;
        scope.selected = true;
        elem.find('input').text("");
        $timeout(function() {
          scope.onSelect();
        }, 200);
      };
      scope.current = 0;
      scope.selected = true;
      scope.isCurrent = function(index) {
        return scope.current == index;
      };
      scope.setCurrent = function(index) {
        scope.current = index;
      };
    },
    template: ['<input type="text" class="search-bar form-control" ng-model="model" placeholder="{{prompt}}" ng-keydown="selected=false" />',
              '<div class="items" ng-hide="!model.length || selected">',
              '<div class="item" ng-repeat="item in items | filter:model track by $index" ng-click="handleSelection(item)" style="cursor:pointer" ng-class="{active:isCurrent($index)}" ng-mouseenter="setCurrent($index)">',
              '<div class="autocomplete-title-container">',
              '<span class="autocomplete-title">{{item[title]}}</span>',
              '</div>',
              '<div class="autocomplete-subtitle-container">',
              '<span class="autocomplete-subtitle"><strong>{{item[subtitle]}}</strong></span>',
              '<span class="autocomplete-subtitle"><em>{{item[city]}}</em></span>',
              '</div>',
              '</div>',
              '</div>'
              ].join('\n')
  };
}]);

myAppModule.factory('searchFactory', ['$http', function($http) {

    var factory = {};

    factory.search;

    factory.buildSearch = function() {
      return new Search();
    };

    factory.buildLocation = function(args) {
      return new Location(args);
    };

    var Location = function(args) {
      this.city = args.city;
      this.airport_code = args.code;
      this.latitude = args.lat;
      this.longitude = args.lng;
      this.name = args.name;
    };

    Location.prototype.toString = function() {
      return this.name + ' - ' + this.city;
    }

    var Search = function() {
      this.depart_location = null;
      this.arrival_location = null;
      this.depart_date = null;
      this.return_date = null;
    };

    return factory;
  }
]);


