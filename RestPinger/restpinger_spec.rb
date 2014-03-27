require './spec_helper'
require 'rest-client'
require './rc'

describe 'RestPinger'  do
	
	it 'Prints out program options when nothing on command line' do
      rc = RestPinger.new

			pending # expect(rc).to include("Options")
	end


	it 'defaults to searching google with passed in string' do
		rc = RestPinger.new("random")

		# 	why cant I use  expect(@where) ?
		expect(rc.where).to eq("http://www.google.com/search?q=random")
	end


	it 'lets you choose a different search engine' do
		rc = RestPinger.new( { :host => "http://www.ask.com/", :prefix => "web?q=", :what => "blues" } ) 

		expect(rc.where).to eq("http://www.ask.com/web?q=blues")
	end


	it 'outputs returned headers for google if command line has {:puts => "true"}' do
		rc = RestPinger.new( {  :puts => "true" } ) 

		expect(rc.where).to eq("http://www.google.com/search?q=whatever")
	end
end