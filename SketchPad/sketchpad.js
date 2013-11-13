// sketchpad.js - 
//      by Afshin Mokhtari
//
// JS/Jquery Mini-Project from
// http://www.theodinproject.com/courses/web-development-101/lessons/javascript-and-jquery


$(function() {
	var dimension = 16;								// default box size
	var boxSize; // = Math.floor( 960 / dimension );	// pixels per box

	var container$ = $('#container');				// Since we need to keep referencing this, cache the selection here once and for all.
	var checkbox$ = $('input[name=borders]');		// Cache the checkbox too
	var boxes$;										// Will be selection of all boxes created, reset everytime a new grid is created 
	var apiStr = 'src="http://thecatapi.com/api/images/get?&format=src&type=gif&size=small"';	// Cat images api


	// Check the 'borders' checkbox; if checked, add css property for borders to be visible
	var borderCheck = function() {
		if ( checkbox$.is(':checked') ) {
			boxes$.css('border', '1px dotted yellow');
		} else {
			//boxes$.css('border', 'none');
			$("div.box").css('border', 'none');
		}
	};


	checkbox$.change( borderCheck );		// Checkbox event handler

	// Button clicks - make sure input is a valid, then redraw boxes based on input
	$(":button").click(function() {
		var whichButton = parseInt($(this).attr("value"),10);		// Use value tag from HTML for which button was pressed
		dimension = prompt('How many boxes? RETURN for default)');

		if ( isNaN(dimension)  || dimension < 1 || dimension > 128 ) {
			dimension = ((whichButton === 5) ? 3 : 16);		// default for images is 3x3 instead of 16x16
		}
		new_grid(dimension);
		handle(whichButton);
	});


	// Once boxes are drawn, deal with mouse-being in the area of each box based on
	// which button was pressed.
	var handle = function(which) {
		function get_random_color() {	// obfuscation or beautifully terse?
			return '#'+Math.floor(Math.random()*16777215).toString(16);
		}

		// Instead of a separate handler on each box, this .on handler waits till it bubbles up to 
		// the containing div, which then knows how to hand it off...
		container$.on("mouseenter", "div", function() {
			switch(which) {
				case 1:									// Button 1 : color change
					$(this).addClass('simpleColor');
					break;
				case 2:									// Button 2: a random color
					$(this).css("background-color", get_random_color());
					break;
				case 3:									// Button 3: lighten box more & more each time you pass over it
					var op = $(this).css("opacity");
					$(this).css("opacity", ( op > 0.1 ) ? ( op - 0.1 ) : op );
					break;
				case 4:									// Button 4: leave a trail!
					$(this).fadeTo(0,0);					// fadeTo(duration, opacity)
					// $(this).mouseleave(function(){	$(this).fadeTo(600,1);	});
					break;
				case 5:									// Button 5: Random cat picture!
					if ( $(this).html() === "" ) {		// If we havent hit this box before
						$(this).append('<img width="' + boxSize + '" height="' + boxSize + '" ' + apiStr + ' >');
						$(this).addClass('rotate15');
					} else {	// apply class for img rotation when mouse over image
						if (! $(this).hasClass('rotate15')) {
							$(this).addClass('rotate15');
						}
					}
					break;
			}
		});

		container$.on("mouseleave", "div", which, function() {
			switch(which) {
				case 4:
					$(this).fadeTo(600,1);
					break;
				case 5:
					$(this).removeClass('rotate15');
					break;
				default:
					break;
			}
		});
	};


	// Draw a new grid that is of dimension size * size.  
	var new_grid = function(size) {
		var divsToInsert = [];
		boxSize = Math.floor( 960 / size );

		container$.off();
		container$.html('');		// Empty out container. Would .empty() be faster or slower?

		container$.css('width', boxSize * size);	// Make container the size of one row, avoid a whole bunch of other issues.
		// Its faster to put all the html into an array, call join, and append once at the end,
		// rather than simply putting the append inside the for loop.
		for ( var i = 0 ; i < size * size; i += 1) {
			divsToInsert[i] = "<div class='box' style='width:" + boxSize + "px; height:" + boxSize+"px;'></div>";
			// In case you want to count the boxes in browser inspector, uncomment the line below, it'll put it in the data attribute
			// divsToInsert[i] = "<div class='box' data='" + i + "' style='width:" + boxSize + "px; height:" + boxSize+"px;'></div>";
		}

		container$.append(divsToInsert.join(''));    // http://www.learningjquery.com/2009/03/43439-reasons-to-use-append-correctly
		boxes$ = $("div.box");			// cache the selection of all boxes created for the hover event handlers; slow!
		borderCheck();
	};


	// First time page is loaded, build a default dimension grid and use the first the button options
	$('#loading_Msg').css('display', 'none');		// get rid of loading message.
	new_grid(dimension);
	handle(1);
});