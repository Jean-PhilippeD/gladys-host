/**
 * Routes rules
 * @doc http://sailsjs.org/documentation/concepts/routes
 */

module.exports.routes = {
  'get /host/:host/state': 'HostController.getHostState',
}

