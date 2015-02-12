//Code inside folders that are not client/ or server/ will run in both contexts. So the Posts collection is available to both client and server.
//In Meteor, the var keyword limits the scope of an object to the current file. We want to make the Posts collection available to our whole app, which is why we're not using the var keyword.
Posts = new Mongo.Collection('posts');

Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId;
  }
});