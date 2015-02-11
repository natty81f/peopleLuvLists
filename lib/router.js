//NOTE:Anything you put inside the /lib folder is guaranteed to load first before anything else in your app. Great place to put any helper code that needs to be available at all times.
//we've told the router to use the layout template as the default layout for all routes.
Router.configure({
  layoutTemplate: 'layout',
  //Delay showing a template until the route calling it is ready, and show a loading template instead
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  //Subscribes to the publication
  	waitOn: function() { return Meteor.subscribe('posts'); }
});

//Second, we've defined a new route named postsList and mapped it to the root / path.
Router.route('/', {name: 'postsList'});

//Maps URL paths of the form /posts/<ID> to the postPage template
Router.route('/posts/:_id', {
  name: 'postPage',
  data: function() { return Posts.findOne(this.params._id); }
});

// tells Iron Router to show the “not found” page not just for invalid routes but also for the postPage route, whenever the data function returns a “falsy”
Router.onBeforeAction('dataNotFound', {only: 'postPage'});