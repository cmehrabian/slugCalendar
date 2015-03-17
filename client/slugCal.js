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
                borderColor: 'black',
                className: 'noDec',
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
              },
              {
                //crown
                  url: 'kqc7u11kl1stm7oon368uhhtd8@group.calendar.google.com',
                  color: '#1b32db',
                  className: 'college8Display',
              },
            ],

            eventClick: function(calevent) {
              Session.set('editing_event', calevent._id);

              if (calevent.url){
                return false;
              }
            },
 
            eventAfterAllRender: function(view) {
              cal = calendar.fullCalendar('clientEvents');
              calObj = JSON.stringify(cal);
              console.log(calObj);

              calStart = [];
              calEnd = [];
              // if(CalEvent.find().fetch() != 0)
              // return;
              cal.forEach(function(item) {


                eventStart = String(item.start._d);
                startFinal = eventStart.slice(0, 21);


                eventEnd = String(item.end._d);
                endFinal = eventEnd.slice(0, 21);


                eventID = String(item._id);

                CalEvent.update({_id:item._id}, {$set:{"eventStart":startFinal}});
                CalEvent.update({_id:item._id}, {$set:{"eventEnd":endFinal}});
                

                CalEvent.insert(item);
              })
            }
        });
    });
    
   }
