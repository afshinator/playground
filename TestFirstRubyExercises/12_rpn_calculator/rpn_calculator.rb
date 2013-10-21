
class RPNCalculator 
  def initialize
    @stack = []
    @value = 0
  end


  def value
    @value
  end


  def pop
    n = @stack.pop
    raise "calculator is empty" if n.nil?
    return n
  end


  def push(n=@value)  
    @stack.push(n)
  end


  def plus
    first = pop
    second = pop
    @value = first + second    
    push # @stack.push(@value)            # put result back on top
  end


  def minus
    subtractant = pop
    @value = pop - subtractant
    push                    
  end


  def divide
    divisor = pop
    @value = pop.to_f / divisor.to_f
    push
  end


  def times
    @value = pop * pop      
    push
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
      # puts "--- #{i} -- #{str[i]} === #{@value} -- #{@stack}"
      if nonNumbers.include?(str[i]) 
        case str[i]
        when '+' 
          plus
        when '-' 
          minus
        when '*' 
          times
        when '/' 
          divide
        else
          #do nothing in case of space character
        end
      else
        # number encountered, push it on stack
        push(str[i].to_i)
      end
      i += 1
    end
    @value
  end

end

