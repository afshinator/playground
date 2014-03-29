require './spec_helper'
require 'rest-client'
require './rp'

describe 'RestPinger'  do
  context 'Doing normal search ' do 
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
      rc = RestPinger.new( { :host => "http://www.ask.com/", :prefix => "web?q=", :what => "blues" , :puts => false} ) 

      expect(rc.urlToSend).to eq("http://www.ask.com/web?q=blues")
    end

  end 

  context 'Mimicking a Rails app client' do
    it 'does a GET with a resource and id (a #show action)' do
      rc = RestPinger.new( { :rails => true, :host => "http://blackwater-bay-rails-75387.usw1.nitrousbox.com/", :prefix => "posts", :id => "2", :puts => false } )

      # test will fail if 404 is returned
    end
  end

end