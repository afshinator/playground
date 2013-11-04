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
					if ( isNumber(whatWasClickedOn[0]) ) {
						// dont do anything for now
						console.log( "not an option " + whatWasClickedOn );
					} else {
						console.log( whatWasClickedOn );		// TODO: launch viewing
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
	var stage = function() {
		var el$ = $('#stage');
		var inPlay = false;						// true if we're in the middile of showing a hanging
		var act = 0;							// There are 10 acts.  Act 0 is show hasnt started yet
		var eachStep = ["base", "pole", "top", "noose", "head", "body", "r-arm", "l-arm", "r-leg", "l-leg"];	// in order
		var parts$ = [];
		// var data;								// Will contain information for each turn from fba

		// initialization; cache all the selection for stage parts
		for ( var i = 0; i < eachStep.length; i += 1 ) {
			parts$[i] = $(eachStep[i]);
		}

		var hidePart = function(which) { parts$[which].css('visibility', 'hidden'); };

		var reset = function() {
			// if ( inPlay ) { ask if they want to really stop ... }		// TODO
			for ( var i = 0; i < parts$.length; i += 1 ) {
				hidePart(i);
			}
			act = 0;
			inPlay = false;
		};

		// pass in 
		var doTry = function(event) {
			var outputStr = "guess : " + event["guess"];
			outputStr += "<br>id : " + event["id"];
			outputStr += "<br>misses : " + event["misses"];
			outputStr += "<br>playerId : " + event["playerId"];
			outputStr += "<br>progress : " + event["progress"];
			outputStr += "<br>try : " + event["try"];
			
			my.status.set(outputStr);
		};



		var prerecorded = function(which) {
			data = my.db.get(which);

			// inPlay = true, ...

			for ( var i=0; i < data.length; i += 1 ) {
				doTry(data[i]);
			}
		};


		return {
			doTry: doTry,
			prerecorded: prerecorded
		};
	}();



    return my;
}(jQuery, hangmanTV || {}));