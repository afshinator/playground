require 'rest-client'

# Look at 'Query parameters' section in
# https://github.com/rest-client/rest-client

class RestPinger

# Usage:
#
# >h = RestPinger.new()																								# default bahivour : print program options
# >h.run("foo")																												# default google search for "foo"
# >h.run({search => "foo" })																					# search for "foo"
# >h.run({verb => "POST", host =>"http://example.com/resource"})			# default is GET; POST, DELETE
#

	attr_reader :where

	def initialize(options = {})
		@options = options

		run
	end

	def run
		parseCommandLine
		response = RestClient.get @where, :params => {:prefix => 'search?q=', :baz => 'qux'}

		puts response.code
		puts response.headers

		return response.code
	end


	private
	def parseCommandLine
		@search = @options[:search] || false
		@where = @options[:host] || "http://www.google.com/"
		@verb = @options[:verb] || "GET"
		@prefix = @options[:prefix] || "search?q="
	end
end

