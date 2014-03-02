/*	
	Project Euler.net solutions		- Afshin Mokhtari
	Problem 1: multiples of 3 and 5

	If we list all the natural numbers below 10 that are multiples of 3 or 5, 
	we get 3, 5, 6 and 9. The sum of these multiples is 23.

	Find the sum of all the multiples of 3 or 5 below 1000.	
*/

var i;						// iterator
var sum = 0;				// will hold the final answer
var limit = 1000;			// what to go up to

for ( i = 1; i < limit; i += 1 ) {
	if ( i % 3 === 0 || i % 5 === 0 ) {
		sum += i;
	}
}

alert(sum);					// when limit=1000, answer is 233168
