var sys = require('sys');
var ssh = require('ssh-exec');
var async = require('async');
var Promise = require('bluebird');
var wol = require('node-wol');
var fs = require('fs');

var key = __dirname + '/gladys_rsa';
var user;


function isHostReachable(host, user, key, loopRepetition, loopDelay){
  // can give a loop value if for example you don't want to loop --> new Array(1)
  if (typeof loopRepetition === 'undefined') {
    var loopRepetition = new Array(60);
  }
  if(typeof loopDelay === 'undefined') {
    var loopDelay = 2500;
  }
    
  return new Promise(function(resolve, reject) {
    async.eachSeries(loopRepetition, function iterate(item, cb) {
      setTimeout(function() {
        ssh('echo hello', {
          user: user,
          host: host,
          key: key
        }, function(error, stdout, stderr) {
          if(!error) return cb(true); // break the loop
          return cb();
        });
      }, loopDelay);
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
    return new Promise(function(resolve, reject) {
      getCredential = gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER']); // Get user and key
      
      getCredential.spread(function(key, user) {
        if(key !== 'default') key = key;
        return isHostReachable(host, user, key, new Array(1), 0); // Test first if host is up 
      })
      .then(function() {return resolve()}) // if up, resolve
      .catch(function() {
        wol.wake(mac, function(error) { // if not, wake on lan
          if(error) return reject(error);
          isHostReachable(host, getCredential.value()[1], getCredential.value()[0]) // Then test when it's up
          .then(function() {resolve();})
          .catch(function() {reject();})
        });
      });
    });
  },

  /**
  * Stop host simply by running shutdown on host
  * @method stopHost
  * @param host 
  */

  stopHost : function(host) {
    return new Promise(function(resolve, reject) {
      gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER'])
      .spread(function(key, user) {
        if(key !== 'default') key = key;
        ssh('sudo shutdown -h now', {
          user: user,
          host: host,
          key: key
        }, function(error, stdout, stderr) {
          if(stderr.match(/No route to host/)) return resolve();
          if(error) return reject();
          setTimeout(function() {
            return resolve(); // delay before sending ack to be sure host is properly stopped
          }, 20000);
        });
      });
    });
  },

  /**
  * Start host by sendind a virsh start on host through KVM host
  * @method startByKvm
  * @param hypervisor : kvm host
  * @param host : host
  */

  startByKvm : function(hypervisor, host) {
    return new Promise(function(resolve, reject) {
      if(!hypervisor) reject();
      gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER'])
      .spread(function(key, user) {
        if(key !== 'default') key = key;
        ssh('sudo virsh start ' + host, {
          user: user,
          host: hypervisor,
          key: key
        }, function(error, stdout, stderr) {
          if(error) return reject(error);
          isHostReachable(host, user, key)
          .then(function() {resolve();})
          .catch(function() {reject();})
        });
      });
    });
  },

  /**
  * Get host state
  * @method hostState
  * @param host : host
  */
  hostState: function(host) {
    return new Promise(function(resolve, reject) {
      gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER'])
      .spread(function(key, user) {
        if(key !== 'default') key = key;
        ssh('echo hello', {
          user: user,
          host: host,
          key: key
        }, function(error, stdout, stderr) {
          if(!error) {
            return resolve({state: 'on'});
          } else {
            return resolve({state: 'off'});
          }
        });
      });
    });
  },

  /**
  * Run a command on a host
  * @method run
  * @param host
  * @param command
  */
  run: function(host, command) {
    return new Promise(function(resolve, reject) {
      gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER'])
      .spread(function(key, user) {
        if(key !== 'default') key = key;
        ssh(command, {
          user: user,
          host: host,
          key: key
        }, function(error, stdout, stderr) {
          if(!error) {
            return resolve({state: 'failed'});
          } else {
            return resolve({state: 'success'});
          }
        });
      });
    });
  }
};
