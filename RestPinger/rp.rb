require 'rest-client'

# Look at 'Query parameters' section in
# https://github.com/rest-client/rest-client

# Usage:
#
# >h = RestPinger.new()                                               # default bahivour : print program options
# >h.run("foo")                                                       # default google search for "foo"
# >h.run({search => "foo" })                                          # search for "foo"
# >h.run({verb => "POST", host =>"http://example.com/resource"})      # default is GET; POST, DELETE
#

class RestPinger

  attr_reader :urlToSend

  def initialize(options = {})
    @options = options

    if @options != {}
      run
    else
      puts "--------------------------------RESTPinger Instructions"
      puts "- from IRB, 'load restpinger.rb' "
      puts
      puts "> rp = RestPinger.new       # to get these instructions"
      puts '> rp = RestPinger.new("a search term")  # search Google'
      puts
      puts 'To search elsewhere :'
      puts '> rp = RestPinger.new({ :host => "http://www.ask.com/", :prefix => "web?q=", :what => "blues")'
      puts
      puts 'Mimick a Rails client :'
      puts '> rp = RestPinger.new({ :host => "", :resource => "posts", :id => "2"} )'
      puts
      puts 'Other key/val options:'
      puts '  puts => true/false, default: true;         print response code, header, and content'
      puts '  headerOnly => true/false, default:true;    print the header only'
      puts '  rails => true/false,  default:false;       mimick a rails request'
      puts '  verb => GET/POST/...  default:GET;         HTTP verb to sent'
      puts '  TODO: more to come'
      puts '  '
      puts "--------------------------------"
      puts
    end
  end



  def run
    parseCommandLine

    if (@options.is_a? String) || @verb == 'GET'
      response = RestClient.get @urlToSend
    elsif @verb == 'POST'
      response = RestClient.post @urlToSend
    elsif @verb == 'DELETE'
      response = RestClient.delete @urlToSend
    end

    if @puts == true
      puts '------------> Returned response code:' + response.code.to_s
      puts '------------> Header start'
      puts response.headers
      puts '------------> Header End'
    end 

    if ( @puts == true && !@headerOnly )
      puts '------------> Response start'      
      puts response.to_str
      puts '------------> Response end'      
    end

    # return response.code

  end



  private
  def parseCommandLine
    prefix = "search?q="
    google = "http://www.google.com/"
    myRailsBlog = "http://blackwater-bay-rails-75387.usw1.nitrousbox.com/"

    # One string argument to object will do default google search
    if @options.is_a? String 
      @options.gsub!(/\s/, '-')        # replace spaces in search string with dashes
      @urlToSend = google + prefix + @options
      @puts = true
      @verb = 'GET'

      @headerOnly = true    # COMMENT THIS !!!!    

    # Else, should pass in an object with options key/val pairs  
    else
      @puts = ( @options[:puts] == false ) ? false : true # Whether to puts output
      @headerOnly = @options[:headerOnly] || false      # Whether to show just header, not response
      @verb = @options[:verb] || "GET"                  # HTTP verb to use, default to GET

      @rails = @options[:rails] || false                # rails option 
      @id = @options[:id] || ""

      if @rails 
        @where = @options[:host] || myRailsBlog
        @prefix = @options[:prefix] || '/posts'        
        @what = ""
      else
        @where = @options[:host] || google
        @prefix = @options[:prefix] || prefix
        @what = @options[:what] || "whatever"         # search term, what to search for
      end

      @urlToSend = @where + @prefix + @what 

      if !@id.empty?
        @urlToSend += ( '/' + @id )
      end
    end

    puts '------------> Final URL:' + @urlToSend
  end


end

