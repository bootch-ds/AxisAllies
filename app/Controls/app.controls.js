
app.directive('ctlfaction', [function () {
	return {
		restrict: 'E',
		scope: {
			SelectedFaction: "=value"
			
		},
		templateUrl: "AxisAllies/app/Controls/ControlTemplate.html", // "/app/controls/ctlFactionSelect.html",
		link: function (scope) {
			scope.Partial = 'CTL_FACTION';

			scope.ClickMe = function (sValue) {
				scope.SelectedFaction = sValue;
			};
		}
	};
}]);

app.directive('ctlround', [function () {
	return {
		restrict: 'E',
		scope: {
			Round: "=value"
		},
		templateUrl: "AxisAllies/app/Controls/ControlTemplate.html", // "/app/controls/ctlFactionSelect.html",
		link: function (scope) {
			scope.Partial = 'CTL_ROUND';

			scope.ClickMe = function (nValue) {
				var nNewValue = scope.Round + nValue;
				if (nNewValue < 1) {
					nNewValue = 1;
				}
				scope.Round = nNewValue;
			};
		}
	};
}]);

app.directive('ctlcountry', [function () {
	return {
		restrict: 'E',
		scope: {
			Country: "=value"
		},
		templateUrl: "AxisAllies/app/Controls/ControlTemplate.html", // "/app/controls/ctlFactionSelect.html",
		link: function (scope) {
			scope.Partial = 'CTL_COUNTRY';

			scope.ClickMe = function (nValue) {
				var oCountries = ['RUSSIA', 'GERMANY', 'UK', 'JAPAN', 'USA'];
				var nIndex = oCountries.indexOf(scope.Country);
				nIndex = nIndex + nValue;

				if (nIndex < 0) {
					nIndex = oCountries.length - 1;
				}
				if (nIndex > oCountries.length - 1) {
					nIndex = 0;
				}
				scope.Country = oCountries[nIndex];
			};
		}
	};
}]);

app.directive('ctltimer', [function () {
	return {
		restrict: 'E',
		scope: {
			TO_Hours: "=value"
		},
		templateUrl: "AxisAllies/app/Controls/ControlTemplate.html", // "/app/controls/ctlFactionSelect.html",
		link: function (scope) {
			scope.Partial = 'CTL_TIMER';

			scope.ClickMe = function (nValue) {
				var nNewValue = scope.TO_Hours + nValue;
				if (nNewValue > 24) {
					nNewValue = 24;
				}
				if (nNewValue < 1) {
					nNewValue = 1;
				}
				scope.TO_Hours = nNewValue;
			};
		}
	};
}]);



//not used at this time
app.filter('NotZero', function () {
	return function (input, defaultValue) {
		if (angular.isUndefined(input) || input === null || input === '') {
			return defaultValue;
		}
		return input;
	};
});
