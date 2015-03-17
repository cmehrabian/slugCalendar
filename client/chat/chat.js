  Template.chat.helpers({
    chatLog:function(){
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
