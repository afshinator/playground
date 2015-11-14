    function getShortMessages(messages) {
      return messages.filter( function(obj) {
      	return ( obj.message.length < 50 );
      }).map( function( elt ){
      	return elt.message;
      });
    }

    module.exports = getShortMessages