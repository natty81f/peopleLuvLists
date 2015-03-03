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