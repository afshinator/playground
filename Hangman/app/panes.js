



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
		var hideButton = function() { button$.prop("disabled", true); };

		return {
			reveal: function() { el$.show(); visible = true; },
			hide: function() { el$.hide(); visible = false; },
			showButton: showButton,
			hideButton: hideButton,
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
		var sceneList = ["base", "pole", "top", "noose",	// in order of what scene will be played first
						"head", "body", "r-arm", "l-arm", "r-leg", "l-leg"];
		var $scene = [];							// Ref to each scene html element
		var act = 0;								// What scene in order we are in. 0 == not started yet

		var fileCounts = [0, 0, 0, 0, 9, 6, 6, 6, 6, 6];

		// initialization: cache JQuery selections for stage parts
		for ( var i = 0; i < sceneList.length; i += 1 ) {
			$scene[i] = $( "#" + sceneList[i] );
		}

		// Load body parts pictures, use playerId to feed hash function to choose pictures
		function prepare(playerId) {
			var h, str;
			function hash(key, max) {
				var val = 0;
				for (var i = 0 ; i < key.length; i += 1) {
					val += key.charCodeAt(i);
				}
console.log("Hash val ====>" + val);
				return ( val % max ) + 1 ;
			}
			for ( var i = 4; i < sceneList.length; i += 1 ) {
				h = hash(playerId, fileCounts[i]);
				str = 'url(img/' + sceneList[i] + '-' + h + '.png)';
console.log('-- css : ' + sceneList[i] + ' gets ' + str);
				$scene[i].css('background', str);
			}
		}

		function hideScene(which) { $scene[which].css('visibility', 'hidden'); }
		function showScene(which) { 
			$scene[which].css('visibility', 'visible'); 
			// $scene[4].addClass('animated shake');
		}

		function reset() {
			for ( var i = 0; i < sceneList.length; i += 1 ) {
				hideScene(i);
			}
			act = 0;
		}

		function start() { // TODO: Initial effects as a Hangin' starts!
			$("#text").css("display","none");		// Turn off starting credits

			el$.css("background", "none");			// hide the stage itself
			el$.css("box-shadow", "none");
			el$.css("webkit-box-shadow", "none");
		}

		function end() {
			el$.css("background", "url(img/backdrop4.png) top no-repeat");			// hide the stage itself
			$scene[4].addClass('animated swing');
		}


		function doNextAct() {		// 
			if ( act < 11 ) { showScene(act); }
			act += 1;
		}

		return {
			prepare : prepare,
			reset : reset,
			start : start,
			doNextAct : doNextAct,
			end: end
		};

	}();

    return my;
}(jQuery, hangmanTV || {}));