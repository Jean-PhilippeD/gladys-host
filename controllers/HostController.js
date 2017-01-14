/** 
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

