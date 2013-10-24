# Afshin Mokhtari

class Temperature
  # Probably more correct to make these instance vars accessible via 
  # protected methods rather than these accessors.
  attr_accessor :in_fahrenheit, :in_celsius
  
  def initialize args
    if args[:f] 
      @in_fahrenheit = args[:f]
      @in_celsius = self.class.ftoc(args[:f]) #(args[:f] - 32.0) * 5.0/9.0
    end

    if args[:c]
      @in_celsius = args[:c]
      @in_fahrenheit = self.class.ctof(args[:c]) #(args[:c] * 9.0/5.0) + 32.0
    end 
  end


  # class methods, can be called by instances
  def self.ftoc(f)
    (f - 32.0) * 5.0/9.0
  end

  def self.ctof(c)
    (c * 9.0/5.0) + 32.0
  end


  # factory pattern: use class methods to instantiate 
  def self.from_celsius(c)
    new :c => c   # construct a new Temperature object, passing it (:c => c)
  end

  def self.from_fahrenheit(f)
    new :f => f
  end

end


# Celcius is a subclass of Temperature, take a simple value instead of symbol/val pair
class Celsius < Temperature
  def initialize(c)
    super :c => c     # call ancestor class, passing arg in a format it knows how to deal with
  end
end


class Fahrenheit < Temperature
  def initialize(f)
    super :f => f
  end
end


