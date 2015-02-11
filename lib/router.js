//NOTE:Anything you put inside the /lib folder is guaranteed to load first before anything else in your app. Great place to put any helper code that needs to be available at all times.
//we've told the router to use the layout template as the default layout for all routes.
//Second, we've defined a new route named postsList and mapped it to the root / path.
Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {name: 'postsList'});