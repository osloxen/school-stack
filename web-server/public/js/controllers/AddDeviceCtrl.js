
angular.module('AddDeviceCtrl', []).controller('AddDeviceController', function($scope,$resource) {

	$scope.tagline = 'To Do: Add sensor information and list of active edisons';

    var server = '104.197.51.129';
    // var server = 'localhost';

    $scope.newStaffToAdd = {};
    $scope.listOfRecentlyAddedStaff = [];
    $scope.lastDeviceSaved = {};

    $scope.schoolList = [
        "St. Catherine",
        "Blanchet",
        "Roosevelt",
        "Our Lady of the Lake"
    ];

    $scope.availableSensorsList = [
        "Temperature",
        "Humidity",
        "Sound",
        "Light",
        "Moisture",
        "Lumber"
    ];



    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.selectedItem = null;
    $scope.sensor = null;


    $scope.transformChip = function(chip){
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }
    };


    /**
     * Search for sensors.
     */
    $scope.querySearch = function(query) {
        var results = query ? $scope.availableSensorsList.filter(createFilterFor(query)) : [];
        return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        //var lowercaseQuery = angular.lowercase(query);
        return function filterFn(sensor) {
            return (sensor.indexOf(query) === 0) ;
        };
    }



    $scope.save = function(newStaffToAdd) {

        // whatever you just added gets pushed to the current screen session
        $scope.listOfRecentlyAddedStaff.push($scope.newStaffToAdd);

        $scope.saveDevice = $resource('http://' + server + ':8888/api/addstaffmember',{},{});

        $scope.saveDevice.save({},$scope.newStaffToAdd);

    };

    $scope.cancelClicked = function() {
        $scope.device = [];
        $scope.device.sensors = [];
    }


});