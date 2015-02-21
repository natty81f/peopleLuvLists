//The advantage of using a local collection to store the errors is that, like all collections, it's reactive -- meaning we can reactively display errors in the same way we display any other collection data.

// Local (client-only) collection
Errors = new Mongo.Collection(null);

throwError = function(message) {
  Errors.insert({message: message});
};