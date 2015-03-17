//=========================================
  // DIALOG

  Template.dialog.events({
    'click .closeDialog': function(event, template){
      Session.set('editing_event',null);
    }
  });

  Template.dialog.helpers({
    title: function(){
      var ce = CalEvent.findOne({_id:Session.get('editing_event')});
      ceID = ce._id;
      return ce.title;
    },
    description: function(){
      var ce = CalEvent.findOne({_id:Session.get('editing_event')});
      if(ce.description == null){
        return "Description not Available";
      }
      return ce.description;
    },
    start: function(){
      var ce = CalEvent.findOne({_id:Session.get('editing_event')});
      
      return ce.eventStart;
    },
    end: function(){
      var ce = CalEvent.findOne({_id:Session.get('editing_event')});
      return ce.eventEnd;
    },
    where: function(){
      var ce = CalEvent.findOne({_id:Session.get('editing_event')});
      if(ce.location == null){
        return "\nLocation not Available";
      }
      return ce.location;
    }
  });

  Template.dialog.rendered = function(){
    if(Session.get('editDialog')){
      var calevent = CalEvent.findOne({_id:Session.get('editDialog')});
      if(calevent){
        $('#title').val(calevent.title);
        $('#description').val(calevent.description);
      }
    }
  }