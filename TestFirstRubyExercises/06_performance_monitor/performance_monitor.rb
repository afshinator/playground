# Afshin Mokhtari

def measure(reps=1)
  durations = []

  reps.times do
    startTime = Time.now
    yield
    endTime = Time.now
    durations << (endTime - startTime)
  end

  return  durations.reduce(:+) / reps.to_f

end