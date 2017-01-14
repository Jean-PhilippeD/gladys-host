

module.exports = function(sails) {
    
    var exec = require('./lib/exec.js');
    var install = require('./lib/install.js');
    var initialize = require('./lib/initialize.js');
    var command = require('./lib/command.js');
    var setup = require('./lib/setup.js');
    var uninstall = require('./lib/uninstall.js');
    
    return {
        install: install,
        uninstall: uninstall,
        exec: exec,
        command: command,
        setup: setup,
        initialize: initialize
    };
};
