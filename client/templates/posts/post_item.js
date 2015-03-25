Template.postItem.helpers({
  //don't show you an edit link to somebody else's form
  ownPost: function() {
    return this.userId === Meteor.userId();
  },

  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  }
});

// call a server upvote Method when the user clicks on the button
Template.postItem.events({
  'click .upvote': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});