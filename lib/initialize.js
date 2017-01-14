var path = require('path');

var path = __dirname;

module.exports = function(cb) {

  var loader = require("sails-util-mvcsloader")(sails);
  loader.injectAll({
    controllers: path + '/../controllers', // Path to your hook's controllers
    config: path + '/../config'// Path to your hook's config
  }, function(err) {
    return cb(err)
  });
};

