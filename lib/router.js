//NOTE:Anything you put inside the /lib folder is guaranteed to load first before anything else in your app. Great place to put any helper code that needs to be available at all times.
//we've told the router to use the layout template as the default layout for all routes.
Router.configure({
  layoutTemplate: 'layout',
  //Delay showing a template until the route calling it is ready, and show a loading template instead
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  //Subscribes to the publication and notifications
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

//Creates our controller by extending RouteController
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  //define a new limit function which will return the current limit
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  //findOptions function which will return an options object
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.postsLimit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  data: function() {
    return {posts: Posts.find({}, this.findOptions())};
  }
});



//Maps URL paths of the form /posts/<ID> to the postPage template
Router.route('/posts/:_id', {
  name: 'postPage',
  //add a new route-level waitOn function just for the postPage route.
  //Passing this.params._id as an argument to the subscription.
  waitOn: function() {
    return Meteor.subscribe('comments', this.params._id);
  },
  data: function() { return Posts.findOne(this.params._id); }
});


Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});


//router that lets users post new stories to our app
Router.route('/submit', {name: 'postSubmit'});


//Adding a ? after the parameter name means that it's optional. So our route will not only match http://localhost:3000/50, but also plain old http://localhost:3000.
//We need to deal with the case where the postsLimit parameter isn't present, so we'll assign it a default value. We'll use “5” to really give us enough room to play around with pagination.
Router.route('/:postsLimit?', {
  name: 'postsList',
  waitOn: function() {
    var limit = parseInt(this.params.postsLimit) || 5;
    return Meteor.subscribe('posts', {sort: {submitted: -1}, limit: limit});
  },
  //Instead of being implicitly available as this inside the template, our data context will be available at posts
  data: function() {
    var limit = parseInt(this.params.postsLimit) || 5;
    return {
      posts: Posts.find({}, {sort: {submitted: -1}, limit: limit})
    };
  }
});


//check if the user is logged in, and if they're not render the accessDenied template
var requireLogin = function() {
  if (! Meteor.user()) {
    //we modify our hook to use our loading template while Meteor.loggingIn() is true:
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

// tells Iron Router to show the “not found” page not just for invalid routes but also for the postPage route, whenever the data function returns a “falsy”
Router.onBeforeAction('dataNotFound', {only: 'postPage'});

Router.onBeforeAction(requireLogin, {only: 'postSubmit'});