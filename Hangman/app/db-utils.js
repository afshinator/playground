

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
						my.status.msg('No events to show!');
						return false; // TODO
					}

					firstPingFromFbase = false;

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


		var handleFbasePing = function(callback) {
			/*
			firebaseRef.on('child_added', function(s) {
				// seems to fire twice after initial .value push
				// and doesnt fire when I need it to! So not using it.
				// console.log(" child_added" + s.val());
			});
			*/

			firebaseRef.on('child_changed', function(s) {
				// if a new top level key/val elt added, then new game
				var newHanging;
/*
				for ( var i in Object.keys(s.val()) ) {
					if ( pastHangingNames.indexOf(i) === -1 ) {
						newHanging = i;
						console.log('++ Looks like a new game starting: ' + newHanging );
					}
				}
				*/
				console.log(s.val());
				console.log(Object.keys(s.val()));

							// if not then its an update to a current game
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