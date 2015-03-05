//function that returns a cursor referencing all posts
Meteor.publish('posts', function() {
  return Posts.find();
});

//Making sure we restrict our data set to comments belonging to the current post:
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
  return Notifications.find();
});
