//Code inside folders that are not client/ or server/ will run in both contexts. So the Posts collection is available to both client and server.
//In Meteor, the var keyword limits the scope of an object to the current file. We want to make the Posts collection available to our whole app, which is why we're not using the var keyword.
Posts = new Mongo.Collection('posts');

//check user calling the method is properly logged in (by making sure that Meteor.userId() is a String), and that the postAttributes object being passed as argument to the method contains title and url strings.
Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });
    var user = Meteor.user();
    //_.extend() method is part of the Underscore library, lets you “extend” one object with the properties of another
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  }
});