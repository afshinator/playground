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
		var e$ = $('#status');
		var msg$ = $('#statusMsg');

		return {
			fadeIn: function() { e$.fadeIn(); },
			up : function(n) { e$.slideUp(n ? n : 1000); },
			down: function() {	e$.slideDown();	},
			msg	: function(str) { msg$.html(str); }
		};
	}();

	my.status.fadeIn();


	// menu is the vertical list of Hangings that can be watched,
	// it will also hold newly broadcast Hangings in the status sub-area
	var menu = function() {
		var e$;

		return {
			init : function() {
				function isNumber(n) {  return !isNaN(parseFloat(n)) && isFinite(n);  }
				e$ = $('#menuList');

				e$.on('click', "li", function() {				// upon menu click
					var whatWasClickedOn = $(this).text().toUpperCase();
					if ( isNumber(whatWasClickedOn[0]) ) {
						// dont do anything for now
						console.log( "not an option " + whatWasClickedOn );
					} else {
						console.log( whatWasClickedOn );		// TODO: launch viewing
						my.status.down();
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




	var catch_new_hanging = function() {
		/*
		firebaseRef.on('child_added', function(s) {
			// seems to fire twice after initial .value push
			// and doesnt fire when I need it to! So not using it.
			// console.log(" child_added" + s.val());
		});
		*/
		/*
		firebaseRef.on('child_changed', function(s) {
			// if a new top level key/val elt added, then new game
			var newHanging;

			for ( var i in Object.keys(s.val()) ) {
				if ( pastHangingNames.indexOf(i) === -1 ) {
					newHanging = i;
					console.log('++ Looks like a new game starting: ' + newHanging );
				}
			}
			console.log(s.val());
			console.log(Object.keys(s.val()));

						// if not then its an update to a current game
		});
		*/
	}();


    return my;
}(jQuery, hangmanTV || {}));