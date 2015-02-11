//function that returns a cursor referencing all posts
Meteor.publish('posts', function() {
  return Posts.find();
});