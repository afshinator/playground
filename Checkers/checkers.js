


var checkers = (function ($, my) {

	my.board = (function() {
		var position = [];				// The actual board, 32 places.
		var emptySquare = ' ';
		var capturedBlacks = 0;			// 
		var capturedReds = 0;

		var pos = function(nonZeroIndex) {			// Compenstate for array index; syntactic sugar!
			return position[nonZeroIndex - 1];		// 
		};

		var rowOfSquare = function(squareNumber) {	// What row is numbered square ? 
			return Math.ceil( Math.abs( squareNumber / 4 ) );
		};

		
		var reset = function() {	// Mark 32 positions as either red, black, or empty.
			for ( var i = 0; i < 32; i += 1 ) {
				if ( i < 12 ) {
					position[i] = 'b';			// Top 3 rows (12 spots) are black pieces
				} else if ( i < 20 ) {
					position[i] = emptySquare;	// Mid 2 rows are empty
				} else {
					position[i] = "r";			// Bottom 3 rows are red pieces
				}
			}
		};

		var showOnCommandLine = function(showOnlyIndex) {
			var result = "";
			for ( var i = 0; i < 32; i += 1 ) {

				if ( i % 4 === 0 ) {
                  result += "\n";             // end of line
                }
                if ( i % 8 === 0 ) {
                   result += "...";           // start of every other line
                }
              
				if ( showOnlyIndex ) {			// for debugging, etc...
					if ( i + 1 < 10 ) {
						result +=  ( " " + (i+1) + " " );
					} else {
						result +=  ( " " + (i+1)  );
					}
				} else {						// Show whats in this position
					result +=  ( " " + position[i] + " " );
				}
				if ( i % 8 !==3  ) result += "...";	// Add empty spot unless we're on odd lines            
			}
            console.log(result);
		};

		// If possible, move from and to squares passed in as parameters,
		// else return false.       
		var moveIfPossible = function(from, to) {
			var whoWantsToMove = pos(from);		// is it r, b, R, or B that wants to move?

			if ( pos(to) !== emptySquare ) {
				return false;					// nobody can move to occupied spot
			}

			if ( whoWantsToMove === 'b' && ( rowOfSquare(to) <= rowOfSquare(from) ) ) {
				return false;					// black can only go downward
			}

			if ( whoWantsToMove === 'r' && ( rowOfSquare(to) >= rowOfSquare(from) ) ) {
				return false;					// red can only go upward
			}

			if ( Math.abs( from % 4 - to % 4 ) > 1 ) {
				// TODO: doesn't allow for multiple jumps!
				return false;					// trying to jump too far
			}

		};

		return {
			reset : reset,
			show : showOnCommandLine,
			move: moveIfPossible
		};
	})();


    return my;

}(jQuery, checkers || {}));


/*
 * Conventions:  
 *		The board is oriented so that Black is going from top down, Red is going up.
 *		The user is Red.
 *
 */

var checkers = (function (my) {

	my.game = (function() {
		var gameStarted = false;
		var blacksTurn = parseInt( Math.random() * 10, 10 ) % 2;	// Randomly select who starts

		var getPlacementChoice = function() {
			return prompt( "Your next move ?", "1-32");
		};

		var start = function() {
			my.board.reset();
			
			gameStarted = true;
		};


		return {
			begun : gameStarted,
			blacksTurn : blacksTurn,
			start : start
		};

	})();

    return my;

}(checkers || {}));