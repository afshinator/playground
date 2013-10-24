# # Odin Project - Ruby >> Basic Ruby >> Project: Building Blocks & Advanced Building Blocks
#
# http://www.theodinproject.com/curriculum/ruby/basic_ruby/project_advanced_building_blocks.md
#
#
# Afshin Mokhtari
#


require "advanced_building_blocks"

describe "==>Advanced Building Blocks Project 1: Bubble-Sort" do
	describe "#Basic bubble sort given examples" do
		it "deals with basic given case" do
			bubble_sort([4,3,78,2,0,2]).should == [0,2,2,3,4,78]
		end

		it "deals with basic given case with passing in a block" do
			( bubble_sort_by(["hi","hello","hey"]) { |l,r| r.length - l.length } ).should == ["hi", "hey", "hello"]
		end
	end
	describe "#My numeric tests, without passing in a block" do
		it "deals with empty array" do
			bubble_sort([]).should == []
		end
		it "deals with 1 element array" do
			bubble_sort([3]).should == [3]
		end
		it "deals with 2 element array" do
			bubble_sort([3,1]).should == [1,3]
		end
		it "deals with a completely backward list" do
			bubble_sort([5,4,3,2,1]).should == [1,2,3,4,5]
		end	
	end
	describe "#My numeric tests, passing in a block" do
		it "deals with empty array" do
			( bubble_sort_by([]) { |a,b| b-a } ).should == []
		end
		it "deals with 2 element array" do
			( bubble_sort_by([3,1]) { |a,b| b-a } ).should == [1,3]
		end
		it "deals with complex list" do
			( bubble_sort_by([5,4, 32, 3,2,999, 23, 1]) { |a,b| b-a } ).should == [1,2,3,4,5,23,32,999]
		end
		it "deals with complex list backwards" do
			( bubble_sort_by([5,4, 32, 3,2,999, 23, 1]) { |a,b| a-b } ).should == [999,32,23,5,4,3,2,1]
		end			
	end		
end