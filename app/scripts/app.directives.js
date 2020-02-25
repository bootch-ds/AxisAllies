
app.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('', { templateUrl: "AxisAllies/app/views/home/home.html" })
		.when('/', { templateUrl: "AxisAllies/app/views/home/home.html" })
		.when('/home', { templateUrl: "AxisAllies/app/views/home/home.html" })
		.when('/gamelog', { templateUrl: "AxisAllies/app/views/gamelog.html" })
		.when('/playerlog', { templateUrl: "AxisAllies/app/views/players.html" })		
		.when('/about', { templateUrl: "AxisAllies/app/views/about.html" })		
		.otherwise({ template: "ERROR: MISSING TEMPLATE" });

	// use the HTML5 History API
	//$locationProvider.html5Mode(false);
	//$locationProvider.hasPrefix("#!");
});

app.directive('userstats', function () {
	return {
		restrict: 'A',
		templateUrl: 'AxisAllies/app/views/home/userstats.html'
	};
});
app.directive('gamesactive', function () {
	return {
		restrict: 'A',
		templateUrl: 'AxisAllies/app/views/home/gamesactive.html'
	};
});

app.directive('footer', function () {
	return {
		restrict: 'A',
		templateUrl: '/app/views/shared/footer.html'
	};
});
app.directive('header', function () {
	return {
		restrict: 'A',
		templateUrl: '/app/views/shared/header.html'
	};
});

app.directive('settings', function () {
	return {
		restrict: 'A',
		templateUrl: '/app/views/modals/settings.html'
	};
});
app.directive('newgame', function () {
	return {
		restrict: 'A',
		templateUrl: '/app/views/modals/newgame.html'
	};
});
