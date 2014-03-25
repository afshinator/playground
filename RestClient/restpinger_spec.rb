require './spec_helper'
require 'rest-client'
require './rc'

describe 'RestPinger'  do
	
	it 'defaults to google search when you specify nothing on command line' do
		rc = RestPinger.new

		expect(rc.where).to eq("http://www.google.com/")
		# 		expect(@where).to eq("http://www.google.com/")        # why doesnt this work?
	end

end