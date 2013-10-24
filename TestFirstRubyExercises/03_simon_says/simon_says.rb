# # Simon Says
# Afshin Mokhtari

def echo(str)
  str
end


def shout(str)
  str.upcase
end


def repeat(str, reps=2)
  # Make an array with the string, multiply occurance of string by reps, turns it all into a space separated string
  ( [str] * reps ).join(' ') 
end


def start_of_word(str, i)
  str[0..i-1]
end


def first_word(str)
  str.split(' ')[0]
end



def titleize(str)
  except = ["and", "the", "over"]
  arr = str.split(' ')

  arr.each { |w|
    w.capitalize! unless except.include?(w)
  }

  arr[0].capitalize!    # always capitalize first word in sentence regardless
  arr.join(' ')
end