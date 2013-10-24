# Afshin Mokhtari

class Dictionary
  def initialize
    @entries = {}   # Newly instantiated Dictionary gets an empty hash
  end

  def entries
    @entries
  end

  def keywords
    @entries.keys.sort
  end


  def add args
    # argument needs to be either key value by itself (a string), or key/val pair (hash), 
    # so not sure if checking type of argument is best ruby way to do this, but passes test!
    if args.kind_of?(Hash)        
      @entries.merge!(args)       # not sure if merge! is best way to add to hash
    else
      @entries.merge!(args => nil)
    end
  end


  def include? arg
    @entries.include?(arg)
  end


  def find arg
    results = {}

    @entries.each { |k,v| 
      results.merge!(k => v) if ( k[0..arg.length-1] == arg  )
    }
    results
  end


  def printable
    keywords.map { |kv| "[#{kv}] \"#{@entries[kv]}\"" }.join("\n")   
  end

end


