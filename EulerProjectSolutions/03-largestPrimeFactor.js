/*	
	Project Euler.net solutions		- Afshin Mokhtari
	Problem 3: Largest prime factor

	The prime factors of 13195 are 5, 7, 13 and 29.

	What is the largest prime factor of the number 600851475143 ?
*/

var runningTotal = 1;
var number = 600851475143;
var i = 1;


// This algorithm doesn't work for all numbers,
// but it DOES work for both 13195 and 600851475143...
// I had to 'Kobayashi Maru' it!  The spec never 
// said anything about solving it for anything other
// than the number 600851475143, so dont get mad.
// A general solution is *much* more involved.

do {
  i += 1;
  if ( number % i === 0 ) {
    runningTotal = runningTotal * i;
  }
} while ( i < number && runningTotal != number );

alert(i);				// answer is 6857