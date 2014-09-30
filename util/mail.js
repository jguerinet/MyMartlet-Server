//Get the nodemailer module which will be used to send messages
var nodemailer = require("nodemailer");

//Create a nodemailer transporter object to send the mails
var transporter = nodemailer.createTransport({
	//Te predefined service
	service: "Gmail",
	//The authentication for the service
	auth: {
		user: "appvelopers@gmail.com",
		pass: "mcgillmobile"
	}
});

//Sends a mail using the passed variables
//receiver: An array of strings with the email addresses of who we want to send the mail to
//subject: string having the sibject
//body: string could be html having hr body of the mail
//callback: the function to call once we get a response back
exports.sendMail = function(receivers,subject,body,callback) {
	//Make a mailOptions object with the passed vars
	var mailOptions = {
		from: "Appvelopers",
		to: receivers,
		subject: subject,
		text: body
	};

	//Send a mail
	transporter.sendMail(mailOptions,function(err,info) {
		//Call the callback function with the parameteres in the response
		return callback(err,info);
	});
};

