// Object Defintions
function getRecord_Game(oGameList, oGame) {
	var oPrevGames = oGameList.filter(ele =>
		ele.ID <= oGame.ID &&
		ele.Opponent_Name.toLowerCase() === oGame.Opponent_Name.toLowerCase() &&
		ele.Faction === oGame.Faction &&
		(ele.Status === 'WON' || ele.Status === 'LOSS'));

	var nWins = oPrevGames.filter(zz => zz.Status === "WON").length;
	var nLosses = oPrevGames.filter(zz => zz.Status === "LOSS").length;

	return nWins + " - " + nLosses
}

class DataBO {
	constructor(sData) {
		this.UserName = 'Guest';
		this.GameIndex = 0;

		this.axis = new FactionBO('AXIS');
		this.ally = new FactionBO('ALLY');
		this.Games = DataBO._Games = [];

		if (sData) {
			var obj = JSON.parse(sData);

			this.UserName = obj.UserName;
			this.GameIndex = obj.GameIndex;

			this.axis = new FactionBO(obj.axis);
			this.ally = new FactionBO(obj.ally);

			this.Games = DataBO._Games = [];
			if (obj.Games) {
				obj.Games.forEach(oItem => {
					DataBO._Games.push(new GameBO(oItem));
				});

				this.updateGameRecords('ALL');
			}
		}
	}

	updateGameRecords(obj) {
		if (obj === 'ALL') {
			this.Games.forEach(ele => {
				ele.Record = getRecord_Game(this.Games, ele);
			});
		}
		if (Array.isArray(obj)) 			//update an array of games
		{
			obj.forEach(ele => {
				ele.Record = getRecord_Game(this.Games, ele);
			});
		}
		else if (typeof obj === 'object')	//update a single game
		{
			obj.Record = getRecord_Game(this.Games, obj);
		}
		else {
			this.Games.forEach(ele => {
				ele.Record = getRecord_Game(this.Games, ele);
			});
		}
	}

	get getPlayers() {
		var oPlayers = []

		var names = [...new Set(this.Games.map(xx => xx.Opponent_Name.toLowerCase()))];
		names.forEach(sName => {
			var bo = new PlayerBO();
			bo.Opponent_Name = sName;

			var oPrevGames = this.Games.filter(ele =>
				ele.Opponent_Name.toLowerCase() === sName.toLowerCase() &&
				ele.Faction.toLowerCase() === "axis" &&
				(ele.Status === 'WON' || ele.Status === 'LOSS'));

			bo.Axis_Wins = oPrevGames.filter(zz => zz.Status == "WON").length;
			bo.Axis_Losses = oPrevGames.filter(zz => zz.Status == "LOSS").length;

			var oPrevGames = this.Games.filter(ele =>
				ele.Opponent_Name.toLowerCase() === sName.toLowerCase() &&
				ele.Faction.toLowerCase() === "ally" &&
				(ele.Status === 'WON' || ele.Status === 'LOSS'));

			bo.Ally_Wins = oPrevGames.filter(zz => zz.Status == "WON").length;
			bo.Ally_Losses = oPrevGames.filter(zz => zz.Status == "LOSS").length;

			oPlayers.push(bo);
		});

		return oPlayers;
	}

}
DataBO._Games = []

class FactionBO {
	get Games() { return DataBO._Games.filter(zz => zz.Faction === this.Name); }
	get GameLogWins() { return this.Games.filter(zz => zz.Status === "WON").length; }
	get GameLogLosses() { return this.Games.filter(zz => zz.Status === "LOSS").length; }
	get TotalWins() { return parseInt(this.InitWins) + this.GameLogWins; }
	get TotalLosses() { return parseInt(this.InitLosses) + this.GameLogLosses; }
	get GameCount() { return this.TotalWins + this.TotalLosses; }
	get WinPercent() { return parseInt(this.GameCount === 0 ? 0 : (this.TotalWins / this.GameCount) * 100) };
	get GamesActive() { return this.Games.filter(zz => zz.Status === "ACTIVE").length; }

	constructor(obj) {
		this.Name = '';
		this.InitWins = 0;
		this.InitLosses = 0;

		if (typeof obj === 'object') {
			this.Name = obj.Name;
			this.InitWins = parseInt(obj.InitWins);
			this.InitLosses = parseInt(obj.InitLosses);
		}
		else if (typeof obj === 'string') {
			this.Name = obj;
		}
	}

	clone(sKey) {
		if (sKey == "SETTINGS") {
			var bo = new FactionBO();
			bo.Name = this.Name;
			bo.InitWins = this.InitWins;
			bo.InitLosses = this.InitLosses;

			return bo;
		}
	}
}


class GameBO {
	get StartDateTime() {
		if (Object.prototype.toString.call(this.StartDate) === "[object Date]" &&
			Object.prototype.toString.call(this.StartTime) === "[object Date]") {
			var dtDate = new Date(this.StartDate);
			var dtTime = new Date(this.StartTime);
			dtDate.setHours(dtTime.getHours())
			dtDate.setMinutes(dtTime.getMinutes())
			return dtDate;
		}
		return {}
	}
	get ConditionText() {
		switch (this.ResultCondition) {
			case "V":
				return "Victory";
			case "C":
				return "Concession";
			case "TO":
				return "Timed Out";
			case "QQ":
				return "Rage Quit";
			default:
				return "Not Set";
		}
	}

	constructor(oData) {
		this.ID = -1;
		this.Game_Name = "NOT_SET";
		this.Opponent_Name = "NOT_SET";
		this.Faction = "AXIS";
		this.Status = "ACTIVE";
		this.ResultCondition = "NA";
		this.Record = "0 - 0";
		this.Round = 1;
		this.Country = "RUSSIA";
		this.TO_Hours = 24;

		this.StartDate = {};
		this.StartTime = {};
		this.EndDate = {};
		this.EndTime = {};

		this.Notes = [];

		if (oData && typeof oData == 'string') {
			oData = JSON.parse(oData);
		}

		if (oData && typeof oData == 'object') {
			this.ID = parseInt(oData.ID);
			this.Game_Name = oData.Game_Name;
			this.Opponent_Name = oData.Opponent_Name;
			this.Faction = oData.Faction;

			this.Status = oData.Status
			this.ResultCondition = oData.ResultCondition

			this.Round = parseInt(oData.Round);
			this.Country = oData.Country;
			this.TO_Hours = parseInt(oData.TO_Hours)

			this.StartDate = new Date(oData.StartDate);
			this.StartTime = new Date(oData.StartTime);
			this.EndDate = new Date(oData.EndDate);
			this.EndTime = new Date(oData.EndTime);
			//this.Notes
		}
		else {
			this.reset();
		}
	}

	reset() {
		var d = new Date();

		this.ID = -1;
		this.Game_Name = "";
		this.Opponent_Name = "";
		this.Faction = 'AXIS';

		this.Status = 'ACTIVE';
		this.ResultCondition = 'NA';

		this.Round = 1;
		this.Country = 'RUSSIA';
		this.TO_Hours = 24;

		this.StartDate = new Date(d.toLocaleDateString());
		this.StartTime = new Date("1/1/2000  " + d.getHours() + ":" + d.getMinutes());
		this.EndDate = new Date(d.toLocaleDateString());
		this.EndTime = new Date("1/1/2000  " + d.getHours() + ":" + d.getMinutes());

		this.Notes = []
	}

	clone() {
		var bo = new GameBO();

		bo.ID = this.ID;
		bo.Game_Name = this.Game_Name;
		bo.Opponent_Name = this.Opponent_Name;
		bo.Faction = this.Faction;
		bo.Status = this.Status;
		bo.ResultCondition = this.ResultCondition;
		bo.Record = this.Record;
		bo.Round = this.Round;
		bo.Country = this.Country;
		bo.TO_Hours = this.TO_Hours;
		bo.StartDate = this.StartDate;
		bo.StartTime = this.StartTime;

		return bo;
	}
}

class NoteBO {
	constructor() {
		this.Text;
		this.Round;
		this.Country;
		this.Time;
	}
}

class PlayerBO {
	constructor() {
		this.Opponent_Name = '';
		this.Axis_Wins = 0;
		this.Axis_Losses = 0;
		this.Ally_Wins = 0;
		this.Ally_Losses = 0;
	}

	get GameCount() {
		return this.Axis_Wins + this.Axis_Losses + this.Ally_Wins + this.Ally_Losses;
	}
}



