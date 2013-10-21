// sketchpad.js - 
//      by Afshin Mokhtari
//
// JS/Jquery Mini-Project from
// http://www.theodinproject.com/curriculum/web_development_basics/web_programming_basics/front_end_basics/project_js_jquery.md


$(function() {
	var dimension = 9;													// default grid size
	var boxSize = Math.floor( ( 960 - ( dimension * 2) ) / dimension ); // pixel width of each box given # of boxes per row/column
	var container$ = $('#container');				// Since we need to keep referencing this, cache the selection here once and for all.
	var boxes$;

	var catCategories = ['hats', 'space', 'funny', 'sunglasses', 'boxes', 'caturday'];		// random cat images not working yet.

	$(":button").click(function() {
		var whichButton = parseInt($(this).attr("value"),10);		// Use tag from HTML to determine which button was pressed
		dimension = prompt('How many boxes? (or RETURN for default)');

		if ( dimension === "" || dimension < 1 || dimension > 128 ) {
			console.log(dimension);
			dimension = 9;
		}
		new_grid(dimension);
		handle(whichButton);
	});


	var handle = function(which) {
		function get_random_color() {
			return '#'+Math.floor(Math.random()*16777215).toString(16);
		}

		boxes$.hover(
			function() {
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
							$(this).fadeTo(800,1);
						});
						break;
					case 5:									// Button 5: Random cat picture!
						var rnd = Math.random() * catCategories.length;
				//		var apiStr = 'src="http://thecatapi.com/api/images/get?&category=' +  catCategories[rnd] + '&format=src&type=gif&size=small"';
						var apiStr = 'src="http://thecatapi.com/api/images/get?&format=src&type=gif&size=small"';

						$(this).append('<img width="' + boxSize + '" height="' + boxSize + '" ' + apiStr + ' >');
						break;
				}
			} /* ,			// If you want to do something on mouse-out, put it here...
			function() {
				switch(which) {
					case 1:
						// $(this).removeClass('simpleColor');
						break;
					case 5:
						// $(this).empty();
				}
			} */
		);
	};



	var new_grid = function(size) {
		var divsToInsert = [];
		boxSize = Math.floor( ( 960 - ( size * 2) ) / size );

		container$.html('');		// Empty out container. Would .empty() be faster or slower?

		// Its faster to put all the html into an array, call join, and append once at the end rather than
		// simply putting the append inside the for loop.
		for ( var i = 0 ; i < size * size; i += 1) {
			divsToInsert[i] = "<div class='box' style='width:" + boxSize + "px; height:" + boxSize+"px;'></div>";
		}

		container$.append(divsToInsert.join(''));    // http://www.learningjquery.com/2009/03/43439-reasons-to-use-append-correctly
		boxes$ = $(".box");			// cache the selection of all boxes creted for the hover event handlers
	};

	// First time page is loaded, build a default dimension grid and use the first the button options
	new_grid(dimension);
	handle(1);
});