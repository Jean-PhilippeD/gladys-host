/** 
  * Gladys Project
  * http://gladysproject.com
  * Software under licence Creative Commons 3.0 France 
  * http://creativecommons.org/licenses/by-nc-sa/3.0/fr/
  * You may not use this software for commercial purposes.
  * @author :: Jean-Philippe Danrée
  */

  
module.exports = {

  /**
  * Return state host
  */
  getHostState: function(req, res, next){
    gladys.modules.host.command.hostState(req.params.host)
    .then(function(state) {
      return res.json(state);
    });
  },
}

