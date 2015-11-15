function countWords(inputWords) {
	return inputWords.reduce( function( previousValue, currentValue ) {
		if ( previousValue[currentValue] ) {
			previousValue[currentValue]++;
		} else {
			previousValue[currentValue] = 1;
		}
		return previousValue;
	}, {} );
}



// Official Solution:
// 
// function countWords(arr) {
//   return arr.reduce(function(countMap, word) {
//     countMap[word] = ++countMap[word] || 1 // increment or initialize to 1
//     return countMap
//   }, {}) // second argument to reduce initialises countMap to {}
// }



module.exports = countWords