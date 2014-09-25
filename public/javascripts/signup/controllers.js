angular.module("mymartlet.signup.controllers",["mymartlet.signup.factories"]);

angular.module("mymartlet.signup.controllers")
	.constant("SignupConstants", {
		//The url to post the signup details
		signupPostUrl: "http://localhost:3000/signup",

		//The err codes possibly returned by the server on signupPost
		signupErrs: {
			//The msg for when the passowrds do not match
			passDoNotMatch: "Your entered passwords do not match",
			//The msg for when the entered email already exists in the db
			emailAlreadyExists: "The entered email has already been registered",
			//The default err
			serverErr: "We are unable to process your request at this time"
		}
	});

function SignupController($scope,$http,SignupFactory,SignupConstants) {
	//Scope object for the error views
	$scope.err = {
		//Whether to show the err views
		show: false,
		//The err message to show
		msg: ""
	};

	//var to keep trakc of when the user has tries to submit the signup form
	$scope.submitted = false;

	//function taht shows the error views with the passed msg
	function showErr(msg) {
		//Set the scope err.msg to the msg that has to be shown
		$scope.err.msg = msg;
		//Show the err view
		$scope.err.show = true;
	}

	//function to hide the error view
	function hideErr() {
		$scope.err.show = false;
	}

	//The function to call when they click on the signup buton
	$scope.signupButtonListener = function() {
		//Set submitted to true
		$scope.submitted = true;

		//Check if the form is valid
		if($scope.signupForm.$valid) {
			//validate the passwords entered
			if(SignupFactory.validatePasswords($scope.password,$scope.confPassword) == false)
			{
				//Validation failed then show the err
				showErr(SignupConstants.signupErrs.passDoNotMatch);
			}
			//Otherwise everythign is good so call the post method
			else {
				$http.post(SignupConstants.signupPostUrl, {email: $scope.email, password: $scope.password, confPassword: $scope.confPassword})
				//The success promise
				.success(function () {

				})
				//The error promise
				.error(function(response, data, status, header) {
					//Switch the status code sent
					switch(data) {
						//If it is 409then it is a user generated err
						case 409: {
							//Switch the response to see what kind of user err
							switch(response) {
								//If it is 100 the the email has already been registered
								case 100: {
									showErr(SignupConstants.signupErrs.emailAlreadyExists);
									break;
								}
							}
						}
						//By default show the server Err
						default: {
							showErr(SignupConstants.signupErrs.serverErr);
						}
					}
				});
			}
		}
	};
}

//Add the SignupController
angular.module("mymartlet.signup.controllers")
	.controller("SignupController",SignupController);