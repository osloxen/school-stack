angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})


        .when('/add', {
            templateUrl: 'views/addDevice.html',
            controller: 'AddDeviceController'
        })

        .when('/editdelete', {
            templateUrl: 'views/editDeleteDevices.html',
            controller: 'EditDeleteController'
        })

        .when('/find', {
            templateUrl: 'views/findDevice.html',
            controller: 'FindController'
        });


	$locationProvider.html5Mode(true);

}]);