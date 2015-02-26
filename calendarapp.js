CalEvent = new Mongo.Collection('calevent');

if (Meteor.isClient) {

  Template.dialog.events({
    "click .closeDialog": function(event, template){
      Session.set('editing_event',null);
    },
    'click .updateTitle':function(evt,tmpl){
      var title = tmpl.find('#title').value;
      Meteor.call('updateTitle',Session.get('editing_event'),title);
      Session.set('editing_event',null);
    }
  });

  Template.dialog.helpers({
    title: function(){
      var ce = CalEvent.findOne({_id:Session.get('editing_event')});
      return ce.title;
    }
  });
  Template.main.helpers({
    addresses: function(){
      return Addresses.find();
    },
    editing_event: function(){
      return Session.get('editing_event');
    }
  });
  Template.dialog.rendered = function(){
    if(Session.get('editDialog')){
      var calevent = CalEvent.findOne({_id:Session.get('editDialog')});
      if(calevent){
        $('#title').val(calevent.title);
      }
    }
  }

  Template.main.rendered = function(){
    $(document).ready(function() {
        $('#calendar').fullCalendar({
            googleCalendarApiKey: 'AIzaSyA0uxTs_BpYPrCEa7K8bG_lsMWlrEMUCcc',
            events: {
                googleCalendarId: 'slugcal@gmail.com',
                color: 'darkred',
                borderColor: 'black',
                className: 'noDec'
            },
            eventMouseover: function(event, element) {
              // element.qtip({
              //   content: event.description
              // });
              //element.onmouseover()
              console.log(event.description);
              console.log(event.title);
            }
        });
    });
  }

      

        // $('.fc-day').mouseover(function(){
        //   console.log("asdfasdf");
        //   console.log($(this).text);
        // })
    // var calendar = $('#calendar').fullCalendar({
    //   dayClick:function(date,allDay,jsEvent,view){
    //     var calendarEvent = {};
    //     calendarEvent.title = 'New Event';
    //     calendarEvent.start = date;
    //     calendarEvent.end = date;
    //     // calenderEvent.where = "Porter"
    //     calendarEvent.owner = Meteor.userId();
    //     Meteor.call('saveCalEvent', calendarEvent);
    //   },
    //   eventClick:function(calEvent, jsEvent, view){
    //     Session.set('editing_event', calEvent._id);
    //     $('#title').val(calEvent.title);
    //   },
    //   eventDrop:function(reqEvent){
    //     Meteor.call('moveEvent', reqEvent);
    //   },
    //   events:function(start, end, callback){
    //     var calEvents = CalEvent.find({},{reactive:false}).fetch();
    //     callback(calEvents);
    //   },
    //   eventMouseover:function(calEvent, jsEvent, view){
    //     Session.set('editing_event', calEvent._id);
    //     $('#title').val(calEvent.title);
    //   },
    //   editable:true,
    //   selectable:true
    // }).data().fullCalendar;
    // Deps.autorun(function(){
    //   CalEvent.find().fetch();
    //   if(calendar){
    //     calendar.refetchEvents();
    //   }
    // })
  
}

if (Meteor.isServer) {
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
      }
    })
  });
}
