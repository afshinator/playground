# Hangman, being broadcast to all the world
#
# by Afshin Mokhtari

require "yaml"
# require "firebase"
require "bigbertha"


class Hangman


	# Options
	#		:verbose => true 			To get debugging/interesting output
	#  		:dict => "fname.txt"		Dictionary filename, defaults to "5desk.txt"
	# 		:answer => "5to12charword"  Set your own word instead of relying on random word
	#  		:turnLimit => number		How many turns before game is over, defaults to 10
	#  		:debug => true				More verbose messages, sets :verbose to true too
	#  		:push => true				Send live updates of each turn to Firebase as an event, default true
	#  		:firebaseURI 				firebase is our data-store in the cloud, default below
	# 		:id                         Used to namespace session in Firebase
	#  		:playerId => string 		Name of player (broadcast to frontend)
	#
	def initialize(options = {})
		@options = options
		@turn = 0				# start state, no guess or guessProgress until after this turn
		@answer = ""			# The word that is trying to be guessed
		@guess = " "			# Next guess, one character
		@guessProgress = ""		# placeholder for guess showing it length & whats been guessed correct so far
		@misses = ""			# What has been tried and is not in the answer 

		@loaded_game = false	
		@saved_game = false
		@published_game = false	# Sent data to Firebase ;-)

		@dict_fname = @options[:dict] || "5desk.txt"
		@dictionary = []

		@options[:verbose] = true if @options[:debug]
		@options[:turnLimit] ||= 10
		@options[:id] ||= Time.new.strftime("%Y-%m-%d_%H:%M:%S")
		@options[:push] = true if @options[:push].nil?					 # not saved as part of game session
		@options[:firebaseURI] ||= 'https://hangman-game.firebaseio.com' # not saved as part of game session
		
		@gameState = { :id => @options[:id],
						:turns => [],  				# see update_gameState to see whats in this array
						:answer => "" , 
						:turnLimit => @options[:turnLimit] }

		init_broadcast if @options[:push]

		return @options
	end


	def init_broadcast
		# Firebase.base_uri = @options[:firebaseURI]
		@ref = Bigbertha::Ref.new( @options[:firebaseURI] )
	end


	# Load the dictionary, store words between 5-12 characters long
	def loadDictionary
    fd = File.open(@dict_fname)    # if file not found, error on this line
		holder = []
		holder = fd.read().split(' ').select do |w|
			w.length > 4 && w.length < 13
		end
		puts "\n// Dictionary loaded, #{holder.length} words saved." if @options[:verbose]
		fd.close
		return holder
	end


	def loadGame(fname = "saved.yaml")
  		fd = File.open(fname)
  		yaml = fd.read()
  		fd.close
  		@gameState = YAML::load(yaml)
		puts "\n** Game loaded.\n"

		@answer = @gameState[:answer]
		@turn = @gameState[:turns][-1][:misses].length+1
		@guessProgress = @gameState[:turns][-1][:progress]
		@misses = @gameState[:turns][-1][:misses]
		@options[:turnLimit] = @gameState[:turnLimit]
		@options[:id] = Time.new.strftime("%Y-%m-%d=%H:%M")		# assign new id to differentiate it from previous session
		puts "//\n// answer: #{@answer}, turn:#{@turn}\n" if @options[:verbose]
		show_turn
	end

	def saveGame(fname = "saved.yaml")
		yaml = YAML::dump(@gameState)
		File.open(fname, "w") do |f|
			f.puts yaml
		end
		puts "** Game saved.\n"
	end


	def show_turn(which = @turn)
		puts
		puts "Wrong guesses allowed: #{@options[:turnLimit] - which}"
		print "Your correct guesses  : "
		@guessProgress.each_char { |c| print c, ' ' }
		puts
		puts "// Answer is #{@answer}" if @options[:verbose] && which == 0
		print "Your Misses           : "
		@misses.each_char { |c| print c.downcase, ', '}
		puts
	end


	def ask
		userInput = " "

		while (userInput = gets.chomp.upcase)[0] == "-" || ('A'..'Z').include?(userInput) == false
			puts "** Answer is #{@answer}" if userInput == "-ANSWER"	# cheat mode
			saveGame if userInput == "-SAVE"				# Save a game
			loadGame if userInput == "-LOAD"				# Load a game

			print "Next guess ?"
		end

		return userInput
	end


	def get_next_guess
		print "==> Your next guess ? "
		@guess = " "
		while !('A'..'Z').include?(@guess) 
			@guess = ask
			@guess = @guess[0]		
			if @misses.include?(@guess) || @guessProgress.include?(@guess)
				print "\n!!! #{@guess} already guessed! "
				@guess = " "
				print "Next guess ?"
			end
		end
	end

	def handle_broadcast(try)
		today = Time.new.strftime("%Y-%m-%d")

		if try == 1
			@ref.child(today).child(@answer)
		end

		state_to_broadcast = @gameState[:turns].last
		state_to_broadcast[:id] = @options[:id]
		state_to_broadcast[:playerID] = @options[:playerId] || "anon"
		# @ref.push( state_to_broadcast ) if @options[:push]
		@ref.child(today).child(@answer).child("#{try}").set(state_to_broadcast)
	end

  
	def update_gameState
		try = @gameState[:turns][-1] ? @gameState[:turns][-1][:try] : 0
		@gameState[:turns] << { :try => try + 1, 
								:progress => @guessProgress.clone, 
								:guess => @guess, 
								:misses => @misses.clone }

    	handle_broadcast(try) if @options[:push]
    
		if @options[:debug] 
			# puts ">> Firebase success? response to push : #{response.success?} #{response.code}" if @options[:push]
			@gameState[:turns].each { |e| puts e }
			puts
		end	
	end


	def process_guess
		occurance_index = 0
		found_flag = false
		while occurance_index = @answer.index(@guess, occurance_index)			
			@guessProgress[occurance_index] = @guess
			found_flag = true
			occurance_index += 1
		end

		unless found_flag
			@misses << @guess
			@turn += 1
		end

		return @guessProgress == @answer
	end


	def play
		@dictionary = loadDictionary
		@answer = ( @options[:answer] || @dictionary.at(rand(@dictionary.length)) ).upcase
		@gameState[:answer] = @answer
		@guessProgress = '_' * @answer.length			# fast way to build a string out

		win = false

		# Main program loop
		while win == false && @turn < @options[:turnLimit]
			show_turn
			get_next_guess
			update_gameState		
			win = process_guess
		end
		show_turn
		puts "\n!!! You win sunshine!" if win
		puts "\n!!! Too late Kimosabe! The word was #{@answer}" unless win
	end


end
