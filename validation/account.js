var mongoose = require('mongoose');

/**
 * The mongoose validator objects for an Account
 * @module validation/account
 */

/**
 * The array of mongoose validators for the groups field
 * @type {{validator: Function, msg: string}[]}
 */
exports.groups = [
	{
		//The validator that checks if the entries in the groups array point to a Group
		validator: function(groups, done) {
			//Find all Groups whose ObjectId matches one of the entries in the groups array
			mongoose.model('Account').find({'_id': {$in: groups}}).exec().then(
				//Success
				function (groupsFound) {
					//if it is true then the validation has passed
					if(groupsFound.length == groups.length) {
						//Pass the validation
						return done(true)
					}

					//Fail the validation
					return done(false);
				},
				//Error
				function (err) {
					//Log it
					console.log(err);
					//Fail the validation
					return done(false);
				}
			);
		},
		//The message when validation has failed
		msg: 'Not all entries in the array point to a Group'
	}
];