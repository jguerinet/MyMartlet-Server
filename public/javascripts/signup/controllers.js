angular.module("mymartlet.signup.controllers",["mymartlet.signup.factories"]);

angular.module("mymartlet.signup.controllers")
	.constant("SignupConstants", {
		//The url to post the signup details
		signupPostUrl: "http://localhost:3000/signup",

		//The err codes possibly returned by the server on signupPost
		signupErrs: [
			{
				errCode: 100,
				errMsg: "Email already exists in our accounts"
			}
		]
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
			var validatePass = SignupFactory.validatePasswords($scope.password,$scope.confPassword);

			//If validation failed then show the err view with the err msg
			if(validatePass) {
				$scope.err = {
					show: true,
					msg: validatePass.err
				}
			}
			//Otherwise everythign is good so call the post method
			else {
				$http.post(SignupConstants.signupPostUrl, {email: $scope.email, password: $scope.password})
				//The success promise
				.success(function () {

				})
				//The error promise
				.error(function(response, data, status, header) {
					//If it is an internal server error then show the following error
					if(data === 500) {
						$scope.err = {
							show: true,
							msg: "Error processing your request. Please try again later"
						}
					}
					//Otherwise if it is a user error then do the following
					else {
						//Go through the signupError array
						for(var index=0; index<SignupConstants.signupErrs.length; index++) {
							//If the response status code matches the current err object errCode the show that err and break
							if(response.err == SignupConstants.signupErrs[index].errCode) {
								$scope.err = {
									show: true,
									msg: SignupConstants.signupErrs[index].errMsg
								};
								break;
							}
						}
					}
				});
			}
		}
	};
}

angular.module("mymartlet.signup.controllers")
	.controller("SignupController",SignupController);