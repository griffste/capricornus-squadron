/*
 * Module for AI Player
 */
var app = app || {};
app.ai = (function(util, pathfinder, unitStats, terrainStats){
	//Constants for types of AI actions
	var AI_ACTION_TYPES = {
		END_TURN: 0,
		MOVE_UNIT: 1,
		ATTACK_UNIT: 2
	};

	//used for when AI is done with its turn
	function aiActionEndTurn(){
		return {actionType: AI_ACTION_TYPES.END_TURN};
	}

	/*
	 * Used for when AI wants to move a unit
	 * use as return value for aiAction function
	 * Note that no error checking is done that the startingCoordinate contains a unit, or that it is an AI unit 
	 * and no checking is done that the ending coordinate is valid
	 * @param startingCoordinate - starting coordinate {x, y} of the unit
	 * @param endingCoordinate - ending coordinate {x, y} of the unit
	 * @returns AI action 
	 */
	function aiActionMoveUnit(startingCoordinate, endingCoordinate){
		return {
			actionType: AI_ACTION_TYPES.MOVE_UNIT,
			startingCoordinate: startingCoordinate,
			endingCoordinate: endingCoordinate
		}
	}

	/*
	 * Used for when AI wants to attack a unit
	 * use as return value for aiAction function
	 * Note that no error checking is done that the startingCoordinate contains a unit, or that it is an AI unit 
	 * and no checking is done that the ending coordinate is valid
	 * and no checking is done that attackedUnitCoordinate contains a player unit that can be attacked
	 * @param startingCoordinate - starting coordinate {x, y} of the unit
	 * @param endingCoordinate - ending coordinate {x, y} of the unit
	 * @param attackedUnitCoordinate - coordinate of the unit to be attacked once the unit reaches its endingCoordinate (not implemented at the moment)
	 * @returns AI action 
	 */
	function aiActionAttackUnit(startingCoordinate, endingCoordinate, attackedUnitCoordinate){
		return {
			actionType: AI_ACTION_TYPES.ATTACK_UNIT,
			startingCoordinate: startingCoordinate,
			endingCoordinate: endingCoordinate,
			attackedUnitCoordinate: attackedUnitCoordinate
		}
	}


	/*
	* Used to get a single AI action
	* 
	* no error checking is done that the AI move is valid, so for instance when
	* moving a unit, use pathfinder.movementCoordinatesFor() to find valid movementCoordinates
	* @param gamboard - 2 dimensional array of units and terrain
	* @param - unitStatsArray - array of unit stats, cross-indexed to unit.type
	* @param - terrainStatsArray - array of terrain stats, cross-indexed to terrain.type
	* @returns either aiActionAttackUnit(), aiActionMoveUnit(), or aiActionEndTurn()
	*/
	function aiAction(gameboard, unitStatsArray, terrainStatsArray){
		return randomAiAction(gameboard, unitStatsArray, terrainStatsArray);
	}

	//example function, picks random AI action
	function randomAiAction(gameboard, unitStatsArray, terrainStatsArray){
		if(Math.random() * 100 <= 20){
			return aiActionEndTurn();
		}
		for(var i = 0; i < gameboard.length; i++){
			var innerArray = gameboard[i];
			for(var j = 0; j < innerArray.length; j++){
				//randomly decide to move a unit if it can move and is an AI unit
				if(gameboard[i][j].unit && gameboard[i][j].unit.team === unitStats.TEAMS.AI && gameboard[i][j].unit.canMove && Math.random() * 100 <= 70){
					var unit = gameboard[i][j].unit;
					var startingCoordinate = {x: i, y: j};
					var movementCoordinates = pathfinder.movementCoordinatesFor(startingCoordinate, gameboard, unitStatsArray, terrainStatsArray);
					//pick random ending coordinate
					var endingCoordinate = movementCoordinates[Math.floor(Math.random() * movementCoordinates.length)];
					return aiActionMoveUnit(startingCoordinate, endingCoordinate);
				}
			}
		}
		return aiActionEndTurn();
	}
	

    //exported functions
    return {
    	ACTION_TYPES: AI_ACTION_TYPES,
    	aiAction: aiAction
    };
})(app.util, app.pathfinder, app.unitStats, app.terrainStats);