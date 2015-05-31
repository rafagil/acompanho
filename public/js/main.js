angular.module('Acompanho', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngSanitize']).config(function($routeProvider) {
		
	$routeProvider.when('/list/:feedId', {
		templateUrl: 'partials/entries.html',
		controller: 'FeedsController'
	});

	$routeProvider.when('/', {
		templateUrl: 'partials/empty.html'
	});

	$routeProvider.otherwise({redirectTo:'/'});
});

angular.module('Acompanho').filter('limitWordWise', function() {
	return function (value, max) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
			var lastspace = value.lastIndexOf(' ');
			if (lastspace != -1) {
				value = value.substr(0, lastspace);
			}

            return value + '…';
        };
});