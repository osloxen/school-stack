angular.module('FindCtrl', []).controller('FindController', function($scope,$resource,ManageDevices) {

    $scope.tagline = 'To Do:  do anything!';
    $scope.device = {};
    $scope.searchResults = [];


    $scope.checkout = function(deviceName, borrowerName){
        // call the ManageDevices service to reserve the device
        ManageDevices.reserveDevice(deviceName, borrowerName);
    };


    var iotDeviceList = $resource('http://localhost:8888/api/iotdevice',{},{});
    var listOfIoTDevices = iotDeviceList.query(function() {
        $scope.registeredIoTDevices = listOfIoTDevices;

        var onlineDeviceList = $resource('http://localhost:8888/api/edisonscan',{},{});
        var listOfOnlineEdisonDevices = onlineDeviceList.query(function() {
            $scope.currentOnlineEdisonDevices = listOfOnlineEdisonDevices;

            for (var i=0; i < $scope.registeredIoTDevices.length; i++) {

                if (listOfOnlineEdisonDevices.indexOf($scope.registeredIoTDevices[i].name) != -1) {
                    $scope.registeredIoTDevices[i]["online"] = true;
                } else {

                    $scope.registeredIoTDevices[i]["online"] = false;
                }
            }

        })

    });

    function getPerfectScore(deviceToScore){

        var perfectScore = 0;

        for (var key in deviceToScore){
            if ($scope.device[key] == true) {

                perfectScore += 1;
            }
        }

        return perfectScore;
    }


    function deviceMatchesSearch(currentDevice, capabilityArray, callback){

    }


    $scope.search = function(){

        $scope.searchResults = [];

        for ( var i=0; i < $scope.registeredIoTDevices.length; i++) {

            // keep track of whether current device scores all the matches
            var potentialDeviceScore = 0;

            // figure out what a perfect score is


            // create a giant array of all the capabilities of a specific device
            var capabilities = $scope.registeredIoTDevices[i].npmInstall
                .concat($scope.registeredIoTDevices[i].sensors);

            // search through all the key value pairs looking for matches and score 1 if you find one
            for (var key in $scope.device){
                if ((capabilities.indexOf(key) != -1) &&
                    ($scope.device[key] == true)) {

                        potentialDeviceScore += 1;
                }
            }

            // if your score is the same as the number of positive capabilities then you have a match
            if (potentialDeviceScore == getPerfectScore($scope.device)) {

                $scope.searchResults.push($scope.registeredIoTDevices[i]);
            }


        }
    }


});