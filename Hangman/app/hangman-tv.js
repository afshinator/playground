// Hangman-tv.js - 
//      by Afshin Mokhtari
//
// Mini-Project from
// http:


var hangmanTV = (function ($, my) {		// Namespacing JQuery and 'my' as appwide global vars,
										// enables inter-file sharing of global vars and objects/functions.
	
	// Game initialization:									
	my.db.init("https://hangman-game.firebaseio.com", my.menu.fillWith);	// Connect to Firebase


	my.gameRunner = function() {
		var inPlay;					// true if a game is in progress
		var live;					// false if showing a saved game
		var round;					// Turn in the game
		
		var gamePlayer;				//  embeded in each event
		var gameTimeStamp;			//  embeded in each event
		var gameWord;

		// initialization:
		reset();

		var turn = function() { return round; };
		var isLive = function() { return live; };
		var isPlaying = function () { return inPlay; };
		var theWord = function() { return gameWord; };
		
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

		//
		// Called by either showSavedGame() or showLiveGame()
		function showNextTurn(e, gameData, callback) {
				var abruptEnding = function() {
					my.gameStatus.guess('Game abruptly over!');
					my.announcement.rollupMsg( "<p>Player forefieted game!</p>" );
					if ( live ) { my.gameStatus.disableButton(); }
				};
				
				var winEnding = function() {
					my.gameStatus.guess('Player Wins!');
					my.announcement.rollupMsg( "<p>Congrads</p>" );
					if ( live ) { my.gameStatus.disableButton(); }
				};

				var lossEnding = function() {
					my.gameStatus.guess('Hang em high!');
					my.announcement.rollupMsg( "<p>Player lost!</p>" );
					if ( live ) { my.gameStatus.disableButton(); }
					my.stage.doNextAct();
					my.stage.end();
				};

				var gameLength = gameData.length;				// only useful for pre-recorded games

				var win = gameEvent.showsWin( e );			// does this round's event show a win?
				var hang = gameEvent.showsLoss( e );		// does this round's event show a hangin'?

				var misc = "";
				my.gameStatus.word( prettify( gameEvent.progress(e) ) );
				my.gameStatus.round('Round ' + round);
				
				misc = gameEvent.misses( e );
				misc = ( misc === "" ) ? "none" : misc;
				misc = 'wrong guesses: ' + misc + ", --> " + ( 10 - gameEvent.misses(e).length ) + ' left';

				my.gameStatus.misc(misc);
				my.gameStatus.guess('Guess: ' + gameEvent.guess(e) );
console.log("WE R AT ROUND " + round + " <-------");
				if ( round > 1 ) {
					if ( gameEvent.misses(e).length > gameEvent.misses(gameData[round-2]).length ) {
						my.stage.doNextAct();
					}
				}
			
				if ( live ) {
					gameLength += 1;		// hack to catch abrupt game ending for pre-recorded games
				}
if ( round === gameLength ) { console.log('ROUND === gameLength'); }
				if ( !win && !hang && round < gameLength) {	// 
					round += 1;
					if ( live ) {
						my.gameStatus.setupButton( null, "waiting..." );
						my.gameStatus.hideButton();
					}
					else {
						my.gameStatus.setupButton( callback, "Next Turn" );
					}
				} else {
console.log("game ended.");
					if ( hang ) {
						my.gameStatus.setupButton( lossEnding, "Game End" );
					} else if ( win ) {
						my.gameStatus.setupButton( winEnding,  gameWord +'!' );
					} else {
						my.gameStatus.setupButton( abruptEnding, "Game End" );
					}
				}
		}

		// called upon click on presaved game
		function showSavedGame(which) {
			reset();
			live = false;
			inPlay = true;

			var nextTurn = function() {
				var e = gameData[round-1];					// the event object for the current turn
				showNextTurn(e, gameData, nextTurn);
			};


			var gameData = my.db.get(which);		// Get array of game events
			
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


		// 
		// event, list of all events / at least every event till current , name of event		
		function showLiveGame(e, allGameEvents, which) {

console.log('inside showLiveGame()');
			my.gameStatus.reveal();

			if ( round === 0 ) {
				round = 1;
				live = true;
				inPlay = true;
				extractGameDetails(e, which);			// Player name game time, word being guessed

				my.announcement.statusMsg( 'Player: ' + gamePlayer );
				my.announcement.rollupMsg( '<img src="img/anim4.gif" style="width: 25px;" > ' + gameTimeStamp );

				//my.announcement.rollupMsg( "<p>" + gameTimeStamp  + "</p>" );
				my.announcement.down();

				my.stage.reset();
				my.stage.prepare(gameTimeStamp);
				my.stage.start();
			}
			showNextTurn( e, allGameEvents );
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
			isPlaying : isPlaying,					// boolean, game in session?
			isLive : isLive,						// boolean, game in session is live?
			turn : turn,							// what turn in the game; 0 is game not started
			theWord : theWord,						// during game play, the word that is trying to be guessed
			gameTimeStamp : gameTimeStamp,			// during game play, the timestamp of when game was/is played

			reset : reset,
			showSavedGame : showSavedGame,			// Play pre-recorded game from the cloud (the data came in at startup)
			showLiveGame : showLiveGame				// Play a game being broadcast live, event by event
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