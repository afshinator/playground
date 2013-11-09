// Hangman-tv.js - 
//      by Afshin Mokhtari
//
// Mini-Project from
// http:


var hangmanTV = (function ($, my) {		// Namespacing JQuery and 'my' as appwide global vars,
										// enables inter-file sharing of global vars and objects/functions.
	var inPlay = false;				// Is a game going on currently?
	
	// Game initialization:									
	my.db.init("https://hangman-game.firebaseio.com", my.menu.fillWith);	// Connect to Firebase


	my.gameRunner = function() {
		var inPlay;					// true if a game is in progress
		var live;					// false if showing a saved game
		var round;					// Turn in the game
		// Info embeded in each event:
		var gamePlayer;
		var gameTimeStamp;
		var gameWord;

		// initialization:
		reset();

		var gameEvent = function() {		// event utility functions
			var showsWin = function(e) { return ( e["progress"].replace("_", e["guess"],"g") === gameWord ); };
			return {
				theWord : function(e) { return e["guess"]; },
				timeStamp : function(e) { return e["id"]; },
				progress : function(e) { return e["progress"]; },
				misses: function(e) { return e["misses"]; },
				guess: function(e) { return e["guess"]; },
				playerName : function(e) { return (e["playerID"] === "anon") ? "anonymous" : e["playerID"]; },
				showsWin : showsWin,
				showsLoss : function(e) { return ( e["misses"].length > 8 && ! showsWin(e) ); }
			};
		}();
		
		function prettify(str) {
			var resultStr = "";
			for ( var i = 0; i < str.length; i += 1 ) {	resultStr += str[i] + "  ";	}
			return resultStr;
		}

		function reset() {
			inPlay = false;
			live = undefined;
			round = 0;
			gamePlayer = null;
			gameTimeStamp = null;
			gameWord = null;
		}

		function extractGameDetails(event, whichGame) {
			gamePlayer = gameEvent.playerName(event);
			gameTimeStamp = gameEvent.timeStamp(event);
			gameWord = whichGame;
		}


		// called upon click on presaved game
		function showSavedGame(which) {
			reset();
			live = false;
			inPlay = true;

			var nextTurn = function() {
				var e = gameData[round-1];
				var win = gameEvent.showsWin( e );
				var hang = gameEvent.showsLoss( e );

				var misc = "";
				my.gameStatus.word( prettify( gameEvent.progress(e) ) );
				my.gameStatus.round('Round ' + round);
				
				misc = gameEvent.misses( e );
				misc = ( misc === "" ) ? "none" : misc;
				misc = 'wrong guesses: ' + misc + ", --> " + ( 10 - gameEvent.misses(e).length ) + ' left';

				my.gameStatus.misc(misc);
				my.gameStatus.guess('Guess: ' + gameEvent.guess(e) );

				if ( ( round > 1 ) &&
					( gameEvent.misses(e).length > gameEvent.misses(gameData[round-2]).length ) ) {
					my.stage.doNextAct();
				}

				if ( !win && !hang && round < gameLength) {
					round += 1;
					my.gameStatus.setupButton( nextTurn, "Next Turn" );
				} else {
					console.log("game ended.");
					if ( hang ) {
						my.gameStatus.setupButton( lossEnding, "Game End" );
					} else if ( win ) {
						my.gameStatus.setupButton( winEnding,  gameWord +'!' );
					} else if ( round >= gameLength ) {
						my.gameStatus.setupButton( abruptEnding, "Game End" );
					} else {
						console.log("WTF!");
					}
				}
			};

			// TODO: DRY-ify these three methods:
			var abruptEnding = function() {
				my.gameStatus.guess('Game abruptly over!');
				my.announcement.rollupMsg( "<p>Player forefieted game!</p>" );
				my.gameStatus.disableButton();
			};
			
			var winEnding = function() {
				my.gameStatus.guess('Player Wins!');
				my.announcement.rollupMsg( "<p>Congrads</p>" );
				my.gameStatus.disableButton();
			};

			var lossEnding = function() {
				my.gameStatus.guess('Hang em high!');
				my.announcement.rollupMsg( "<p>Player lost!</p>" );
				my.gameStatus.disableButton();
				my.stage.doNextAct();
				my.stage.end();
			};


			var gameData = my.db.get(which);		// Get array of game events
			var gameLength = gameData.length;

			if ( gameLength < 1 ) {  // will never make it here (?)
				// TODO: no game rounds to show! end game...
				return;
			}
			
			round = 1;
			extractGameDetails(gameData[0], which);		// Player name, game time, word being guessed
			
			my.announcement.statusMsg( 'Player: ' + gamePlayer );
			my.announcement.rollupMsg( "<p>" + gameTimeStamp + "</p>" );
			my.announcement.down();

			my.stage.reset();
			my.stage.prepare(gameTimeStamp);
			my.stage.start();
			nextTurn();
		}


		// called by fb event
		function showLiveGame(event) {
			if ( inPlay ) {							// are we already in the middle of a showing?
				if ( ! handleNewEventWhileWeAreAlreadyInPlay() ) {
					// pre recorded game is being interrupted by a live game,
					// cancel current game, and go on showing this live game
				}
			}

			round += 1;
			if ( round === 1 ) {
				live = true;
				inPlay = true;
				extractGameDetails(event);			// Player name game time, word being guessed

			}


		}


		// TODO: 
		function handleNewEventWhileWeAreAlreadyInPlay() {
			if ( live ) {							// is currently running showing live?
				my.announcement.statusMsg( 'New : ' + gameEvent.name() );
				// TODO in db, dont pay attention to this event anymore? , eventually add it to menu
				return true;  // continue with currently running game
			} else {
				// pre-recorded game in session,
				// interrupt it since new event means a live show is up
				return false;
			}
		}


		return {
			inPlay: inPlay,							// boolean, whether game is in session
			live : live,							// boolean, whether game is live
			gameWord : gameWord,					// if showing in session, whats the word?
			gameTimeStamp : gameTimeStamp,			// if showing in session, whats the timestamp

			reset : reset,
			showSavedGame : showSavedGame,
			showLiveGame : showLiveGame
		};

	}();


/*
 * TODO:
 * ERRORS when we cant connect to the net:
 *
 Uncaught SyntaxError: Unexpected token < index.adp:1
Uncaught ReferenceError: jQuery is not defined panes.js:142
Uncaught SyntaxError: Unexpected identifier db-utils.js:113
Uncaught ReferenceError: jQuery is not defined hangman-tv.js:302
GET https://cdn.firebase.com/v0/firebase.js  index.html:54

 */
    return my;
}(jQuery, hangmanTV || {}));