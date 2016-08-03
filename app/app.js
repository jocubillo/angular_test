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
		return $http.post(serviceBase + 'adduser', user).then(function (results){
			return results;
		});
	}

	return obj;

}]);

app.controller('listCtrl', function ($scope, services){
	services.getUsers().then(function (data){
		$scope.users = data.data;
	});
});

app.controller('viewCtrl', function ($scope, services, $routeParams ){
	var user_id = ($routeParams.userId) ? parseInt($routeParams.userId) : 0;
	services.getUser(user_id).then(function (data){
		$scope.user = data.data;
	});
});

app.controller('addCtrl', function ($scope, services){
	services.getUsers().then(function(data){
		$scope.console = "Fill up the form";
		$scope.processAddUser = function(){
			$scope.console = "Thank you " + $scope.name + ' | ' + $scope.email;
			var formdata = [];
			formdata.name = $scope.name;
			formdata.email = $scope.email;

			services.addUser(formdata).then(function (r){
				$scope.result = r;
			})
		}
	});
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
