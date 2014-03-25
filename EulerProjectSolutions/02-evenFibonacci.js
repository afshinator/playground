/*	
	Project Euler.net solutions		- Afshin Mokhtari
	Problem 2: Even Fibonacci numbers

	Each new term in the Fibonacci sequence is generated by adding the 
	previous two terms. By starting with 1 and 2, the first 10 terms will be:

	1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ...

	By considering the terms in the Fibonacci sequence whose values do not 
	exceed four million, find the sum of the even-valued terms.
*/

var i = 1,				// The 1st two fib numbers
	j = 2;

var sum = 0;			// will hold final answer

var limit = 4000000;	// what to go up to

var temp;

do {
    if ( j % 2 === 0 ) {
        sum += j;
    }
    
    temp = i + j;
    i = j;
    j = temp;
    
} while ( j <= limit );

alert(sum);				// for 4,000,000 answer is 4613732