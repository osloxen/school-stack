// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var fs         = require('fs');
var exec       = require('child_process').execSync;

var server = '104.197.51.129';
// var server = 'localhost';

// configure app
app.use(morgan('dev')); // log requests to the console

// configure CORS...whatever the hell that is
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods",'GET,POST,DELETE,PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8888; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://' + server + ':27017/schoolConnect'); // connect to our database
var StaffMember     = require('./app/models/schoolOrg');






// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});




// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------
router.route('/allstaff')

    .get(function(req, res) {

        console.log('you called /allstaff');
/*
        res.json({staff:
            [   {"lastName":"Arthur","Title":"3rd Grade Teacher"},
                {"id":"Acosta","Title":"Middle School Teacher"},
                {"id":"Schwartz","Title":"Principle"}]});
*/

        // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
        StaffMember.find({},  function (err, person) {
            if (err) return handleError(err);
            console.log(person)
            res.json(person);
        })

        StaffMember



    });



// ----------------------------------------------------
// ----------------------------------------------------
// ----------------------------------------------------
router.route('/addstaffmember')

    .post(function(req, res) {

        var newPerson = new StaffMember();
        //console.log('request is: ' + req.body.deviceType);

        newPerson.firstName = req.body.firstName;
        newPerson.lastName = req.body.lastName;
        newPerson.title = req.body.title;
        newPerson.active = true;
        newPerson.school = req.body.school;
        newPerson.email = req.body.email;
        newPerson.website = req.body.website;
        newPerson.personalPageExtras = req.body.personalPageExtras;

        // Dates
        newPerson.addedDate = Date.now();
        newPerson.lastModifiedDate = Date.now();

        console.log(newPerson);

        newPerson.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Internet Thing created!' });
        });


    })





// ********************************************
// ********************************************
// ********************************************
//
// OLD Edison Code Below Here
//
// ********************************************
// ********************************************
// ********************************************




// on routes that end in /edisonscan
// ----------------------------------------------------
router.route('/edisonscan')

    .get(function(req, res) {

        console.log('you called /edisonscan');

        function getBloopOutput(){

            var bloopOutput = exec('bloop scan -r').toString();

            return bloopOutput;
        }


        function getListOfEdisons(callback){

            console.log('looking through bloop scan -r result for edisons');

            var edisonArray = callback().match(/_tcp.\s.*/g);

            for (var i=0; i<edisonArray.length; i++) {
                edisonArray[i] = edisonArray[i].replace(/_tcp.\s/g, '');
            }

            return edisonArray;
        }

        var edisonArray = getListOfEdisons(getBloopOutput);

        res.json(edisonArray);

    });





// on routes that end in /checkin
// ----------------------------------------------------
router.route('/checkin')

    // create iotdevice (accessed at POST http://localhost:8888/iotdevice)
    .post(function(req, res) {

        var findThisDevice = {};
        findThisDevice.name = req.body.devicename;
        InternetThing.findOne(findThisDevice, function(err, device) {

            if (err)
                res.send(err);

            device.available = true;
            device.loanedTo = '';
            device.npmInstall = [];
            device.config = '';
            device.save(function(err) {
                if (err)
                    res.send(err);

                    res.json({ message: 'IoT Device checked in: ' + device.name });
            });

        });


    });



// on routes that end in /configuredevice
// ----------------------------------------------------
router.route('/configuredevice')

    // create iotdevice (accessed at POST http://localhost:8888/api/configuredevice)
    .post(function(req, res) {



            var findThisDevice = {};
            findThisDevice.name = req.body.devicename;
            InternetThing.findOne(findThisDevice, function(err, device) {

                if (err)
                    res.send(err);

                device.available = false;
                device.loanedTo = req.body.loanedTo;
                device.npmInstall = req.body.npmInstall;
                device.config = req.body.config;
                //device.sensors = req.body.sensors;
                device.save(function(err) {
                    if (err)
                        res.send(err);

//                    res.json({ message: 'IoT Device reserved!' });
                        console.log('Device named ' + findThisDevice.name + ' is now reserved.');
                });

            });



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
        res.json({ message: 'IoT Device configured'});


    });



// on routes that end in /iotdevice
// ----------------------------------------------------
router.route('/iotdevice')

	// create iotdevice (accessed at POST http://localhost:8888/iotdevice)
	.post(function(req, res) {
		
		var iotDevice = new InternetThing();		// create a new instance of the InternetThingy model
        console.log('request is: ' + req.body.deviceType);


        iotDevice.name = req.body.name;  // set the bears name (comes from the request)
        iotDevice.deviceType = req.body.deviceType;
        iotDevice.available = true;
        iotDevice.sensors = req.body.sensors;

        console.log(iotDevice);

        iotDevice.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Internet Thing created!' });
		});

		
	})

/*
	// get all the iot devices (accessed at GET http://localhost:8080/api/iotdevice)
	.get(function(req, res) {
		InternetThing.find(function(err, iotdevice) {
			if (err)
				res.send(err);

			res.json(iotdevice);

		});
	});
*/



// on routes that end in /iotdevice/byname/:iotdevice_name
// ----------------------------------------------------
router.route('/iotdevice/byname/:iotdevice_name')

    // get the iotdevice with this name
    .get(function(req, res) {
        var findThisDevice = {};
        findThisDevice.name = req.params.iotdevice_name;
        InternetThing.findOne(findThisDevice, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);

        });
    })




// on routes that end in /iotdevice/byid/:bear_id
// ----------------------------------------------------
router.route('/iotdevice/byid/:iotdevice_id')

	// get the iot device with that id
	.get(function(req, res) {
		InternetThing.findById(req.params.iotdevice_id, function(err, bear) {
                if (err)
                    res.send(err);
                res.json(bear);

        });
	})

	// update the bear with this id
	.put(function(req, res) {
        InternetThing.findById(req.params.iotdevice_id, function(err, bear) {

			if (err)
				res.send(err);

			bear.name = req.body.name;
			bear.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'IoT Device updated!' });
			});

		});
	})

	// delete the iot device with this id
	.delete(function(req, res) {
        InternetThing.remove({
			_id: req.params.iotdevice_id
		}, function(err, bear) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('RESTful api for you found on: ' + port);
