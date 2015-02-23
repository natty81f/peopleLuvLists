Template.errors.helpers({
  errors: function() {
    return Errors.find();
  }
});

//Clear errors after 3 seconds.
//Use Meteor.setTimeout to specify a callback function to be executed after the timeout (in this case, 3000 milliseconds) expires
Template.error.rendered = function() {
  var error = this.data;
  Meteor.setTimeout(function () {
    Errors.remove(error._id);
  }, 3000);
};