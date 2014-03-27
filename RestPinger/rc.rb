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

	attr_reader :where

	def initialize(options = {})
		@options = options

		if @options != {}
			run
		else
			puts 'RESTPinger Options:'
		end

	end

	def run
		parseCommandLine
#		response = RestClient.get @where, :params => {:prefix => 'search?q=', :baz => 'qux'}
		response = RestClient.get @where

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

		if @options.is_a? String			
			@where = google + prefix + @options 
			#puts 'Search string:' + @where
		else
			# Get defaults from cmd-line parameters, or set defaults
			@search = @options[:search] || true				# whether to search or not
			@what = @options[:what] || "whatever"			# what to search for
			@where = @options[:host] || google			 	# hostname to ping
			@verb = @options[:verb] || "GET"					# POST, PUT, ...
			@prefix = @options[:prefix] || prefix			# search prefix for url

			@puts = @options[:puts] || false					# whether to puts output

			@where = @where + @prefix + @what  # when object is passed in instead of a string, @what holds what to search for
		end

	end
end

