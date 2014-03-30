require './spec_helper'
require 'rest-client'
require './rp'

describe 'RestPinger'  do
  context 'Doing normal search ' do 
    
    it 'Prints out program instruction if no parameters passed in' do
        rc = RestPinger.new

        pending # expect(STDOUT).to include("Instructions")
    end


    it 'Defaults to searching google if passed parameter is one string' do
      rc = RestPinger.new("random")

      expect(rc.urlToSend).to eq("http://www.google.com/search?q=random")
    end


    it 'lets you pass in hash to choose search engine, search term' do
      rc = RestPinger.new( { :host => "http://www.ask.com/", :prefix => "web?q=", :what => "blues" , :puts => false} ) 

      expect(rc.urlToSend).to eq("http://www.ask.com/web?q=blues")
    end

  end 

  context 'Mimicking a Rails app client' do
    it 'does a GET with a resource and id (a #show action)' do
      # TODO: put YOUR server in here...
      rc = RestPinger.new( { :rails => true, :host => "http://blackwater-bay-rails-75387.usw1.nitrousbox.com/", :prefix => "posts", :id => "2", :puts => false } )
      
      # test will fail if 404 is returned
      expect(rc.urlToSend).to eq("http://blackwater-bay-rails-75387.usw1.nitrousbox.com/posts/2")
    end
  end

end