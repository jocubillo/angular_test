var app = angular.module('testApp', ['ngRoute']);
app.factory("services", ['$http', function($http){
	var serviceBase = 'services/';
	var obj = {};

	obj.getUsers = function(){
		return $http.get(serviceBase + 'users');
	};

	obj.getUser = function(userId){
		return $http.get(serviceBase + 'user?id=' + userId );
	};
	
	obj.addUser = function(user){
		var qrystr = Object.keys(user).map(function(key){ 
			return encodeURIComponent(key) + '=' + encodeURIComponent(user[key]); 
		}).join('&');
		
		var req = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: serviceBase + 'addUser',
			data: qrystr
		};

		return $http(req).then(function (results){
			return results;
		});
	}

	obj.updateUser = function(user){
		var qrystr = Object.keys(user).map(function(key){ 
			return encodeURIComponent(key) + '=' + encodeURIComponent(user[key]); 
		}).join('&');
		
		var req = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: serviceBase + 'updateUser',
			data: qrystr
		};

		return $http(req).then(function (results){
			return results;
		});
	}

	obj.deleteUser = function(user){
		var qrystr = Object.keys(user).map(function(key){ 
			return encodeURIComponent(key) + '=' + encodeURIComponent(user[key]); 
		}).join('&');
		
		var req = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			url: serviceBase + 'deleteUser',
			data: qrystr
		};

		return $http(req).then(function (results){
			return results;
		});
	}

	return obj;

}]);

app.controller('listCtrl', function ($scope, services){
	services.getUsers().then(function (data){
		$scope.users = data.data;
	});

	$scope.deleteUserData = function(id){
		var conf = confirm("Are you sure you want to delete?");
		if( conf == true ){
			var formdata = {};
			formdata.id = id;

			services.deleteUser(formdata).then(function(r){
				$scope.result = r;
				alert('DELETED!');
				window.location.reload();
			});
		}
	}
});

app.controller('viewCtrl', function ($scope, services, $routeParams ){
	var user_id = ($routeParams.userId) ? parseInt($routeParams.userId) : 0;
	services.getUser(user_id).then(function (data){
		$scope.id = data.data.id;
		$scope.name = data.data.name;
		$scope.email = data.data.email;
	});

	$scope.updateUserData = function(){
		var formdata = {};
		formdata.id = $scope.id;
		formdata.name = $scope.name;
		formdata.email = $scope.email;

		services.updateUser(formdata).then(function (r){
			$scope.result = r;
		});

		$scope.console = "Update SUCCESFULL!";
	}
});

app.controller('addCtrl', function ($scope, services){
	$scope.console = "Fill up the form";
	$scope.processAddUser = function(){
		$scope.console = "Thank you " + $scope.name + ' | ' + $scope.email;
		var formdata = {};
		formdata.name = $scope.name;
		formdata.email = $scope.email;

		services.addUser(formdata).then(function (r){
			$scope.result = r;
		});
	}
});

app.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
			when('/', {
				title : 'Users',
				templateUrl : 'partials/users.html',
				controller : 'listCtrl'
			})
			.when('/view-user/:userId',{
				title : 'User',
				templateUrl : 'partials/user-view.html',
				controller : 'viewCtrl',
			})
			.when('/add-user', {
				title : 'Add User',
				templateUrl : 'partials/user-add.html',
				controller : 'addCtrl'
			})
			.otherwise({
				redirectTo : '/'
			});
}]);

app.run(['$location', '$rootScope', function($location, $rootScope){
	$rootScope.$on('$routeChangeSuccess', function (event, current, previous){
		$rootScope.title = current.$$route.title;
	});
}]);
