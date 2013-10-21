# # Array Extension
#
# # Topics
#
# * objects, methods, classes
# * reopening classes
#

class Array
  def sum
    return 0 if self.length == 0
    total = 0
    self.each { |n| total += n }
    return total
  end

  def square
    return self if self.length == 0
    result = []
    self.each { |n| result << n*n }
    return result
  end

  def square!
    sq = square
    self.clear.concat(sq)
  end

end
