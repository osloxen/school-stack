angular.module('MainCtrl', []).controller('MainController', function($scope,$resource,$route,ManageDevices,$mdDialog,
                                                                     $window, $mdToast,$mdConstant,$aria) {

	$scope.tagline = 'Select a device to see details.';
    $scope.deviceToConfigure = '';
    $scope.configureDevice = false;
    $scope.checkinResultMessage = '';
    $scope.selectedDevice = null;

    var server = '104.197.51.129';
    // var server = 'localhost';


    var allPersonsList = $resource('http://' + server + ':8888/api/allstaff',{},{});

    function getIoTDeviceData() {

        var listOfEveryone = allPersonsList.query(function() {
            $scope.allStaffMembers = listOfEveryone;

        });
    }


    getIoTDeviceData();





    $scope.seeDeviceDetails = function (nameOfDevice) {

        //TODO add some caching or a waiting indicator

        $scope.doneLoadingDetails = false;

        ManageDevices.getAllRegisteredDevices().then(function(result){
            $scope.registeredIoTDevices = result;
            $scope.selectedDevice = ManageDevices.getDeviceInfo(result,nameOfDevice);
            $scope.doneLoadingDetails = true;});
    }




    function getIoTDeviceByName(nameOfDevice) {

        for (var i=0; i<$scope.registeredIoTDevices.length; i++) {

            if ($scope.registeredIoTDevices[i].name == nameOfDevice) return $scope.registeredIoTDevices[i];
        }
    }


    function getIoTDevicesCheckedOutToYou(nameOfDevice) {

        for (var i=0; i<$scope.registeredIoTDevices.length; i++) {

            if ($scope.registeredIoTDevices[i].name == nameOfDevice) return $scope.registeredIoTDevices[i];
        }
    }


    $scope.showPrompt = function(ev) {
        $mdDialog.show({
                controller: ['$scope', 'deviceName', function($scope, deviceName, npmModules) {
                    $scope.deviceName = deviceName;
//                    $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
                    $scope.npmModules = [];
                }],
                templateUrl: '../../views/checkoutAndConfigureDevice.html',
                targetEvent: ev,
                clickOutsideToClose:true,
                scope: $scope,
                preserveScope: true,
                locals: {
                    deviceName : $scope.selectedDevice.name,
                    npmModules : $scope.npmModules
                }
            })
            .then(function(answer) {
                $scope.selectedDevice = null;
                console.log('I do not know how to use this');

            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };



    $scope.checkout = function(deviceName, borrowerName, npmModules){
        // call the ManageDevices service to reserve the device
        ManageDevices.reserveDevice(deviceName, borrowerName, npmModules);
        $mdDialog.hide();
    };

    $scope.user = {};
    $scope.user.name = '';

    $scope.configure = function(nameOfDevice) {
//        $scope.configureDevice = true;  // activates the hidden HTML
        $scope.deviceToConfigure = nameOfDevice; // gives a name to which we want to configure

    }




    $scope.checkin = function(nameOfDevice) {

        ManageDevices.checkinDevice(nameOfDevice);


        $mdToast.show($mdToast.simple()
            .textContent('Checked in device: ' + nameOfDevice)
            .position('top right')
            .theme("success-toast")
            .hideDelay(5000));


        $scope.selectedDevice = null;
        getIoTDeviceData();
    }



    $scope.reserveDevice = function(deviceConfig) {

        $scope.reserveAndConfigureDevice = $resource('http://' + server + ':8888/api/configuredevice',{},{});

        var npmInstallModules = [];

        if (deviceConfig.npmInstall1 != null) {
            npmInstallModules.push(deviceConfig.npmInstall1);
        }

        if (deviceConfig.npmInstall2 != null) {
            npmInstallModules.push(deviceConfig.npmInstall2);
        }

        if (deviceConfig.npmInstall3 != null) {
            npmInstallModules.push(deviceConfig.npmInstall3);
        }

        // Create JSON Object
        var device = {};
        device.devicename = $scope.deviceToConfigure;
        device.loanedTo = deviceConfig.loanedTo;
        device.config = deviceConfig.config;
        device.npmInstall = npmInstallModules;

        // Reserve and configure the device
        var reserveResultString = $scope.reserveAndConfigureDevice.save({}, device, function() {
            $scope.configureDevice = false;
            $route.reload();
        });

        console.log(reserveResultString);


    };



});