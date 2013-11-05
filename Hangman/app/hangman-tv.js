// Hangman-tv.js - 
//      by Afshin Mokhtari
//
// Mini-Project from
// http:


var hangmanTV = (function ($, my) {		// Namespacing JQuery and 'my' as appwide global vars
										// Creates inter-file sharing of global vars and objects/functions.

	// open a connection to where our data lives and where we get pushed hangman events from
	// var firebaseRef = new Firebase("https://hangman-game.firebaseio.com");
	var dbInitialDump;							// where we'll store all past hangman events
	var pastHangingNames = [];			// will hold names of all hanging sessions in db
	var pastHangingDates = [];			// will hold all days grouping hanging sessions
	var firstFbasePull = true;

	var $stage = $('#stage');
	// $stage.hide();


	// status is the space in the menu with the loading image and the notifications
	my.status = function(){
		var el$ = $('#status');
		var msg$ = $('#statusMsg');
		var rolledUp = false;

		return {
			fadeIn: function() { el$.fadeIn(); },
			up : function(n) { el$.slideUp(n ? n : 1000); rolledUp = true; },
			down: function() {	el$.slideDown();	rolledUp = false; },
			set : function(html) { el$.html(html); },
			msg	: function(str) { msg$.html(str); }
		};
	}();

	my.status.fadeIn();


	// menu is the vertical list of Hangings that can be watched,
	// it will also hold newly broadcast Hangings in the status sub-area
	var menu = function() {
		var el$;

		return {
			init : function() {
				function isNumber(n) {  return !isNaN(parseFloat(n)) && isFinite(n);  }
				el$ = $('#menuList');

				el$.on('click', "li", function() {				// upon menu click
					var whatWasClickedOn = $(this).text().toUpperCase();

					if ( isNumber(whatWasClickedOn[0]) ) {		// click on date, not a hanging.
						// dont do anything for now
						console.log( "not an option " + whatWasClickedOn );
					} else {
						my.status.down();
						stage.prerecorded( whatWasClickedOn );
					}
					return false;  // same action as this.prevenDefault(); in other words dont follow the link
				});
			}
		};
	}();


	// Gets called after the first view event is fired by Firebase
	var showMenu = function(html) {
		$('#listings').append(html);		// Fill in menu of hangings available for viewing
		my.status.up();						// status is small section above the menu listings; hide loading pic
		my.status.msg('Choose a hanging to view');
		menu.init();						// Setup menu click handling
	};

	my.db.init("https://hangman-game.firebaseio.com", showMenu);


	//
	// The "Next Turn" button, and Information about each turn
	//
	var controls = function() {
		el$ = $('#controls');
		elInfo$ = $('#infoHere');

		var beingShown = false;

		var show = function() { el$.show(); beingShown = true; };

		var hide = function() { el$.hide(); beingShown = false; };

		var setTurnInfo = function(html) { elInfo$.html(html); };

		var initButton = function(callback) {
			// show the button
			$("#button1").prop("disabled", false);

			// set up handler
			$("#button1").click(function() {
				callback();
			});
		};

		var disableButton = function() { $("#button1").prop("disabled", true); };

		return {
			show : show,
			hide : hide,
			setTurnInfo : setTurnInfo,
			initButton : initButton,
			disableButton : disableButton
		};
	}();




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
			/*
			for ( var i = 0; i < parts$.length; i += 1 ) {
				hidePart(i);
			}
			*/
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



    return my;
}(jQuery, hangmanTV || {}));