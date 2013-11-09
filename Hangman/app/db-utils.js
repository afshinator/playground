

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


		// after init(), data in a allPastHangings hashtable
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
				var newHanging;			// Gets name of new game from among all games on certain day

				// TODO: one problem with this:  If you have a game where the word being guessed
				// happens to be the same as another game on the same day, this won't set newHanging!
				for ( var i in s.val() ) {
console.log( ' s.val() ' + s.val());
console.log( ' i ' + i);
					if ( allPastHangings[i] === undefined ) {
						newHanging = i;
					}
				}
				// newHanging will be name of game if not in allPastHangings
console.log( 'Caught new broadcast event ' + newHanging );
// So either:
//	1.event sent is update to live game currently in session
//	2.event sent is first in a new game just started, no game is being shown
//	3.event sent belongs to a live game (just started or not), *other* live game in session
//	4.event sent belongs to a live game (just started), other non-live game in session
//	5.event sent belongs to a live game (not just started), other non-live game in session

// So only pass on the event to be played by the gameplayer if:
//		case 1, 
//		case 2, 
//		case 4
//
				var turn = s.val(); // [newHanging]["try"]; // what turn is embedded in this event?

				if ( !my.gameRunner.inPlay() ) {						// no game running
					my.gameRunner.showLiveGame( s.val()[newHanging] );	// case 2
				} else {												// game running
					// There is a showing going on right now
					if ( !my.gameRunner.live() && turn === 1) {
						my.gameRunner.showLiveGame( s.val()[newHanging] );	// case 4
					}
				}

				if ( my.gameRunner.live() ) {							// live game already running
					if ( my.gameRunner.gameWord() === newHanging ) {	// same game, pass on event
						my.gameRunner.showLiveGame( s.val()[newHanging] );			// case 1
					} else {											// diff't game, ignore
						my.announcement.rollupMsg("New game " + newHanging);	// case 3
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