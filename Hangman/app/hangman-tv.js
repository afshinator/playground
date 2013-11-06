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
			var showsWin = function(e) { return ( e["progress"].replace("_", e["guess"]) === e["guess"] ); };
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

		function extractGameDetails(event) {
			gamePlayer = gameEvent.playerName(event);
			gameTimeStamp = gameEvent.timeStamp(event);
			gameWord = gameEvent.theWord(event);
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
					my.gameStatus.setupButton(nextTurn, "Next Turn");
				} else {
					console.log("game ended.");
					alert('end of story');
				}
			};

			var gameData = my.db.get(which);		// Get array of game events
			var gameLength = gameData.length;

			if ( gameLength < 1 ) {  // will never make it here (?)
				// TODO: no game rounds to show! end game...
				return;
			}
			
			round = 1;
			extractGameDetails(gameData[0]);		// Player name, game time, word being guessed
			
			my.announcement.statusMsg( 'Player: ' + gamePlayer );
			my.announcement.rollupMsg( "<p>" + gameTimeStamp + "</p>" );
			my.announcement.down();

			my.stage.reset();
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
			reset : reset,
			showSavedGame : showSavedGame,
			showLiveGame : showLiveGame
		};

	}();


/*
	//
	// Main stage where the Hanging gets shown
	//
	var stage = function() {
		var el$ = $('#stage');
		var inPlay = false;						// true if we're in the middile of showing a hanging
		var whichInPlay = "";					// The word tyring to be guessed
		var act = 0;							// There are 10 acts.  Act 0 is show hasnt started yet
		var eachStep = ["base", "pole", "top", "noose", "head", "body", "r-arm", "l-arm", "r-leg", "l-leg"];	// in order
		var parts$ = [];						// JQuery selection referring to elements of eachStep 
		var data = null;						// Will contain information for each turn from Firebase

		var hangingDetected = false;
		var winDetected = false;

		// initialization; cache all the selection for stage parts
		for ( var i = 0; i < eachStep.length; i += 1 ) {
			parts$[i] = $("#"+eachStep[i]);
		}

		var hidePart = function(which) { parts$[which].css('visibility', 'hidden'); };

		var reset = function() {
			// if ( inPlay ) { ask if they want to really stop ... }		// TODO

			act = 0;
			inPlay = false;
			data = null;
			hangingDetected = false;
			winDetected = false;
		};



		// pass in event from either a pre-recorded hanging or a currently occuring one.
		var doTry = function(event) {
			function prettify(str) {
				var resultStr = "";
				for ( var i=0; i < str.length; i+=1 ) {
					resultStr += str[i] + "  ";
				}
				return resultStr;
			}

			var outputStr = "";
			var test = event["progress"].replace("_", event["guess"]);

			if ( test === whichInPlay ) {
				winDetected = true;
				outputStr += prettify(test) + "<br><br>";
			} else {
				outputStr += prettify(event["progress"]) + "<br><br>";
			}

			if ( event["misses"].length > 8 && !winDetected ) { hangingDetected = true; }

			// outputStr += "Round : " + event["try"] + "<br>";
			outputStr += "Countdown to death:  " + ( 10 - event["misses"].length );
			outputStr += "<br>Misses : " + ( event["misses"] === "" ? "none" : event["misses"] ) ;
			if ( winDetected ) {
				outputStr += "<br><br><strong>Guess : " + event["guess"] + " is a winner!" + "</strong>";
			} else if ( hangingDetected ){
				outputStr += "<br><br><strong>Guess : " + event["guess"] + " Oh Snap!" + "</strong>";
			} else {
				outputStr += "<br><br><strong>Guess : " + event["guess"] + "</strong>";
			}
			outputStr += "<br>";

			controls.setTurnInfo(outputStr);

	console.log(hangingDetected, winDetected);
	//console.log(outputStr);
		};


		// Called upon a click in the list of previous hangings;
		// Passed in a string with the name of hanging (the word being guessed)
		var prerecorded = function(which) {
			var i = 0;

			var nextAct = function() {
console.log('before the doTry, i is ' + i + ' data.length is ' + data.length);
				if ( i > data.length ) { i = 0; }
				if ( i === data.length) {
					// SHOW OVER
					controls.disableButton();
					
					if ( winDetected ) {
						my.status.set( "Game ended in " + i + " round(s)." );
					}
					else if ( hangingDetected ) {
						my.status.set( "Hang Em High! in " + i + " round(s)." );
					}
					else {
						my.status.set( "Game ended abruptly in " + i + " round(s)!" );
					}
					i=0;
					reset();
					return;
				}
				doTry(data[i]);
				i += 1;
				act += 1;
			};

			whichInPlay = which;					// Name of the hanging which is also the word being guessed.
			reset();
			data = my.db.get(which);				// Array of hanging-event objects

			inPlay = true;
			controls.show();						// side panel with button...
			
			var player = ( data[0]["playerId"] === undefined ) ? "anonymous" : data[0]["playerId"] ;

			my.status.msg( "Watching: " + player );
			my.status.set( "( " + data[0]["id"] + " )");

console.log("Watching " + player + " play a " + data.length + " round game trying to guess " + which );
			controls.initButton(nextAct);

			doTry(data[i++]);
		};


		return {
			doTry: doTry,
			prerecorded: prerecorded
		};
	}();

*/
    return my;
}(jQuery, hangmanTV || {}));