
var app = angular.module('AA_Stats', ['ngRoute']);

app.controller('AA_Controller', ['$scope', function ($scope) {
	$scope.Name = 'AA_CONTROLLER';

	//link to child controllers
	$scope.Child_Game = {};
	$scope.Child_Settings = {};

	$scope.CurrentFaction = "AXIS";
	$scope.CurrentFaction_Game = "AXIS";
	$scope.CurrentFaction_Text = function () {
		return $scope.CurrentFaction === "AXIS" ? "Axis" : $scope.CurrentFaction === "ALLY" ? "Allies" : "Unknown";
	};
	$scope.CurrentFaction_Game_Text = function () {
		return $scope.CurrentFaction_Game === "AXIS" ? "Axis" : $scope.CurrentFaction_Game === "ALLY" ? "Allies" : "Unknown";
	};

	$scope.Players = [];

	$scope.MyClick = function (obj, pName, nDirection) {
		if (obj) {
			return MyEvents(obj, pName, nDirection);
		}
		else {
			return MyEvents($scope, pName, nDirection);
		}
	};

	$scope.EditSettings = function () {
		$scope.Child_Settings.Init($scope.data);
	};

	$scope.EditGame = function (sAction, oGame) {
		//here the scope of the child will be an object in the parent

		var bo;
		if (sAction === "NEW") {
			bo = new GameBO();
		}
		else if (sAction === "EDIT") {
			bo = oGame;
		}
		$scope.Child_Game.Init(sAction, bo);
	};

	$scope.Init = function () {
		$scope.data = getData();
		$scope.Players = $scope.data.getPlayers
		$scope.datasize = getStorageSize($scope.data)
	};
	$scope.SaveData = function () {
		saveData($scope.data)
		$scope.datasize = getStorageSize($scope.data)
	};
	$scope.ClearData = function () {
		clearData();
		$scope.Init();
		$scope.Child_Settings.Init($scope.data);
	};

	$scope.Init();
}]);

//only task is load html content
app.controller('Modal_Contoller', function ($scope, $rootScope) {
	$scope.ModalData = {};
	$scope.ModalData.Name = 'SCOPE_MODAL';
	$scope.ModalData.TargetModal = '';
	$scope.ModalData.URL = '';

	$rootScope.$on('LoadModal', function (event, data) { $scope.LoadModal(data); });
	$rootScope.$on('UnLoadModal', function (event, data) { $scope.UnLoadModal(); });

	$scope.LoadModal = function (data) {
		$scope.ModalData.TargetModal = data.Target;
		switch ($scope.ModalData.TargetModal) {
			case 'NEW_MEMBER':
				$scope.ModalData.URL = 'AxisAllies/app/views/Members/Create.html';
				break;
			case 'EDIT_MEMBER':
				$scope.ModalData.URL = 'AxisAllies/app/views/Members/Edit.html';
				break;
			case 'ADD_POINTS':
				$scope.ModalData.URL = 'AxisAllies/app/views/Roster/AddPoints.html';
				break;
			default:
				$scope.ModalData.URL = 'AxisAllies/app/views/DummyModal.html';
				break;
		}
	};
	$scope.UnLoadModal = function (data) {
		$scope.ModalData.TargetModal = "";
		$scope.ModalData.URL = 'AxisAllies/app/views/DummyModal.html';

		//since the Modal does not re-draw at this point the Content for the Modal is Maintained (html/Controller/Scope)
		// => force an update to the Modal_Controller.$scope
		//this will replace the current content of the Modal with a dummy
		//this dummy will ensure the Content for the Modal is updated (html/Controller/Scope)
		$scope.$apply();
	};
});

app.controller('GameController', ['$scope', function ($scope) {
	$scope.Name = 'GAME_CONTROLLER';

	//link to AA_Controller (parent)
	var parentScope = $scope.$parent;
	parentScope.Child_Game = $scope;

	$scope.data = new GameBO();

	//Game - Edit
	$scope.Init = function (sAction, oGame) {
		$scope.Action = sAction;
		$scope.data = oGame.clone();
	}

	$scope.MyClick = function (obj, pName, nDirection) {
		if (obj) {
			return MyEvents(obj, pName, nDirection);
		}
		else {
			return MyEvents($scope.data, pName, nDirection);
		}
	}

	$scope.SaveGame = function () {

		sFaction = $scope.data.Faction.toLowerCase();	//Faction Value set in modal
		oParentData = $scope.$parent.data

		var bGameUpdated = false;
		if ($scope.Action == 'EDIT') {
			gameInParent = oParentData.Games.filter(zz => zz.ID == $scope.data.ID);
			nIndex = oParentData.Games.findIndex(zz => zz.ID == $scope.data.ID);

			if (nIndex > -1) {
				oParentData.Games[nIndex] = $scope.data.clone();
				bGameUpdated = true;
			}
		}
		else if ($scope.Action == 'NEW') {
			var bo = $scope.data.clone();

			//track current index in the FactionBO
			oParentData.GameIndex++;
			bo.ID = oParentData.GameIndex;

			oParentData.Games.push(bo);
			bGameUpdated = true;
		}

		if (bGameUpdated) {
			oParentData.updateGameRecords()
			$scope.$parent.Players = $scope.$parent.data.getPlayers
		}

		$scope.data.reset();
	}
}]);

app.controller('SettingsController', ['$scope', function ($scope) {
	$scope.Name = 'SETTINGS_CONTROLLER';

	$scope.$watch('data.axis', function (newValue, oldValue) {
		if (!newValue) return;

		if (!newValue.InitWins) {
			$scope.data.axis.InitWins = 0;
		}
		if (!newValue.InitLosses) {
			$scope.data.axis.InitLosses = 0;
		}
	}, true);
	$scope.$watch('data.ally', function (newValue, oldValue) {
		if (!newValue) return;

		if (!newValue.InitWins) {
			$scope.data.ally.InitWins = 0;
		}
		if (!newValue.InitLosses) {
			$scope.data.ally.InitLosses = 0;
		}
	}, true);

	//link to AA_Controller (parent)
	var parentScope = $scope.$parent;
	parentScope.Child_Settings = $scope;

	$scope.data = {}

	//Game - Edit
	$scope.Init = function (oData) {
		//copy parent data to local scope
		//this prevents live updating till validated
		$scope.data.UserName = oData.UserName;
		$scope.data.axis = oData.axis.clone('SETTINGS');
		$scope.data.ally = oData.ally.clone('SETTINGS');
	}

	$scope.UpdateSettings = function () {
		//TODO: validate data
		//-- on validate continue and close modal
		//-- on fail keep modal open

		//get reference to parent object
		oParentData = $scope.$parent.data
		if (!oParentData) {
			//ERROR
			return;
		}

		//push the data to parent object
		oParentData.UserName = $scope.data.UserName;
		oParentData.axis = $scope.data.axis.clone('SETTINGS');
		oParentData.ally = $scope.data.ally.clone('SETTINGS');

		$scope.data = {};
	}
}]);


function MyEvents(obj, pName, oValue) {
	if (pName === 'Country') {
		nVal = Increment_Country(obj, oValue);
		obj['TO_Hours'] = 24;
	}
	else {
		nVal = obj[pName];
		nVal = nVal + oValue;

		if (pName === "TO_Hours" && (nVal > 24 || nVal < 0)) {
			nVal = 24;
		}
		if (pName === "Round" && nVal < 1) {
			nVal = 1;
		}
	}
	obj[pName] = nVal;
}

function Increment_Country(obj, oValue) {
	var nCurrentVal = obj['Country'];

	var oCountries = ['RUSSIA', 'GERMANY', 'UK', 'JAPAN', 'USA'];
	var nIndex = oCountries.indexOf(nCurrentVal);
	nIndex = nIndex + oValue;

	if (nIndex < 0) {
		nIndex = oCountries.length - 1;
	}
	if (nIndex > oCountries.length - 1) {
		nIndex = 0;
	}
	return oCountries[nIndex];
}
