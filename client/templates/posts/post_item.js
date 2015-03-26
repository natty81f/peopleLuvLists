Template.postItem.helpers({
  //don't show you an edit link to somebody else's form
  ownPost: function() {
    return this.userId === Meteor.userId();
  },

  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  //helper to conditionally add a disabled CSS class to the upvote button.
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
});

// call a server upvotable Method when the user clicks on the button
Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  }
});