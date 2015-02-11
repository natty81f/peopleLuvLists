//NOTE:Anything you put inside the /lib folder is guaranteed to load first before anything else in your app. Great place to put any helper code that needs to be available at all times.
//we've told the router to use the layout template as the default layout for all routes.
Router.configure({
  layoutTemplate: 'layout',
  //Delay showing a template until the route calling it is ready, and show a loading template instead
  loadingTemplate: 'loading',
  //Subscribes to the publication
  	waitOn: function() { return Meteor.subscribe('posts'); }
});

//Second, we've defined a new route named postsList and mapped it to the root / path.
Router.route('/', {name: 'postsList'});