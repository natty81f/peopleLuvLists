//NOTE:Anything you put inside the /lib folder is guaranteed to load first before anything else in your app. Great place to put any helper code that needs to be available at all times.
//we've told the router to use the layout template as the default layout for all routes.
Router.configure({
  layoutTemplate: 'layout',
  //Delay showing a template until the route calling it is ready, and show a loading template instead
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  //Subscribes to the publication and notifications
  waitOn: function() {
    return [Meteor.subscribe('posts'), Meteor.subscribe('notifications')]
  }
});

//Second, we've defined a new route named postsList and mapped it to the root / path.
Router.route('/', {name: 'postsList'});

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