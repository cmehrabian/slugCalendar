Meteor.startup(function () {
    Meteor.methods({
    'saveCalEvent':function(ce){
      CalEvent.insert(ce);
    },
    'updateTitle':function(id,title){
      return CalEvent.update({_id:id},{$set:{title:title}});
    },
    'moveEvent':function(reqEvent){
      return CalEvent.update({_id:reqEvent._id},{
          $set:{
            start:reqEvent.start,
            end:reqEvent.end
          }
      })
    },
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
    // 'allRender':function(c){
    //   for(i=0; i <= c.length; i++){
    //     CalEvent.insert(c[i]);
    //     // console.log(c);
    //   }
    // }
  })
});

SearchSource.defineSource('calevent', function(searchText, options) 
{
  var options = {sort: {isoScore: -1}, limit: 2};

  if(searchText){
    return CalEvent.find({ $text: { $search:searchText } });
  }
  else {
    return CalEvent.find({}, options).fetch();
  }

  // if(searchText) {
  //   var regExp = buildRegExp(searchText);
  //   var selector = {eventTitle: regExp, description: regExp};
  //   return CalEvent.find(selector, options).fetch();
  // } else {
  //   return CalEvent.find({}, options).fetch();
  // }  
});

function buildRegExp(searchText) {
  // this is dumb implementation
  var parts = searchText.trim().split(' ');
  console.log(RegExp("(" + parts.join('|') + ")", "ig"));

  return new RegExp("(" + parts.join('|') + ")", "ig");
}




