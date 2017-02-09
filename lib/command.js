var sys = require('sys');
var ssh2 = require('promised-ssh');
var async = require('async');
var Promise = require('bluebird');
var wol = require('node-wol');
var fs = require('fs');

var key = __dirname + '/gladys_rsa';
var user;

/**
* connect to ssh
*/

function connect(host, user, key) {
  return ssh2.connect({
    host:  host,
    username: user,
    privateKey: require('fs').readFileSync(key)
  });
}

/**
* @method isHostReachable
* @param host: host to check
* @param user: ssh user
* @param key: ssh key
* @param numberOfRetry: number of times function will test ssh
* @param durationOfRetry: duration between 2 retries
*/
function isHostReachable(host, user, key, numberOfRetry, durationOfRetry){
  var n = 60
  var d = 2500
  if (typeof numberOfRetry !== 'undefined') {
    var n = numberOfRetry
  }
  // Build an array to async over it
  var numberOfRetry = new Array(n);

  if(typeof durationOfRetry === 'undefined') {
    var durationOfRetry = d
  }
    
  return new Promise(function(resolve, reject) {
    async.eachSeries(numberOfRetry, function iterate(item, cb) {
      setTimeout(function() {
        connect(host, user, key)
        .then(function(connection) {
           return connection.exec(['echo hello > /dev/null']);
        })
        .spread(function(stdout, stderr) {
           if (stderr) return cb(true);
           return cb();
        });
      }, durationOfRetry);
    }, function(started) {
      if(!started) return reject(new Error('Host not started'));
      return resolve();
    });
  });
}


module.exports = {

  isHostReachable: isHostReachable,

  /**
  * Send Magic Packet to mac address
  * @method startByWol
  * @param mac : mac @
  */

  startByWol : function(mac, host) {
    var user;
    var key;
    return gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER']) // Get user and key
    .spread(function(k, u) {
      if(k !== 'default') key = k;
      user = u;
      return isHostReachable(host, user, key, 1, 0); // We first test connection to prevent loosing time if host is allready up
    })
    .then(function() {
      // resolve means host is up, return true
      return Promise.resolve()
    })
    .catch(function() {
      // reject means hot is down, we gonnasend packet
      wol.wake(mac, function(error) {
        if(error) return Promise.reject(error);
        isHostReachable(host, user, key) // Then test when it's up
        .then(function() {Promise.resolve();})
        .catch(function() {Promise.reject();})
      });
    });
  },

  /**
  * Stop host simply by running shutdown on host
  * @method stopHost
  * @param host 
  */

  stopHost : function(host) {
    return gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER'])
    .spread(function(key, user) {
      if(key !== 'default') key = key;
      return connect(host, user, key);
    })
    .then(function(connection) {
      return connection.exec(['sudo shutdown -h now']);
    })
    .spread(function(stdout, stderr) {
      if (stderr) console.log('Host module : SSH error : ' + stderr);
    })
  },

  /**
  * Start host by sendind a virsh start on host through KVM host
  * @method startByKvm
  * @param hypervisor : kvm host
  * @param host : host
  */

  startByKvm : function(hypervisor, host) {
    return  gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER'])
    .spread(function(key, user) {
      if(key !== 'default') key = key;
      return connect(hypervisor, user, key);
    })
    .then(function(connection) {
      return connection.exec(['sudo virsh start ' + host]);
    })
    .spread(function(stdout, stderr) {
      if (stderr) reject(stderr);
      return isHostReachable(host, user, key);
    })
    .then(function() {resolve();})
    .catch(function() {reject();})
  },

  /**
  * Get host state
  * @method hostState
  * @param host : host
  */
  hostState: function(host) {
    return gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER'])
    .spread(function(key, user) {
      if(key !== 'default') key = key;
      return connect(host, user, key);
    })
    .then(function(connection) {
      return connection.exec(['echo hello > /dev/null']);
    })
    .spread(function(stdout, stderr) {
      if (stderr) resolve({state: 'off'});
      return resolve({state: 'off'});
    })
  },

  /**
  * Run a command on a host
  * @method run
  * @param host
  * @param command
  */
  run: function(host, command) {
    return gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER'])
    .spread(function(key, user) {
      if(key !== 'default') key = key;
      return connect(host, user, key);
    })
    .then(function(connection) {
      return connection.exec([command]);
    })
    .spread(function(stdout, stderr) {
      if (stderr) resolve({state: 'failed'});
      return resolve({state: 'success'});
    })
  }
};
