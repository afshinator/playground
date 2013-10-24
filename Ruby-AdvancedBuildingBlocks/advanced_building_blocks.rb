# # Odin Project - Ruby >> Basic Ruby >> Project: Building Blocks & Advanced Building Blocks
# Project solutions - Afshin Mokhtari
#
# http://www.theodinproject.com/curriculum/ruby/basic_ruby/project_advanced_building_blocks.md

#
# Advanced Building Blocks Project 1: Bubble Sort
def bubble_sort(arr)
	bubble_sort_by(arr) { |a,b| b-a }
end


# Recursive Bubble Sort, takes in a block for comparison logic
# call it with a block to tell it how to sort; eg) bubble_sort_by(["hi","hello","hey"]) { |l,r| r.length - l.length }
def bubble_sort_by(arr)
	return arr if arr.length < 2

	if arr.length == 2 
		arr.reverse! if yield(arr[1] ,arr[0]) > 0	# swaps values w/o having to declare a temp variable.
		return arr
	end
	# Divide up work - head is beginning of array til next to last elt; 
	# passing &Proc.new as second parameter is how you pass the block passed in along.
	head = bubble_sort_by(arr[0..arr.length-2], &Proc.new)	# now last elt in head is biggest number in that sub-array
	tail = bubble_sort_by([head.last, arr.last], &Proc.new)	# sort between the last element in head and last element in original array
	return ( bubble_sort_by( head[0..head.length-2] << tail[0], &Proc.new ) << tail[1] )	
end


#
# Advanced Building Blocks Project 2: Enumerable Methods


class Array
	def my_each
		for i in 0..self.length-1
			yield self[i]
		end
		self
	end


	def my_each_with_index
		for i in 0..self.length-1
			yield self[i], i
		end
	end


=begin 
a = %w{ a b c d e f }
a.select {|v| v =~ /[aeiou]/}   #=> ["a", "e"]
=end
	def my_select
		result = []
		for i in 0..self.length-1
			result << self[i] if yield self[i]
		end
		result
	end	


=begin 
%w{ant bear cat}.all? {|word| word.length >= 3}   #=> true
%w{ant bear cat}.all? {|word| word.length >= 4}   #=> false
[ nil, true, 99 ].all?                            #=> false
=end
	def my_all?(&b)
		b = lambda { |e| e } unless block_given?  # if no block passed in, make a generic one
		my_select(&b).length == self.length
	end


=begin
%w{ant bear cat}.none? {|word| word.length == 5}  #=> true
%w{ant bear cat}.none? {|word| word.length >= 4}  #=> false
[].none?                                          #=> true
[nil].none?                                       #=> true
[nil,false].none?                                 #=> true
=end
	def my_none?(&b)
		b = lambda { |e| e } unless block_given?  # if no block passed in, make a generic one		
		my_select(&b).length == 0
	end


=begin  
ary = [1, 2, 4, 2]
ary.count             #=> 4
ary.count(2)          #=> 2
ary.count{|x|x%2==0}  #=> 3
=end
	def my_count(what=nil, &b)
		return self.length unless what || block_given?
		return (self.my_select { |e| e == what}).length if what
		return (self.my_select(&b)).length if block_given?
	end


=begin  
a = [ "a", "b", "c", "d" ]
a.map {|x| x + "!" }   #=> ["a!", "b!", "c!", "d!"]
=end
	def my_map
		result = []
		for i in 0..self.length-1
			result << ( yield self[i] )
		end
		result
	end

end