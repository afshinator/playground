// sketchpad.js - 
//      by Afshin Mokhtari
//
// JS/Jquery Mini-Project from
// http://www.theodinproject.com/curriculum/web_development_basics/web_programming_basics/front_end_basics/project_js_jquery.md


$(function() {
	var dimension = 16;								// default box size
	var boxSize = Math.floor( 960 / dimension );	// pixels per box

	var container$ = $('#container');				// Since we need to keep referencing this, cache the selection here once and for all.
	var boxes$;										// Will be selection of all boxes created, reset everytime a new grid is created 
	var apiStr = 'src="http://thecatapi.com/api/images/get?&format=src&type=gif&size=small"';	// Cat images api


	$(":button").click(function() {
		var whichButton = parseInt($(this).attr("value"),10);		// Use value tag from HTML for which button was pressed
		dimension = prompt('How many boxes? RETURN for default)');

		if ( isNaN(dimension)  || dimension < 1 || dimension > 128 ) {
			dimension = ((whichButton === 5) ? 3 : 16);		// default for images is 3x3 instead of 16x16
		}
		new_grid(dimension);
		handle(whichButton);
	});


	var handle = function(which) {
		function get_random_color() {	// obfuscation or beautifully terse?
			return '#'+Math.floor(Math.random()*16777215).toString(16);
		}

		boxes$.hover(
			function() {				// What to do on mouse inside a box
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
						$(this).mouseleave(function(){
							$(this).fadeTo(600,1);
						});
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
			},
			function() {	// 2nd parameter to hover(), stuff to do on mouse-out of a box
				switch(which) {
					case 1:
						// $(this).removeClass('simpleColor');
						break;
					case 5:
						// $(this).empty();
						$(this).removeClass('rotate15');
						break;
				}
			}
		);
	};



	var new_grid = function(size) {
		var divsToInsert = [];
		boxSize = Math.floor( 960 / size );

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
		boxes$ = $(".box");			// cache the selection of all boxes created for the hover event handlers; slow!
	};

	// First time page is loaded, build a default dimension grid and use the first the button options
	new_grid(dimension);
	handle(1);
});