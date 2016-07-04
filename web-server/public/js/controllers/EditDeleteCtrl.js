angular.module('EditDeleteCtrl', []).controller('EditDeleteController', function($scope,$resource) {

	$scope.tagline = 'To Do:  handle errors';

    $scope.delete = function(person) {


        $scope.findDevice = $resource('http://localhost:8888/api/iotdevice/byname/:',{},{});

        var personToFind = {};
        personToFind.personFirstName = person.firstName;

        var foundDevice = $scope.findDevice.get(personToFind, function() {
            $scope.personToDelete = foundDevice;
            console.log($scope.deviceToDelete);

            deleteDevice();
        });

        var deleteDevice = function() {

            $scope.deleteDevice = $resource('http://localhost:8888/api/iotdevice/byid/:iotdevice_id',{},{});

            // Create JSON Object
            var device = {};
            device.iotdevice_id = $scope.deviceToDelete._id;

            // Delete the device
            $scope.deleteMessage = $scope.deleteDevice.delete(device, function() {
                console.log('deleted account: ' + $scope.deviceToDelete.name);

            });



        };

        $scope.device = {};
    };

});