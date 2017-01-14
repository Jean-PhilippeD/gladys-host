Promise = require('bluebird');
 
// define the new box type
module.exports = function(){
  var boxId;
  // Retreive content of the box to create the boxtype
  return gladys.boxType.getAll()
  .then(function(boxtypes) {
    for(var i = 0; i < boxtypes.length; i++) {
      if(boxtypes[i].title === 'Host') {
        boxId = boxtypes[i].id;
      }
    }
    return gladys.boxType.delete({id: boxid});
  })
  .then(function() {
    return gladys.user.get();
  })
  .then(function(users) {
    return Promise.map(users, function(user){
      return gladys.box.getBoxUser(user)
      .then(function(boxs) {
        var array = [];
        for(var i = 0; i < boxs.length; i++) {
          if(boxs[i].boxtype === boxId) {
            array.push(boxs[i]);
          }
        }
        return Promise.map(array, function(box) {
          return gladys.box.delete(box);
        });
      });
    });
  })
  .then(function() {
    return gladys.device.get();
  })
  .then(function(devices) {
    array = [];
    for(var i = 0; i < devices.length; i++) {
      if(devices[i].service === 'host') {
        array.push(devices[i]);
      }
    }
    return Promise.map(array, function(device) {
      return gladys.device.delete(device);
    });
  })
  .catch(function(err) {
    sails.log.error(err);
  });
};

