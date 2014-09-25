angular.module("mymartlet.signup.factories",[]);

//The factory taht has model methods for the signup app
function SignupFactory() {
	//The object that will have all the functions
	var signupFactory = {};

	//The function to check fit eh passwords entered are valid
	signupFactory.validatePasswords = function(password,confPasswords) {
		//Check if the two passwords entered by the user match
		if(password != confPasswords) {
			//If they do not pass in the err msg to show
			return {err: "Passwords do not match"};
		}
		//Otherwise return null err
		else {
			return null;
		}
	};

	//return the object
	return signupFactory;
}

//register the SignupFactory
angular.module("mymartlet.signup.factories")
	.factory("SignupFactory",SignupFactory);