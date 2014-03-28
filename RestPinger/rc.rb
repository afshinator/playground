require 'rest-client'

# Look at 'Query parameters' section in
# https://github.com/rest-client/rest-client

# Usage:
#
# >h = RestPinger.new()																								# default bahivour : print program options
# >h.run("foo")																												# default google search for "foo"
# >h.run({search => "foo" })																					# search for "foo"
# >h.run({verb => "POST", host =>"http://example.com/resource"})			# default is GET; POST, DELETE
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
         puts "--------------------------------"
         puts
		end
	end



	def run
		parseCommandLine

		response = RestClient.get @urlToSend

		if @puts
			puts '-->Returned response code:' + response.code.to_s
			puts
			puts response.headers
			puts
		end

		return response.code

	end


	private
	def parseCommandLine
		prefix = "search?q="
		google = "http://www.google.com/"
      myRailsBlog = "http://blackwater-bay-rails-75387.usw1.nitrousbox.com/"

		if @options.is_a? String	# ("search term")
			@urlToSend = google + prefix + @options 
		else                       # ( { key => 'value' } )
         @verb = @options[:verb] || "GET"       # POST, PUT, ...
         @puts = @options[:puts] || false       # whether to puts output

         @resource = @options[:resource] || nil 

         if @resource != nil        # Mimick Rails client
            @where = @options[:host] || myRailsBlog      # hostname to ping              
            @resource = @options[:resource]
            @id = @options[:id]

            @urlToSend = @where + @resource + '/' + @id  # TODO: for now, a GET to resource with ID
         else                       # Defaul search options
            @where = @options[:host] || google           # hostname to ping            
            @what = @options[:what] || "whatever"        # search term, what to search for
            @prefix = @options[:prefix] || prefix        # search prefix for url
            @urlToSend = @where + @prefix + @what        # build search string
         end
		end
	end

end

