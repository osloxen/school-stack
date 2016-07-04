/**
 * Created by dberge on 3/2/16.
 */

// on routes that end in /configuredevice
// ----------------------------------------------------
router.route('/configuredevice')

    // create iotdevice (accessed at POST http://localhost:8888/api/configuredevice)
    .post(function(req, res) {

        var newLine = '\n';

        var dir = '/tmp/';
        var fileName = 'temp.txt';
        var fileContents = '#!/bin/sh';

        // give the file a new line
        fileContents += newLine;

        // use some defaults in case they are not set in the post
        if (req.body.directory != null) {
            dir = req.body.dir;
        };

        if (req.body.fileName != null) {
            fileName = req.body.fileName;
        };

        var findThisDevice = {};
        findThisDevice.name = req.body.devicename;
        InternetThing.findOne(findThisDevice, function(err, device) {

            if (err)
                res.send(err);

            device.available = false;
            device.loanedTo = req.body.loanedTo;
            device.npmInstall = req.body.npmInstall;
            device.config = req.body.config;
            device.sensors = req.body.sensors;
            device.save(function(err) {
                if (err)
                    res.send(err);

//                    res.json({ message: 'IoT Device reserved!' });
                console.log('Device named ' + findThisDevice.name + ' is now reserved.');
            });

        });


        fs.writeFile(dir + fileName, fileContents, function(err) {
            if(err) {
                return console.log(err);
            }

//            console.log("The file was saved!");
        });

        var shellOutput = '';

        if (req.body.config == 'cron') {
            exec('touch deleteme.txt').toString();
            var shellOutput = exec('echo instructions to install cron here').toString();
            console.log(shellOutput);
        }

        if (req.body.npmInstall.length != 0) {
            console.log(req.body.npmInstall);

            for (i=0;i<req.body.npmInstall.length;i++) {
                var output = exec('ssh root@' + req.body.devicename + '.local ' + 'npm install ' + req.body.npmInstall[i].toString());
                console.log('install ' + i + ': ' + output);
            }

        }

        // I never see this. it returns the object instead.
        res.json({ message: 'IoT Device reserved and file written to ' + dir + fileName + ' ' + shellOutput});


    });
