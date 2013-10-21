
# in_words.rb
# Afshin Mokhtari, Oct 2013

# Modules can be included into multiple classes, 
# The last few test cases include huge numbers in the billions and trillions which are officially
# of class Bignum, not Fixnum; so putting this code in a module enables us to pull it into
# both classes so that the tests pass!

module InWords

  # Handles 2-digit numbers, in other words less than 100
  def smallWord(n)  
    names1 = [ 'zero', 'one', 'two', 'three', 'four', 'five', 
              'six', 'seven', 'eight', 'nine', 'ten',
              'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
              'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ]

    names2 = { 20 => 'twenty', 30 => 'thirty', 40 => 'forty', 50 => 'fifty',
              60 => 'sixty', 70 => 'seventy', 80 => 'eighty', 90 => 'ninety',
    }

    return names1[n] if n < 20      # Simplest case: n < 20

    # n is between 20 and 99
    how_many = n.div(10)            # how many multiples of 10, using integer division
    remainder = n % 10              # left over remainder, will be 0 to 9

    result = names2[how_many*10]    # get string of multiple of 10
    result = result + ' ' + names1[remainder] unless remainder == 0  # only add remainder if there is one

    return result
  end  # smallWord


  def bigWord(n, magnitude, label)
    result = wordify(n.div(magnitude))
    result += ' ' + label + ' '
    if n % magnitude != 0
      result += wordify(n % magnitude) 
    end

    return result
  end


  def wordify(n)
    return smallWord(n) if n < 100

    len = n.to_s.length
    return bigWord(n, 100, 'hundred').strip if len < 4   # between 100 and 999
    return bigWord(n, 1_000, 'thousand').strip if len < 7   # between 1000 and 999,999
    return bigWord(n, 1_000_000, 'million').strip if len < 10  # between 1,000,000 and 999,999,999
    return bigWord(n, 1_000_000_000, 'billion').strip if len < 13  # between 1,000,000,000 and 999,999,999,999
    return bigWord(n, 1_000_000_000_000, 'trillion').strip if len < 16  # between 1,000,000,000,000 and 999,999,999,999,999
  end


  def in_words
    return wordify(self)
  end

end  # module


class Fixnum
  include InWords
end

class Bignum
  include InWords
end