var keygen = require('ssh-keygen');
var fs = require('fs');
var Promise = require('bluebird');

var password = false; // false and undefined will convert to an empty pw

module.exports = function() {

  return gladys.param.getValue('HOST_KEY_PATH')
  .then(function(key) {
    key = key || __dirname + '/gladys_rsa';
    keygen({
      read: true,
      location: key,
      force: false,
      destroy: false
    }, function(err, out){
      if(err) {
        sails.log.warn('Configuring Host module: Something went wrong: '+err);
        return reject(err);
      }
      sails.log.info('Configuring Host module: Keys created under ' + key + '.pub !');
      return resolve();
    });
  });
};
