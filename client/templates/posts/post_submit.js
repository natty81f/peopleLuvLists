//Initialize the object whenever the postSubmit template is created. This ensures that the user won't see old error messages left over from a previous visit to this page.
//We then define our two template helpers. They both look at the field property of Session.get('postSubmitErrors') (where field is either url or title depending on where we're calling the helper from).
//While errorMessage simply returns the message itself, errorClass checks for the presence of a message and returns has-error if such a message exists.
Template.postSubmit.created = function() {
  Session.set('postSubmitErrors', {});
}
Template.postSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});



Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };


    //Calling the validatePost function
    var errors = validatePost(post);
    if (errors.title || errors.url)
      return Session.set('postSubmitErrors', errors);


    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      // show this result but route anyway
      if (result.postExists)
        throwError('This link has already been posted');

      Router.go('postPage', {_id: result._id});
    });
  }
});