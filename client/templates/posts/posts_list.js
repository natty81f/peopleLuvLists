//function to create a template helper called posts that returns the Posts collection
Template.postsList.helpers({
  posts: function() {
    return Posts.find();
  }
});


//Defining the posts helper means it is now available for our template to use.