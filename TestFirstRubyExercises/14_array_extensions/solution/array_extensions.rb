# Afshin Mokhtari

class Array
  def sum
    self.length == 0 ? 0 : self.reduce(:+) 
  end

  def square
    self.length == 0 ? self : self.map { |n| n*n }    
  end

  def square!
    sq = square
    self.clear.concat(sq)
  end

end
