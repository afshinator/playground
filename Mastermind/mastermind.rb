# Mastermind

class MasterMind 
	def initialize(verbose = false)
		@order = 4				# how many pegs in a game
		@range = 6 				# for each peg, the # of possible values/colors of each
		@theAnswer = ""			# set either explicitly, or to a random value
		@candidates = []		# all the possible answers to each game, updated if computer is playing
		@board = [] 			# data struct to represent the state of the game board & feedback results
		@verbose = verbose 		# output stats about game engine
		@computerCodeBreaker = false		# Computer is CodeMaker be default
		puts("-----------------------")
		puts("Welcome to Master Mind.")
		puts("Game initialized with #{@range} colors represented as A to F,")
		puts("and #{@order} slots for the color pegs.")
		puts
		puts("Call the play() method with these options:")
		puts("   play           With no options : you as Codebreaker vs the computer.")
		puts("   play('v')      Verbose mode - insights into computers thinking about each step")
		puts("   play('CDAF')   Start a game as CodeMaker with code you passed in & watch computer go!")
		puts("   ")
		puts("   ")		
		puts("You can also type 'list' or 'answer' instead of guessing an answer...")
		puts("-----------------------")	
		puts("-----------------------")			
	end


	def initCandidates			# genericize to order, range other than the default
		str = "    "

		('A'..'F').to_a.each { |first|
			str[0] = first
			('A'..'F').to_a.each { |second|
				str[1] = second
				('A'..'F').to_a.each { |third|
					str[2] = third
					('A'..'F').to_a.each { |fourth|
						str[3] = fourth
						@candidates << { :val => str.clone, :eligible => true }
					}
				}
			}
		}
	end

	# The easiest way I found to decide what the next move of the computer would be...
	# Compare the last guess against every possible combination of answers to see if the
	# feedback value matches.  
	# If it does match, then its still in the game. Else mark it as not viable.
	def screenCandidates(theGuess, criteria)
		@candidates.each { |e| e[:eligible] = false unless feedback(e[:val], theGuess) == criteria }
	end


	# no parameter, it returns the number of viable candidates at this time
	# true parameter, it returns an array of viable candidates
	def eligibleCandidates(listThem = false)
		results = []
		results = @candidates.select { |e| e[:eligible] }
		return (listThem == false) ? results.count : results
	end


	# Default is to set the answer to a random string that is @order characters long,
	# unless there is a parameter to explicitly set the value.
	def setTheAnswer(default = "random")
		value = []
		lastCharInRange = (65 + @range).chr
		@order.times { value << ('A'..lastCharInRange).to_a.at(rand(6)) }
		@theAnswer = (default == "random") ? value.join : default
	end


	# I like showing the most recent row flowing down rather in this command line implementation
	def showBoard
		i = 0
		while i < @board.length
			print "#{i + 1} : "
			@board[i][:val].split('').each { |c|
				print c + " "
			}
			print "  " + @board[i][:f] + "\n"  				# print feedback too
			i += 1
		end
		puts
	end


	# Given the correct answer, return string representing black & white pegs rating the guess.
	# 	b for black peg : a right color/value in the right place somewhere
	#   w for white : a right color but in the wrong place
	def feedback(answer, guess)
		result = []
		for i in (0..answer.length-1)
			if guess[i] == answer[i]
				result << "b"
			elsif answer.include? guess[i]
				result << "w"
			end
		end

		return result.join
	end	



	# Based on whether user is codemaker or codebreak, get next guess.
	# This is where my algorithm is stupid: 
	#  				I just return a random guess from list of viable candidates!
	# 				But the initial screening is so strong that it still  finds an answer quick!
	def getNextGuess
		pool = []
		if @computerCodeBreaker
			pool = eligibleCandidates(true)
			return pool[rand(pool.length)][:val]	# Choose a random guess from remaining candidates
		else
			puts("Your guess: ")
			return gets.upcase.chomp
		end
	end


	# play() takes a variety of parameters spelled out in the initialize method above.
	def parsePlayParams(p)
		passedInAnswer = ""
		unless p.length < 1 then
			@verbose = true if p.include?("v") || p.include?("-v")

			# Look for "XXXX" type string passed in and save it
			passedInAnswer = p.select { |e| e.length == 4 }.join		# if a game pattern string was passed in			
		end

		if passedInAnswer != ""
			puts "playing as CodeMaker : #{passedInAnswer.upcase}" 
			@computerCodeBreaker = true
			setTheAnswer(passedInAnswer.upcase)
		else
			setTheAnswer()
		end
	end


	# PlayGame(params)
	#  	no parameter - Computer picks random answer, user is codebreaker.
	#   "XXXX" parameter - Computer is codebreaker and plays game cracking code you gave.
	def play(*p)
		parsePlayParams(p)
		turn = 0
		no_winner_yet = true

		initCandidates								# build out list of possible answers
		puts("Starting off with " + eligibleCandidates.to_s + " possible answers.") if @verbose

		while turn < 12 && no_winner_yet
			nextGuess = getNextGuess
			if nextGuess == "ANSWER" 							# cheat mode!
				puts "+++++ +++++ ++++++ Answer:" + @theAnswer 
			elsif nextGuess == "LIST"
				eligibleCandidates(true).each { |c| print c[:val] + "   " }
				puts
			else
				@board[turn] = { :val => nextGuess, :f => feedback(@theAnswer, nextGuess) }
				screenCandidates(nextGuess, @board[turn][:f])	# weed out contendors based on feeback
				
				no_winner_yet = false if @board[turn][:f] == "bbbb"
				turn += 1
				showBoard
				puts("Number of remaining candidates: "+ eligibleCandidates.to_s) if @verbose
			end
		end
		if no_winner_yet
			puts "Lost cause. Answer is #{@theAnswer}"
		else
			print "Congrats.  " unless @computerCodeBreaker
			puts "Solved in #{turn} turns."
		end
	end

end