# # pig latin


def translateOneWord(word)
  vowels = [ 'a', 'e', 'i', 'o', 'u', 'y' ]
  arr = word.split('')
  new_arr = []

  while vowels.include?(arr[0]) == false
    c = arr.shift
    new_arr.push(c)
    if c == 'q' && arr[0] == 'u'
      arr.shift
      new_arr.push('u')
    end
  end
  result = arr.join + new_arr.join + "ay"
end


def translate(sentence)
  result = []
  sentence.split(' ').each { |w| result << translateOneWord(w) }
  result.join(" ")
end
