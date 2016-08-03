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
	
	return obj;

}]);

app.controller('listCtrl', function ($scope, services){
	services.getUsers().then(function(data){
		$scope.users = data.data;
	});
});

app.controller('viewCtrl', function ($scope, services){
	services.getUser().then(function(data){
		$scope.user = data.data;
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
			.when('/edit-user/:userId',{
				title : 'User',
				templateUrl : 'partials/user-edit.html',
				controller : 'viewCtrl',
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
