Comments = new Mongo.Collection('comments');

//Just like we previously set up a post server-side Meteor Method, we'll set up a comment Meteor Method to create our comments, check that everything is legit, and finally insert the new comment into the comments collection.
Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      postId: String,
      body: String
    });
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);
    if (!post)
      throw new Meteor.Error('invalid-comment', 'You must comment on a post');
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    return Comments.insert(comment);
  }
});