# Ruby OOP Project 1: Tic Tac Toe
# http://www.theodinproject.com/courses/ruby-programming/lessons/oop
#
# Afshin Mokhtari


class TicTacToe

  def initialize
    @board = []                     # Data structure for tic tac toe board
    9.times { @board << " "}        # initially filled with 9 empty spaces    
    @turn = 0                       # Whose turn is it?  Even is X, Odd is O

    winsAcrossMiddle = [ [0, 4, 8], [3, 4, 5], [1, 4, 7], [2, 4, 6] ]
    winsOnEdges = [ [0, 1, 2], [0, 3, 6], [6, 7, 8], [2, 5, 8] ]
    @@winCases = winsAcrossMiddle + winsOnEdges             # Class variable

    puts "Tic Tac Toe!  call playGame(numbers of players, who is first)"
  end

  def board
    @board.join                     # expose @board as a string for tests
  end


  def turn
    @turn % 2 == 0 ? "X" : "O"      # Whose turn it is depends on whether @turn is odd or even
  end


  def boardNotFull?
    return @board.include?(" ")     # If board has at least one ' ', it is not full
  end


  # Returns who starts the game, X or O;  changes @turn as a side-effect
  def whoStarts(startWith)          
    if startWith == "none"          # default parameter for playGame() means who goes first is random
      @turn = rand(2)+1
    else                            # starter was specified, set @turn appropriately
      @turn = (startWith.upcase == "X") ? 2 : 1
    end
    return turn
  end


  def emptySpots                    # Returns a string of empty spots in the board
    result = ""
    @board.each_index { |i| result += (i+1).to_s+", " if @board[i] == " " }
    return result
  end


  def showBoard                     # Show the Tic Tac Board
    puts
    puts " #{@board[0]} | #{@board[1]} | #{@board[2]}"
    puts "-----------"
    puts " #{@board[3]} | #{@board[4]} | #{@board[5]}"
    puts "-----------"
    puts " #{@board[6]} | #{@board[7]} | #{@board[8]}"
    puts
  end


  # Kicks off the game, optional parameter for who starts game: X or O
  def play(startWith = "none")
    print "According to coin toss, " if startWith == "none"
    puts "first player will be " + whoStarts(startWith)

    winCase = false
    while winCase == false && boardNotFull?     
      next_turn
      winCase = someoneWin?      
    end
    showBoard
    puts "Nobody won!" if !winCase && boardNotFull? == false
  end


  # If there is a winning placement, return the player who won
  # else return false;   
  # Side effects: The win is turned into uppercase in the board (for last showing)
  def someoneWin?
    player = nil
    @@winCases.each { |a|
      player = @board[a[0]]
      if (player != " ") && (@board[a[0]] == @board[a[1]]) && (@board[a[1]] == @board[a[2]])
        (0..2).each { |n| @board[a[n]].upcase! }
        puts "We have a WINNER! ----> " + player
        return player
      end
    }
    return false
  end


  def next_turn
    who = turn                    # get whose turn it is
    showBoard                     # show board 
    print who + "'s turn. "       # display whose turn it is

    print "Choose from " + emptySpots + " :"

    choice = ""
    while choice == "" do
      choice = gets.chomp.to_i
      if @board[choice - 1] != " "
        puts "There is already a #{@board[choice - 1]} there!, choose another: "
        choice = ""
      end
    end

    @board[choice - 1] = turn.downcase     
    @turn += 1                  # TODO: use turn to decide where computer will move in game vs. computer
  end

end