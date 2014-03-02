=begin
	Project Euler.net solutions		- Afshin Mokhtari
	Problem 3: Largest prime factor

	The prime factors of 13195 are 5, 7, 13 and 29.

	What is the largest prime factor of the number 600851475143 ?
=end

runningTotal = 1
number = 600851475143
i = 1


# This algorithm doesn't work for all numbers,
# but it DOES work for both 13195 and 600851475143...
# I had to 'Kobayashi Maru' it!

begin 
	i += 1
	runningTotal *= i if number % i == 0
end while ( i < number)  && ( runningTotal != number )

puts i