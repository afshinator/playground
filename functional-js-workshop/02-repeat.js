// Instruction mention that recursive solution is preferred...
function repeat(operation, num) {
	if ( num < 1 ) return;
	operation();
	repeat( operation, num - 1 );
}

// Do not remove the line below
module.exports = repeat