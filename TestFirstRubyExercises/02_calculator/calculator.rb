# 

def add(a,b)
  a + b
end

def subtract(a,b)
  a - b
end

def sum(arr)
  total = 0
  arr.each { |n| total += n }
  total
end

def multiply(*args)
  args.inject { |sum, n| sum * n }      # how u like me now?
end

def power(a,b)
  a ** b
end


def factorial(n)
  total = 1
  (2..n).each { |i| total = total * i }
  total
end

