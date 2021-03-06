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
  //replace the {submitted: -1} sort property by this.sort, which will be provided by NewPostsListController and BestPostsListController
  findOptions: function() {
    return {sort: this.sort, limit: this.postsLimit()};
  },
  //Tell Iron Router not to waitOn the subscription.
  //Use the subscriptions hook as a convenient place to define our subscription, similar to using an onBeforeAction hook.
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    return {
      posts: this.posts(),
      //We're also passing a ready variable referring to this.postsSub.ready as part of our data context. This will let us tell the template when the post subscription is done loading.
      ready: this.postsSub.ready,
      nextPath: hasMore ? this.nextPath() : null
    };
  }
});


//We'll also create two new routes called newPosts and bestPosts. To do this, we'll extend our PostsListController into two distinct NewPostsListController and BestPostsListController controllers. This will let us re-use the exact same route options for both the home and newPosts routes, by giving us a single NewPostsListController to inherit from.
NewPostsController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});
BestPostsController = PostsListController.extend({
  //when we sort by votes, we have a subsequent sorts by submitted timestamp and then _id to ensure that the ordering is completely specified.
  sort: {votes: -1, submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.bestPosts.path({postsLimit: this.postsLimit() + this.increment})
  }
});

Router.route('/', {
  name: 'home',
  controller: NewPostsController
});

Router.route('/new/:postsLimit?', {name: 'newPosts'});
Router.route('/best/:postsLimit?', {name: 'bestPosts'});


//Maps URL paths of the form /posts/<ID> to the postPage template
Router.route('/posts/:_id', {
  name: 'postPage',
  //add a new route-level waitOn function just for the postPage route.
  //Passing this.params._id as an argument to the subscription.
  waitOn: function() {
    return [
      Meteor.subscribe('singlePost', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ];
  },
  data: function() { return Posts.findOne(this.params._id); }
});


Router.route('/posts/:_id/edit', {
  name: 'postEdit',
  waitOn: function() {
    return Meteor.subscribe('singlePost', this.params._id);
  },
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