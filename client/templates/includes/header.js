//helper that uses the current path and one or more named routes to set an active class on our navigation items:
Template.header.helpers({
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();

    var active = _.any(args, function(name) {
      return Router.current() && Router.current().route.getName() === name
    });

    return active && 'active';
  }
});

//For each navigation item, the activeRouteClass helper takes a list of route names, and then uses Underscore's any() helper to see if any of the routes pass the test (i.e. their corresponding URL being equal to the current path).

//If any of the routes do match up with the current path, any() will return true. Finally, we're taking advantage of the boolean && string JavaScript pattern where false && myString returns false, but true && myString returns myString.