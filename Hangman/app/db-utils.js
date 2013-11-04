

var hangmanTV = (function ($, my) {                       // Namespacing JQuery and 'my' as appwide global var.

	// Encapsulates database functions - using Firebase which pushes events as they happen
	//		init()	- Opens connection & catches initial event Fbase sends holding all the data currently in db, 
	//					saves that data, fills a string with HTML of that data to hand back to callback.
	//
	my.db = function() {
		var firebaseRef;						// reference to Firebase connection
		var dbInitialDump;						// will hold first snapshot of db contents
		var html;								// string will contain html to show contents of initial db dump
		var firstPingFromFbase = true;			// Firebase sends an initial 'value' event upon connecting
		var allPastHangings = {};				// Will hold all past Hangings; key is the word


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
						console.log("First value event from fb has no hangings!");	// TODO
					}

					firstPingFromFbase = false;

				} else {
					console.log("non-first value events received from fb.");		// TODO
				}
			});				// end on
		};					// end init()


		return {
			init	: init,
		};

	}();


    return my;
}(jQuery, hangmanTV || {}));