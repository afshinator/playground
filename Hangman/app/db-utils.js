

var hangmanTV = (function ($, my) {                       // Namespacing JQuery and 'my' as appwide global var.

	// Encapsulates database functions - using Firebase which pushes events as they happen
	//		init()	- Opens connection & catches initial event Fbase sends holding all the data currently in db, 
	//					fills a string with HTML of original to hand back to callback.
	//					saves that data without the dates in allPastHangings to make it easily accessible.
	//
	my.db = function() {
		var firebaseRef;						// reference to Firebase connection
		var dbInitialDump;						// will hold first snapshot of db contents
		var html;								// string will contain html to show contents of initial db dump
		var firstPingFromFbase = true;			// Firebase sends an initial 'value' event upon connecting
		var allPastHangings = {};				// Will hold all past Hangings; key is the word


		// after init(), data in a allPastHangings hashtable & in the UI menu
		var init = function(fbaseURI, callback) {
			var key = "";
			firebaseRef = new Firebase(fbaseURI);			// Attempt connection to Fbase

			firebaseRef.on('value', function(snapshot) {	// Catch the Fbase .value event
				if ( firstPingFromFbase ) {
					dbInitialDump = snapshot.val();			// Save dump of all fbase records

					if ( dbInitialDump !== null ) {			// If there are records sent from fbase

						html = "<ul id='menuList'>";		// Build HTML structure for menu, save records of past hangings
						for ( var d in dbInitialDump ) {
							html += "<li>" + d + "</li>";						// dates

							html += "<ul>";
							for ( var w in Object.keys(dbInitialDump[d]) ) {	// names
								key = Object.keys(dbInitialDump[d])[w];
								html += "<li><a href='#'>" + key.toLowerCase() + "</a></li>";

								allPastHangings[key] = dbInitialDump[d][key];	// Add to hash
							}
							html += "</ul>";
						}
						html += "</ul>";

						callback(html);
					} else {
						console.log("-----~>   First value event from Firebase had data!");
						my.announcement.statusMsg('No events to show!');
						return false; // TODO
					}

					firstPingFromFbase = false;
					handleFbasePing(my.gameRunner.showLiveGame);
				} else {
					console.log("non-first value event received from fb.");		// TODO
				}
			});				// end on
		};					// end init()



		// True if key exists in allpastHangings
		var includes = function(key) {
			return Object.keys(allPastHangings).indexOf(key.toUpperCase()) === -1 ? false : true;
		};


		// Get returns all turns of a hanging, 
		// the data starts out as an array of objects,
		// but we return a sorted array of the objects with 0 being the first event, etc...
		var get = function(key) {
			key = key.toUpperCase();

			for (var k in allPastHangings) {
				if ( k === key) {
					return allPastHangings[key];
				}
			}
			return false;
		};


		var handleFbasePing = function() {
			/* Fbase 'child_added' event seems to fire twice after initial .value push, 
			 * and doesnt fire when I need it to! So not using it. For now.
			firebaseRef.on('child_added', function(s) {	});
			*/

			// This is the event fbase sends for a new event
			firebaseRef.on('child_changed', function(s) {
				var newGame;			// Gets name of new game from among all games on certain day
				var newGameEvents;		// Will be a shortcut for s.val()[newGame]
				var lastNewGameEvent;	// Will be a shortcut for newGameEvents[newGameEvents.length-1]

				// Go through list of all previous games that were loaded and stored upon startup,
				// if the event we just caught has a game thats not in our previous list, then thats a
				// new game thats being broadcast, assign its name to newGame
				// TODO: one problem with this:  If you have a game where the word being guessed
				// happens to be the same as another game on the same day, this won't set newGame!
				for ( var i in s.val() ) {
					if ( allPastHangings[i] === undefined ) {
						newGame = i;
						newGameEvents = s.val()[newGame];							// current live game's array of events
						lastNewGameEvent = newGameEvents[newGameEvents.length-1];	// last event in the array
					}
				}
				// newGame is name of game;  
console.log( 'Caught new broadcast event ' + newGame );

/*			round is gameRunners notion of what turn it is,  try is embedded in the event
 * 1. event is first in a new game, no current game 					// !inPlay, !live, round == 0, try == 0
 * 2. event is continuing a current game 								// inPlay, live, round != 0, try !=0, names will match
 * 3. event is first in a new game, current prerecorded game 			// inPlay, !live, round != 0, try == 0, names wont match
 * 4. event is first or continuing, current live game in session		// inPlay, live, round != 0, try == 0 or not, names dont match
 * 5. event is continuing, no current game 								// !inPlay, !live, round != 0, try != 0
 *
 * So only pass the event on to be played processed by gameplayer if:
 *	case 1
 * 	case 2
 *	case 3
 */
				var turn = my.gameRunner.turn();		// Get what round/turn we are on; 0 means a brand new game

				if ( ! my.gameRunner.isPlaying() ) {				// if NO game running
					if ( newGame === undefined ) {
console.log("// case 5 : not a new game broadcast, ignored");								// case 5 : not a new game broadcast
					}
					else if ( turn === 0 && lastNewGameEvent['try'] === 1) {				// case 1 : new game broadcast
console.log("// case 1 : new game broadcast");
						my.announcement.down();													// case 3
						my.gameRunner.showLiveGame( newGameEvents[0], newGameEvents, newGame );
					}
					// TODO: also case 5?
					// else event broadcast is not at first round, ignore it.		
				}
				else {												// Game IS currently running
					if ( my.gameRunner.isLive() ) {					// Game running is LIVE
						if ( newGame === my.gameRunner.theWord() ) {
console.log("// case 2 : update to current game being shown");
							my.gameRunner.showLiveGame( lastNewGameEvent, newGameEvents, newGame );// case 2 : update to current game being shown
						}
console.log("case 4 : update not for game we're showing");
						// else event broadcast is for a different game, ignore it. // case 4 : update not for game we're showing
					}
					else {											// Game running is PRE-RECORDED
console.log("// TODO: case 3");
						// TODO: show in rollups that a new game is here? , reset stage, pass in new game event.
					}
				}

console.log(s.val());
console.log(Object.keys(s.val()));
			});

		};


		return {
			init	: init,				// Gets called first, processes first event automatically sent from fbase & sets up data
			includes: includes,			// True if arg is a hanging we have 
			get		: get				// Return all the turn data for a hanging by argument name
		};

	}();


    return my;
}(jQuery, hangmanTV || {}));