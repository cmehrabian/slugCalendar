  
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

