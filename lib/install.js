var content = require('./boxContent.js');
 
// define the new box type
module.exports = function(){

  // Retreive content of the box to create the boxtype
  return new Promise(function(resolve, reject) {
    content()
    .spread(function(html, footer) {
      var boxType = {
        title: 'Host',
        ngcontroller: 'hostCtrl as vm',
        html: html,
        footer: footer,
        icon: 'fa fa-server',
        type: 'box box-info',
        view: 'dashboard'
      }
      // Create the box type
      return gladys.boxType.create(boxType);
    })
    .then(function() {
      // In parallel, create parameters if doesn't exist
      async.parallel([
        function(cb) {
          gladys.param.getValue('HOST_KEY_PATH')
          .then(function() {cb();})// If exist, do nothing})
          .catch(function(){
            // If Host doesnt exist, create default value
            gladys.param.setValue({name: 'HOST_KEY_PATH', value: 'default'})
            .then(function() {cb();})
            .catch(function(err) {cb(err);});
          });
        },
        function(cb) {
          gladys.param.getValue('HOST_USER')
          .then(function() {cb();})// If exist, do nothing})
          .catch(function(){
            // If Port doesnt exist, create default value
            gladys.param.setValue({name: 'HOST_USER', value: 'gladys'})
            .then(function() {cb();})
            .catch(function(err) {cb(err);});
          });
        }
      ], function(err) {
        if(err) {
          sails.log.warn(err);
          return reject(err);
        }
        return resolve();
      });
    });
  });
};

