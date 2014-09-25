angular.module("mymartlet.login.controllers",[]);

angular.module("mymartlet.login.controllers")
	.constant("LoginConstants",{
		//The POST url to which we send the login detaisl
		loginPostUrl: "/login",

		//Has the strings for each possible error type
		loginErr: {
			//string for invalid login credentials
			invalidCredentials: "Invalid username/password combination",
			//string for an external server error or the default error string
			serverErr: "We are unable to process your request at this time"
		}
	});

function LoginController($scope,$http,LoginConstants) {
	//scope variable to keep track of whether the user pressed the login button
	$scope.submitted = false;

	//scope variable for the err view.
	$scope.err = {
		//Whether to show the err view
		show: false,
		//The error message to show
		msg: ""
	};

	//function that shows the changes the scope err object to show the passed msg
	function showErr(msg) {
		//Set the scope err.msg var to the passed msg var
		$scope.err.msg = msg;
		//Show the err view
		$scope.err.show = true;
	}

	//function to hide the err view
	function hideErr() {
		//set the scope err.show variable to false
		$scope.err.show = false;
	}

	//The click listener for the login button
	$scope.loginButtonListener = function() {
		//Set submitted to true since the user pressed the login button
		$scope.submitted = true;

		//Check if the loginForm is valid. Do the post only if it is valid
		if($scope.loginForm.$valid) {
			//Do a post action to the server to login the user
			$http.post(LoginConstants.loginPostUrl, {email: $scope.email, password: $scope.password})
				.success(function (data) {
					//TODO Redirect user to admin page
				})
				//The error promise
				.error(function (response, data) {
					//If the status code is 401 then the user entered the wrong credentials
					if (data == 401) {
						showErr(LoginConstants.loginErr.invalidCredentials);
					}
					//Otherwise most probably an internal error
					else {
						showErr(LoginConstants.loginErr.serverErr);
					}
				});
		}
	}
}