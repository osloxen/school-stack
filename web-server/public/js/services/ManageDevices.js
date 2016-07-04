

angular.module('ManageDevicesService', []).service('ManageDevices', function($resource) {


    this.reserveDevice = function(deviceName, borrower, npmModules) {

        var reserveAndConfigureDevice = $resource('http://localhost:8888/api/configuredevice',{},{});


        // Create JSON Object
        var device = {};
        device.devicename = deviceName;
        device.loanedTo = borrower;
        device.config = [];  // otherwise the rest call will fail on getting length
        if (npmModules.length == 0) {
            device.npmInstall = [];  // yep, same bug.  gotta fix rest service
        } else {
            device.npmInstall = npmModules;
        }

        // Reserve and configure the device
        var reserveResultString = reserveAndConfigureDevice.save({}, device, function() {
            console.log("reserving device: " + device.devicename + " to: " + device.loanedTo);
        });

        reserveResultString;

    };


    this.checkinDevice = function(deviceName) {

        var checkDeviceIn = $resource('http://localhost:8888/api/checkin',{},{});

        // Create JSON Object
        var device = {};
        device.devicename = deviceName;

        // Reserve and configure the device
        var checkinResultString = checkDeviceIn.save({}, device, function() {
            console.log('Checked in device: ' + deviceName);
        });

        return checkinResultString;
    }


    this.getAllRegisteredDevices = function() {

        var iotDeviceList = $resource('http://localhost:8888/api/iotdevice',{},{});

        var promise = new Promise(function(resolve, reject) {

            var foo = iotDeviceList.query(function(){
                resolve(foo);
            });

            if (foo != undefined) {
                console.log("promise worked");

            }
            else {
                reject(Error("It broke"));
            }
        });

        return promise;

/*

        promise.then(function(result) {
            console.log("promise.then");
            console.log(result); // "Stuff worked!"
            return result;
        }, function(err) {
            console.log(err); // Error: "It broke"
        });
*/


    }



    this.getDeviceInfo = function(deviceList,deviceName) {


            for (var i=0; i<deviceList.length; i++) {

                if (deviceList[i].name == deviceName) return deviceList[i];
            }


    }




});