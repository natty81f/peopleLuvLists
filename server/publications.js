//function that returns a cursor referencing all posts
Meteor.publish('posts', function(options) {
  check(options, {
    sort: Object,
    limit: Number
  });
  return Posts.find({}, options);
});

//Separate singlePost publication that only publishes one post, identified by _id.
Meteor.publish('singlePost', function(id) {
  check(id, String)
  return Posts.find(id);
});


//Making sure we restrict our data set to comments belonging to the current post:
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});


//return a cursor that corresponds to the current user's notifications. User's can only see their own notifications
Meteor.publish('notifications', function() {
  return Notifications.find({userId: this.userId, read: false});
});
