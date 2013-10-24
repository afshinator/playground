# # Odin Project - Ruby >> Basic Ruby >> Project: Building Blocks & Advanced Building Blocks
# Project solutions - Afshin Mokhtari
#
# http://www.theodinproject.com/curriculum/ruby/basic_ruby/project_building_blocks.md
 
#
# Building Blocks Warmup: Word Counter    http://www.codecademy.com/courses/ruby-beginner-en-693PD/0/1
def histogram(textString)
	frequencies = Hash.new(0)		# parameter defines the default value 
	words = textString.split(" ")			# split string up into array of words

	# for each word, add it to hash, increasing frequency count (whose default was 0)
	words.each { |w| frequencies[w] += 1 } 
	frequencies = frequencies.sort_by {|a, b| b }	# sort by hash values
	frequencies.reverse!							# make highest values first

	frequencies.each { |word, frequency| puts word + " " + frequency.to_s }
end



#
# Building Blocks Project 1: Caesar Cipher 

$nums = (0..9).to_a		# Made these global so they are created once, instead of putting them in encode
$lowr = ('a'..'z').to_a
$uppr = ('A'..'Z').to_a



def caesar_cipher(str, shift)
	letters = str.split('') 		# get array of each character
	converted = letters.map { |l| encode(l, shift) }
	converted.join
end

# Encode just one charcter, return it
def encode(ch, shift)
	if $lowr.include?(ch)		# not the most effiecient, but easy to read
		i = $lowr.index(ch)
		j = ( i + shift ) % 26
		return $lowr[j]
	elsif $uppr.include?(ch)
		i = $uppr.index(ch)
		j = ( i + shift) % 26
		return $uppr[j]
	elsif ( ch.ord >=48 && ch.ord <= 57 )	# a number , checking this way because non-number.to_a == '0'
		i = $nums.index(ch.to_i)
		j = ( i + shift ) % 10
		return $nums[j].to_s		
	else
		return ch 			# leaves every other possible character unchanged
	end
end


#
# Building Blocks Project 2: Stock Picker
def stock_picker(arr)
	highestGain = 0
	buyDay = 0
	sellDay = 0

	arr.each_index do |i|
		biggestGainDayFrom = findDayWithHighestGainFrom(i, arr)
		if arr[biggestGainDayFrom] - arr[i] > highestGain
			highestGain = arr[biggestGainDayFrom] - arr[i]
			buyDay = i
			sellDay = biggestGainDayFrom
		end
	end
	return [buyDay,sellDay]
end

# for stock_picker
def findDayWithHighestGainFrom(day, arr)
	highestGain = 0
	highestGainDay = day

	for i in day+1..arr.length-1 
		difference = arr[i] - arr[day]
		if difference > highestGain
			highestGain = difference
			highestGainDay = i
		end
	end
	return highestGainDay
end



#
# Building Blocks Project 3: Substrings
def substrings(word, dictionary)
	result = Hash.new(0)			# constructor passed a 0 makes 0 the default return value for non-exist keys

	dictionary.each do |w|
		for i in 0..word.length-1
			result[w] += 1 if word[i..word.length-1] == w 				
		end
	end
	result
end

