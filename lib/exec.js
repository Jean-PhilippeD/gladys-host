var command = require('./command.js');

module.exports = function exec(params){
  var type = params.deviceType.deviceTypeIdentifier.split(';')[0];
  var addr = params.deviceType.deviceTypeIdentifier.split(';')[1]; 

  switch(type){
    case 'wol': // it means host is controlable over lan with Wake On Lan
      if(params.state.value === 1) {
        return command.startByWol(addr, params.deviceType.identifier); // send a magic packet to mac @
      } else {
        return command.stopHost(params.deviceType.identifier); // shutdown host
      }
    break;
    case 'rpi': // it means host is kind of RPI and is controlable with a device like an actuator
      if(params.state.value === 1) {
        return gladys.deviceType.getByDevice({id: addr}) // get devicetype of the device which control RPI
        .then(function(devicetype) {
          var state = {
            devicetype: devicetype[0].id,
            value: 1  
          };
          return gladys.deviceType.exec(state)
        })
        .then(function() {
          return gladys.param.getValues(['HOST_KEY_PATH', 'HOST_USER']); // Get user and key
        })
        .spread(function(key, user) {
          if(key !== 'default') key = key;
          return isHostReachable(host, user, key); // return once the host is up or timeout reached
        });
      } else {
        return command.stopHost(params.deviceType.identifier) // shutdown host
        .then(function() { // onde host is stop, stop device
          return gladys.deviceType.getByDevice({id: addr}) // get devicetype of the device which control RPI
        })
        .then(function(devicetype) {
          var state = {
            devicetype: devicetype[0].id,
            value: 0
          };
          return(gladys.deviceType.exec(state));
        })
        .catch(function() {
          sails.log.warn('Host module : Failed to shutdown host "' + params.deviceType.identifier + '" ! Going to power off the connected\'s actuator !');
          return gladys.deviceType.getByDevice({id: addr}) // get devicetype of the device which control RPI
          .then(function(devicetype) {
            var state = {
              devicetype: devicetype[0].id,
              value: 0
            }; 
            return(gladys.deviceType.exec(state));
          });
        });
      }
    break;
    case 'kvm': // it means host is control by KVM
      if(params.state.value === 1) {
        gladys.device.get()
        .then(function(devices) {
          for(var i = 0; i < devices.length; i++) {
            if(devices[i].id === addr) {
              var hypervisor = devices[i].identifier;
            }
          }
          return command.startByKvm(hypervisor, params.deviceType.identifier); // start through KVM host
        });
      } else {
        return command.stopHost(params.deviceType.identifier); // shutdown host
      }
    break;
  }
}
