# Ruby Working with Files and Serializing Data Project: Hangman
Details:  [http://theodinproject.com/](http://www.theodinproject.com/courses/ruby-programming/lessons/files-and-serialization)


To run my code,

 - To see a live or pre-recorged game, run the front-end... **pull index.html into your browser

 - For the backend (which runs a live game), you need to run the ruby code...

 - you don't need a firebase account yourself, the code uses mine - for now.
 - First the backend instructions : the ruby hangman game generator requires

 --  gem install firebase

 --  [ BigBertha - Ruby wrapper for the Firebase backend API](http://derailed.github.io/bigbertha/)

Then after you've pulled down the code, under the game directory, 
- go in irb:

>load "hangman.rb"

then, 
>h = Hangman.new({ playerId => "Your Name"});

	#	Here are all the options for .new(): 
	#		:verbose => true 			To get debugging/interesting output
	#  		:dict => "fname.txt"		Dictionary filename, defaults to "5desk.txt"
	# 		:answer => "5to12charword"  Set your own word instead of relying on random word
	#  		:turnLimit => number		How many turns before game is over, defaults to 10
	#  		:debug => true				More verbose messages, sets :verbose to true too
	#  		:push => true				Send live updates of each turn to Firebase as an event, default true
	#  		:firebaseURI 				firebase is our data-store in the cloud, default below
	# 		:id                         Used to namespace session in Firebase
	#  		:playerId => string 		Name of player (broadcast to frontend)


- to start the game and start broadcasting as you play automatically:
>h.play

<hr>
Created by [Afshin Mokhtari](http://www.github.com/afshinator)