require './spec_helper'
require 'rest-client'
require './rc'

describe 'RestPinger'  do
  context 'Basic command line options ' do 
    it 'when none, prints out program options' do
        rc = RestPinger.new

        pending # expect(rc).to include("Instructions")
    end


    it 'defaults to searching google with passed in string' do
      rc = RestPinger.new("random")

      #   why cant I use  expect(@where) ?
      expect(rc.urlToSend).to eq("http://www.google.com/search?q=random")
    end


    it 'lets you pass in hash to choose search engine, search term' do
      rc = RestPinger.new( { :host => "http://www.ask.com/", :prefix => "web?q=", :what => "blues" } ) 

      expect(rc.urlToSend).to eq("http://www.ask.com/web?q=blues")
    end


    it 'outputs returned headers for google if command line has {:puts => "true"}' do
      rc = RestPinger.new( {  :puts => "true" } ) 

      expect(rc.urlToSend).to eq("http://www.google.com/search?q=whatever")
    end
  end 

  context 'Mimicking a Rails app client' do
    it 'does a GET with a resource and id (a #show action)' do
      rc = RestPinger.new( { :host => "http://blackwater-bay-rails-75387.usw1.nitrousbox.com/", :resource => "posts", :id => "2" } )

      # test will fail if 404 is returned
    end
  end

end