Meteor.startup(function () {
    Meteor.methods({
    newMessage: function(body, ceID){
    if(!Meteor.user())
      return;

    var messageObject = {
      body:body,
      modalID:ceID,   
      user:Meteor.user(),
      timestamp:(new Date()).getTime()
    }

    Chatter.insert(messageObject);

    }
  })
});


//Search not integrated yet - complicated things
SearchSource.defineSource('calevent', function(searchText, options) 
{
  var options = {sort: {isoScore: -1}, limit:100};

  if(searchText){
    return CalEvent.find({ $text: { $search:searchText } });
  }
  else {
    return CalEvent.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  var parts = searchText.trim().split(' ');
  console.log(RegExp("(" + parts.join('|') + ")", "ig"));

  return new RegExp("(" + parts.join('|') + ")", "ig");
}




