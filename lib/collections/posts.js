//Code inside folders that are not client/ or server/ will run in both contexts. So the Posts collection is available to both client and server.
//In Meteor, the var keyword limits the scope of an object to the current file. We want to make the Posts collection available to our whole app, which is why we're not using the var keyword.
Posts = new Mongo.Collection('posts');

//Setting Up Permissions for editing posts from client
Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});


Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});


//We want to validate our posts on the server. Except we're not using a method to edit posts, but an update call directly from the client.
//This means we'll have to add a new deny callback instead:
Posts.deny({
  update: function(userId, post, fieldNames, modifier) {
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});



//looks at a post object, and returns an errors object containing any relevant errors.
validatePost = function (post) {
  var errors = {};
  if (!post.title)
    errors.title = "Please fill in a headline";
  if (!post.url)
    errors.url =  "Please fill in a URL";
  return errors;
}


//check user calling the method is properly logged in (by making sure that Meteor.userId() is a String), and that the postAttributes object being passed as argument to the method contains title and url strings.
Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });


    //Server-side Validation
    //Even though we don't need to display any error messages on the server, we can still make use of that same validatePost function. Except this time we'll call it from within the postInsert method too, and not just the event helper:
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");


    //If post with the same URL has already been created, we won't add the link a second time but instead redirect the user to this existing post.
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes, {   //_.extend() method is part of the Underscore library, lets you “extend” one object with the properties of another
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      //make sure that all new posts start with 0 comments
      commentsCount: 0,
      //to make sure these two properties are initialized when posts are created
      upvoters: [],
      votes: 0
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  },

  //add a Meteor server-side Method that will upvote posts.
  //1. Grab the post from the database.
  //2. Check if the user has voted.
  //3 .If not, do a vote by the user.
  //Mongo allows us to be smarter and combine steps 1-3 into a single Mongo command:
  upvote: function(postId) {
    check(this.userId, String);
    check(postId, String);

    var affected = Posts.update({
      _id: postId,
      upvoters: {$ne: this.userId}
    }, {
      //$addToSet adds an item to an array property as long as it doesn't already exist, and $inc simply increments an integer field.
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that post");
  }
});