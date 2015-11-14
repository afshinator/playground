function checkUsersValid(goodUsers) {
  return function allUsersValid(submittedUsers) {
  	return submittedUsers.every( function(e) { 
  		return goodUsers.some( function(o) {
  			return ( o.id === e.id );
  		})
  	})
  };
}

module.exports = checkUsersValid