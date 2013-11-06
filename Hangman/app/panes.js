



var hangmanTV = (function ($, my) {		// Namespacing JQuery and 'my' as appwide global vars

	// Top left one-line announcement pane and a rollup section for more msgs.
	my.announcement = function() {
		var el$ = $('#announcements');
		var statusMsg$ = $('#statusMsg');
		var rollup$ = $('#rollup');
		var rolledUp = false;

		return {
			statusMsg : function(str) { statusMsg$.html(str); },
			rollupMsg : function(html) { rollup$.html(html); },
			up : function(n) { rollup$.slideUp(n ? n : 1000); rolledUp = true;},
			down : function(n) { rollup$.slideDown(); rolledUp = false; }
		};

	}();



	// Menu of past games to be clicked on
	my.menu = function() {
		var el$ = $('menu');
		var listings$ = $('#menu-listings');

		function isNumber(n) {  return !isNaN(parseFloat(n)) && isFinite(n);  }

		function initClickHandler() {
			$('#menuList').on('click', 'li', function() {
				var whatWasClickedOn = $(this).text().toUpperCase();

				if ( isNumber(whatWasClickedOn[0]) ) {		// click on date, not a hanging.
					// dont do anything for now
					console.log( "not an option " + whatWasClickedOn );
				} else {									// Handle menu click

					my.gameStatus.reveal();
					my.gameRunner.showSavedGame( whatWasClickedOn );
				}
				return false;  // same action as this.prevenDefault(); in other words dont follow the link
			});
		}

		// callback for Firebase; fills the menu with pre-recorded games
		function fillWith(html) {
			listings$.html(html);								// Fill menu with listings from Firebase
			my.announcement.up();
			my.announcement.statusMsg("Previous Hangings:");
			initClickHandler();									// Handle clicks in menu
			my.announcement.rollupMsg(" ");			// get rid of 'waiting' image
		}

		return {
			fillWith : fillWith
		};

	}();



	// Right hand pane with info about each round
	my.gameStatus = function() {
		var el$ = $('#gameStatus');

		var round$ = $('#round');
		var theWord$ = $('#theWord');
		var misc$ = $('#misc');
		var theGuess$ = $('#theGuess');
		var button$ = $('#button1');

		var visible = false;

		var showButton = function(t) { button$.prop("disabled", false); button$.html(t); };

		return {
			reveal: function() { el$.show(); visible = true; },
			hide: function() { el$.hide(); visible = false; },
			showButton: showButton,
			hideButton: function() { button$.prop("disabled", true); },
			round: function(s) { round$.html(s); },
			word: function(s) { theWord$.html(s); },
			misc: function(s) { misc$.html(s); },
			guess: function(s) { theGuess$.html(s); },

			setupButton: function(handler, t) {
				t = t || "Next Guess"; // if ( !t ) { t = "Next Guess"; }
				showButton(t);
				button$.one('click', handler );
			},

			disableButton: function() {
				hideButton();
				button$.off();
			}
		};

	}();


	my.stage = function() {
		var el$ = $('#stage');
		var sceneList = ["base", "pole", "top",		// in order of what scene will be played first
						"noose", "head", "body", "r-arm", "l-arm", "r-leg", "l-leg"];
		var $scene = [];							// Ref to each scene html element
		var act = 0;								// What scene in order we are in. 0 == not started yet

		// initialization: cache JQuery selections for stage parts
		for ( var i = 0; i < sceneList.length; i += 1 ) {
			$scene[i] = $( "#" + sceneList[i] );
		}

		function hideScene(which) { $scene[which].css('visibility', 'hidden'); }
		function showScene(which) { $scene[which].css('visibility', 'visible'); }

		function reset() {
			for ( var i = 0; i < sceneList.length; i += 1 ) {
				hideScene(i);
			}
			act = 0;
		}

		function start() { }		// TODO: Initial effects as a Hangin' starts!		

		function doNextAct() {		// 
			if ( act < 11 ) { showScene(act); }
			act += 1;
		}

		return {
			reset : reset,
			start : start,
			doNextAct : doNextAct,
		};

	}();

    return my;
}(jQuery, hangmanTV || {}));