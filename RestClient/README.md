## RestPinger - lightweight interface to [rest-client](https://github.com/rest-client/rest-client)

Project: Web Refresher from [the Odin Project](http://www.theodinproject.com/ruby-on-rails/let-s-get-building)

---

Use RestClient to do a Google search

# Usage:
#
# >h = RestPinger.new()										# default bahivour : print program options
# >h.run("foo")												# default google search for "foo"
# >h.run({search => "foo" })																					# search for "foo"
# >h.run({verb => "POST", host =>"http://example.com/resource"})	# default is GET; POST, DELETE
#