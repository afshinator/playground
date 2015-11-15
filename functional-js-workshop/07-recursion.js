function reduce(arr, fn, initial) {
	if ( arr.length < 1 ) return;

	var firstEltResult = fn( initial, arr[0], 0, arr ); // prev, curr, index, arr

	if ( arr.length === 1 ) {
		return firstEltResult;
	} else
		return reduce( arr.slice(1), fn, firstEltResult );
}


// 'Official' solution:


// function reduce(arr, fn, initial) {
//   return (function reduceOne(index, value) {
//     if (index > arr.length - 1) return value // end condition
//     return reduceOne(index + 1, fn(value, arr[index], index, arr)) // calculate & pass values to next step
//   })(0, initial) // IIFE. kick off recursion with initial values
// }

module.exports = reduce