var postsData = [
  {
    title: 'Introducing Telescope',
    url: 'http://sachagreif.com/introducing-telescope/'
  },
  {
    title: 'Meteor',
    url: 'http://meteor.com'
  },
  {
    title: 'The Meteor Book',
    url: 'http://themeteorbook.com'
  }
];

//function to create a template helper called posts that returns the postsData array we just defined above
Template.postsList.helpers({
  posts: postsData
});


//Defining the posts helper means it is now available for our template to use, so our template will be able to iterate over our postsData array and pass each object contained within to the postItem template.