/*var resetRouter = require('express').Router();

var mail = require('../util/mail');

var Reset = require('../models/reset');
var resetErr = require('../err/reset');

var User = require('../models/user');

var jade = require("jade");

resetRouter.get('/',function(req,res) {
    res.render('reset/reset');
});

resetRouter.post('/',function(req,res) {
	//Generate a reset object for the user who wants to reset their password and save it to the database
	Reset.generateResetObject(req.body.email,function(err,reset) {
		//If no errors then send the reset password email
		if(!err&&reset) {
			mail.sendMail(req.body.email, reset.id, function (err) {
				if (err) {
					res.send(402);
				}
				else {
					res.send(200);
				}
			});
		}
		else {
			res.send(402);
		}
	});
});

//The route for when the has a resetId to reset their password
resetRouter.get('/:resetId',function(req,res) {
	//Check if the resetId in the url is valid
	Reset.validateResetId(req.params.resetId,function(err,validated,errCode) {
		//Server err
		if(err) {
			res.send(500);
		}
		//reset id is not valid. Depending on the err code send the right http err
		else if(!validated) {
			if(errCode === resetErr.NO_RESET_FOUND) {
				res.send(404);
			}
			else if(errCode === resetErr.TIME_EXPIRED) {
				res.send(403);
			}
		}
		//Everything is good send the reset password page
		else {
			res.render('reset/reset_password');
		}
	});
});

//The route for sending the passwords to reste the user's account with
resetRouter.post('/:resetId',function(req,res) {
	//Validate the resetId
	Reset.validateResetId(req.params.resetId,function(err,validated,errCode) {
		//Server error return 500
		if(err) {
			res.send(500);
		}
		//error with reset id. Send back the right http status code depending on the errCode
		else if(!validated) {
			if(errCode === resetErr.NO_RESET_FOUND) {
				res.send(404);
			}
			else if(errCode === resetErr.TIME_EXPIRED) {
				//Since the time is expires we don't need the object anymore so remove it
				Reset.removeReset(req.params.resetId);
				res.send(403);
			}
		}
		//No errors continue
		else {
			//Get the user whose password has to be reset
			Reset.getUser(req.params.resetId,function(err,user) {
				//Server err send 500
				if(err) {
					res.send(500);
				}
				//No user found send 400
				else if(!user) {
					res.send(400);
				}
				//No errors.Proceed with resetting the password
				else {
					User.resetPassword({pass:req.body.pass,rePass:req.body.rePass},user,function(serverErr,done,errs) {
						//Server err send 500
						if(serverErr) {
							res.send(500);
						}
						//Password reset not complete send the errs array
						else if(!done) {
							res.send(400,errs);
						}
						//Password reset done. Send 200
						else {
							//Since we are done with this reset object we will remove it
							Reset.removeReset(req.params.resetId);
							res.send(200);
						}
					});
				}
			});
		}
	});
});

module.exports = function(app) {
    app.use('/reset',resetRouter);
};*/