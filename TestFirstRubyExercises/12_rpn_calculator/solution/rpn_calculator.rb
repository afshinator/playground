# Afshin Mokhtari

class RPNCalculator 
  def initialize
    @stack = [0]    
  end


  def value
    @stack.last
  end


  def pop
    n = @stack.pop
    raise "calculator is empty" if n.nil?  # unless n
    return n
  end


  def push(n=@value)  
    @stack.push(n)
  end


  def plus
    first = pop
    second = pop
    push(first + second)    
  end


  def minus
    subtractant = pop
    push(pop - subtractant)    
  end


  def divide
    divisor = pop
    push(pop.to_f / divisor.to_f)    
  end


  def times
    push(pop * pop)    
  end


  def tokens(str)
    operators = [ '+', '-', '*', '/' ]

    str.split(' ').map { |e| 
      e = operators.include?(e) ? e.to_sym : e.to_i
    }
  end


  def evaluate(str)
    nonNumbers = [ '+', '-', '*', '/', ' ' ]

    len = str.length
    i = 0
    while i < len 
      if nonNumbers.include?(str[i]) 
        case str[i]
        when '+' then plus
        when '-' then minus
        when '*' then times
        when '/' then divide
        else
          #do nothing in case of space character
        end
      else
        # number encountered, push it on stack
        push(str[i].to_i)
      end
      i += 1
    end
    value
  end

end

