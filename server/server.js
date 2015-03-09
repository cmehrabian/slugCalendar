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
    'eventAfterAllRender':function(c){
      for(i=0; i <= c.length; i++){
        CalEvent.insert(c);
        console.log(c);
      }
    }
  })
});

SearchSource.defineSource('calevent', function(searchText, options) 
{
  var options = {sort: {isoScore: -1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {eventTitle: regExp, description: regExp};
    return calEvent.find(selector, options).fetch();
  } else {
    return calEvent.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is dumb implementation
  var parts = searchText.trim().split(' ');
  return new RegExp("(" + parts.join('|') + ")", "ig");
}




