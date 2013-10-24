# # Timer

class Timer

  def seconds
    @secs
  end

  def seconds=(n)
    @secs = n 
  end

  def initialize()
    @secs = 0
  end

  def padded(n)
     return ( (n < 10) ? ("0" + n.to_s) : n.to_s )
  end

  def time_string
    padded( @secs/3600) + ":" + padded( (@secs/60)%60 ) + ":" + padded(@secs%60)
  end
end
