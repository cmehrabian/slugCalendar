if (Meteor.isClient) {

//=========================================
  // DIALOG

  Template.dialog.events({
    'click .closeDialog': function(event, template){
      Session.set('editing_event',null);
    }
    // 'click .updateTitle':function(evt,tmpl){
    //   var title = tmpl.find('#title').value;
    //   Meteor.call('updateTitle',Session.get('editing_event'),title);
    //   Session.set('editing_event',null);
    // }
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
      //return ce.start;
      // console.log(this);
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
// ========== Search Source ===============

  var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
  };

  var fields = ['eventTitle', 'description'];

  eventSearch = new SearchSource('calevent', fields, options);



  Template.searchResult.helpers({
    getEvents: function() {
      return eventSearch.getData({
        transform: function(matchText, regExp) {
          return matchText.replace(regExp, "<b>$&</b>")
        },
        sort: {isoScore: -1}
      });
    },

    isLoading: function() {
      return eventSearch.getStatus().loading;
    }
  });

  Template.searchResult.rendered = function() {
    eventSearch.search('');
  };

  Template.search.events({
    "keyup #search-box": _.throttle(function(e) {
      var text = $(e.target).val().trim();
      eventSearch.search(text);
    }, 200)
  });

//=========================================
  // CHAT 

  Template.chat.helpers({
    chatLog:function(){
      // console.log(modalID);
      //modalID:modalID
      x = ceID;
      return Chatter.find({modalID:x}, {sort:{timestamp: 1}});
      
    },
    userName: function(){
      console.log(this);
      return this.user.emails[0].address;
    }
  });

  Template.chat.events({
      'keypress input': function(e) {
        if(e.keyCode != 13)
          return;

        var message = document.getElementById("chat-box").value;

        if(message.length == 0)
          return;

        Meteor.call("newMessage", message, ceID);
        document.getElementById("chat-box").value = "";
      }
  });




//=========================================
  // CALENDAR

  Template.main.helpers({
    // addresses: function(){
    //   return Addresses.find();
    // },
    editing_event: function(){
      return Session.get('editing_event');
    }
  });
 

  Template.main.rendered = function(){
    $(document).ready(function() {
        var calendar = $('#calendar').fullCalendar({

          //input for API key from user
            googleCalendarApiKey: 'AIzaSyA0uxTs_BpYPrCEa7K8bG_lsMWlrEMUCcc',
            events: {
                googleCalendarId: 'slugcal@gmail.com',
                // color: '#fff',
                borderColor: 'black',
                className: 'noDec',
                // textColor: "black",
            },
            header: {
              left:   'prev',
              center: 'title',
              right:  'next',
            },
            eventSources: [
              {
                //kresge
                  url: 'motkp6qd69rchvtpikig3c2mpo@group.calendar.google.com',
                  color: 'green',
                  className: 'kresgeDisplay',
              },
              {
                //porter
                  googleCalendarId: 'ucsc.edu_df8o0q6v65q6kr9sra8ojle3vs@group.calendar.google.com',
                  color: '#de0000',
                  className: 'porterDisplay',
                  
              },
              {
                //oakes
                  googleCalendarId: 'ucsc.edu_sau0dj3g2tig75qjhp7shhll4g@group.calendar.google.com',
                  color: '#c921c9',
                  className: 'oakesDisplay',
              },
              {
                //crown
                  url: 'a3ra9d7raj4hg3814375kjcioc@group.calendar.google.com',
                  color: '#e87b19',
                  className: 'crownDisplay',
              }
            ],

            // console.log(document);

            eventClick: function(calevent) {
              Session.set('editing_event', calevent._id);

              if (calevent.url){
                return false;
              }
            },

            eventMouseover: function(calEvent, jsEvent, view, date) {

              // change the day's background color just for fun
              // $(this).css('background-color', 'red');

            },  
            eventAfterAllRender: function(view) {
              cal = calendar.fullCalendar('clientEvents');
              calObj = JSON.stringify(cal);
              console.log(calObj);
              // console.log("XXX"+calObj);

              calStart = [];
              calEnd = [];
//               if(CalEvent.find().fetch() != 0)
//                 return;
              cal.forEach(function(item) {


                eventStart = String(item.start._d);
                startFinal = eventStart.slice(0, 21);


                eventEnd = String(item.end._d);
                endFinal = eventEnd.slice(0, 21);


                eventID = String(item._id);



                // calStart.push(item.start._d);
                // calEnd.push(item._end._d)
                CalEvent.update({_id:item._id}, {$set:{"eventStart":startFinal  }});
                CalEvent.update({_id:item._id}, {$set:{"eventEnd":endFinal}});
                
                // CalEvent.push(eventStart);
                CalEvent.insert(item);
              })
              // CalEvent.insert(c);
              // calLength = cal.length;
              // Meteor.call('allRender', cal);
              // return calendarEvents;
              // $('#calendar').hide();
            }
        });
    });

    // var calendar = $('#calendarFull').fullCalendar({
    //     events:  calObj
    //   });
    
   }
}