## RestPinger - lightweight interface to [rest-client](https://github.com/rest-client/rest-client)

**Project: Web Refresher** from [the Odin Project](http://www.theodinproject.com/ruby-on-rails/let-s-get-building)

---

### Use RestClient gem to do HTTP requests

- Can do a simple **google search**, or

- Mimick a browser sending requests to a Rails backend for fun and mischief!

---


Usage:

Make sure that you've got Rest Client installed, do a ```$ gem install rest-client```,


```
# from IRB, 
>'load restpinger.rb' 

> rp = RestPinger.new       			# to get these instructions
> rp = RestPinger.new("a search term")  # search Google

# To search elsewhere
> rp = RestPinger.new({ :host => "http://www.ask.com/", :prefix => "web?q=", :what => "blues")

# --- Mimick a Rails client :

# Default GET request of the form /posts/:id   (action: posts#show)
> rp = RestPinger.new({ :host => "http://rails.server.com", :resource => "posts", :id => "2"} )

```