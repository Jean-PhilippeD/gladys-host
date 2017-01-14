var path = require('path');
var fs = require('fs');
var async = require('async');
var ncp = require('ncp').ncp;
var Promise = require('bluebird');

var path = __dirname;

module.exports = function(cb) {

  //return new Promise(function(resolve, reject) {
    async.parallel([
      function(callback){
        var loader = require("sails-util-mvcsloader")(sails);
        loader.injectAll({
          controllers: path + '/../controllers', // Path to your hook's controllers
          config: path + '/../config'// Path to your hook's config
        }, function (err) {
          return callback(err);
        });
      }
    ],
    function(err, result){
      if(err) {
        sails.log.error(err);
        return cb(err);
      }
      cb();
    });
  //});
};

