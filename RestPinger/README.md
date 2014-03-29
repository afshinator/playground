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
>'load rp.rb' 

> rp = RestPinger.new       		  # to get instructions
> rp = RestPinger.new("search-term")  # search Google with passed in term

# To search elsewhere
> rp = RestPinger.new({ :host => "http://www.ask.com/", :prefix => "web?q=", :what => "blues")

# To see all the response body (long output!)   { defaults: uses GET, knows googles prefix }
> rp = RestPinger.new({ :puts => true, :host => "http://www.google.com/", :what => "foobar" })
```

- Mimick a Rails client :

```
# Default GET request of the form /posts/:id   (action: posts#show)
> rp = RestPinger.new({ :rails => true, :host => "http://rails.server.com", :prefix => "posts", :id => "3"} )

# GET request of the form /posts/new (action: posts#new)
> rp = RestPinger.new({ :rails => true, :host => "http://server/", :prefix => "posts/new"} )

```

Not-totally-unrelated fun picture:

![Network fun](http://www.edgewave.com/img/diagram/6-4/StepTwo.gif "ping!")