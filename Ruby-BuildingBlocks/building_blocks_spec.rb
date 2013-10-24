# # Odin Project - Ruby >> Basic Ruby >> Project: Building Blocks & Advanced Building Blocks
#
# http://www.theodinproject.com/curriculum/ruby/basic_ruby/project_building_blocks.md
#
# Afshin Mokhtari
#


require "building_blocks"

describe "==>Building Blocks Warmup: Word Counter" do
	describe "#Given example" do
		it "deals with given case" do
			histogram("the rain in Spain falls mainly on the plain").should == [["the", 2], ["falls",1], ["mainly", 1], ["on", 1], ["Spain", 1], ["in", 1], ["rain", 1], ["plain", 1]]
		end
	end

	describe "#My tests" do
		it "deals with 3 instances" do
			histogram("my pain pain pain my reframe").should == [["pain", 3], ["my", 2], ["reframe", 1]]
		end
	end	
end

describe "==>Building Blocks Project 1: Caesar Cipher" do
	describe "#Given example" do
		it "deals with given case" do
			caesar_cipher("What a string!", 5).should == "Bmfy f xywnsl!"
		end
	end

	describe "#My tests" do
		it "deals with shift of nothing!" do
			caesar_cipher("What a string!", 0).should == "What a string!"
		end
		it "deals with backward shift" do
			caesar_cipher("What a string!", -1).should == "Vgzs z rsqhmf!"
		end		
	end	
end


describe "==>Building Blocks Project 2: Stock Picker" do
	describe "#Given example" do
		it "deals with given case" do
			stock_picker([17,3,6,9,15,8,6,1,10]) == [1,4]
		end
		it "deals with edge case: lowest day is last day" do
			stock_picker([3,6,7,15,2]) == [0,3]
		end
		it "deals with edge case: highest day is first day" do
			stock_picker([15,3,6,7,4]) == [1,3]
		end

	end
	describe "#My tests" do
		it "deals with no gain periods" do
			stock_picker([5,4,3,2,1]).should == [0,0]
		end
		it "deals with constant gain periods" do
			stock_picker([5, 10, 15, 20, 25]).should == [0,4]
		end	
		it "deals with the only gain period in the range" do
			stock_picker([1,1,1,1,1,2,1,1,1]).should == [0,5]
		end			
	end
end


describe "==>Building Blocks Project 3: Substrings" do

	describe "#Given example" do

	  it "deals with given case" do
	  	dictionary = ["below","down","go","going","horn","how","howdy","it","i","low","own","part","partner","sit"]
	    substrings("below", dictionary).should == {"below"=>1, "low"=>1}
	  end
	end

	describe "#My tests" do

		it "deals with small dictionary" do
			dictionary = ["below"]
			substrings("below", dictionary).should == { "below" => 1 }
		end

		it "deals with empty dictionary" do
			dictionary = []
			substrings("below", dictionary).should == {  }
		end
	end

end

