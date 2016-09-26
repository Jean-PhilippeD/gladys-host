var Promise = require('bluebird');

module.exports = function(){
  // Header
  var html = `
    <div>
      <a style="position: absolute; top: 10px; right: 10px" href="#" ng-click="vm.editor = !vm.editor">
        <i class="fa fa-cog"></i>
      </a>
    </div>
  `;
  var footer = `
    <!-- Box Home page -->
    <div>
      <div ng-show="!vm.editor">
        <table class="table table-striped">
          <tr ng-repeat="host in vm.hosts">
            <td>
              <button class="btn btn-xs" ng-class="host.state === 'on' ? 'btn-info' : !host.state === unknown ? 'btn-default' : 'btn-warning'">
                <i class="fa fa-heartbeat"></i>
              </button>
            </td>
            <td>{{host.name}}</td>
            <td>{{host.identifier}}</td>
          </tr>
        </table>
      </div>
      <!-- Box Param page -->
      <div ng-show="vm.editor">
        <table class="table">
          <tr ng-repeat="host in vm.hosts">
            <td>{{host.name}}</td>
            <td>{{host.protocol}}</td>
            <td style="float:right;">
              <button ng-click="vm.destroyHost(host.id)" class="btn btn-danger btn-xs">
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        </table>
        <button class="btn btn-primary" ng-click="vm.openModal()" data-target=".bs-example-modal-lg" data-toggle="modal">{{ \'NEW_HOST\' | translate }}</button>
     </div>
   </div>
   <!-- Box Modal page -->
   <div id="modalNewHost" class="modal fade bs-example-modal-lg in" aria-hidden="false" aria-labelledby="myLargeModalLabel" role="dialog" tabindex="-1">
     <div class="modal-dialog modal-lg">
       <div class="modal-content">
         <div class="modal-header">
           <button class="close" aria-label="Close" data-dismiss="modal" type="button">
             <span aria-hidden="true">×</span>i
           </button>
           <h4 id="myLargeModalLabel" class="modal-title">{{ \'NEW_HOST\' | translate }}</h4>
         </div>
       <!-- Body Error -->
         <div class="modal-body">
           <div ng-show="vm.error" class="alert alert-danger">
             <i class="fa fa-ban"></i>
             <button ng-click="vm.error = !vm.error" type="button" class="close">x</button>
             {{vm.error | errorToString}}
           </div>
       <!-- Body content -->
           <div class="col-sm-8 col-sm-offset-2">
       <!-- Name input -->
           <div class="form-group">
             <span class="input-group-addon" id="basic-addon1">{{\'HOST_NAME\' | translate}}</span>
             <input ng-model="vm.host.device.name" type="text" class="form-control" placeholder="{{\'HOST_NAME\' | translate}}">
           </div>
       <!-- IP input -->
           <div class="form-group">
             <span class="input-group-addon" id="basic-addon2">@</span>
             <input ng-model="vm.host.device.identifier" type="text" class="form-control" placeholder="{{\'HOSTNAME_OR_IP\' | translate}}">
           </div>
       <!-- Type input -->
           <div class="form-group">
             <span class="input-group-addon" id="basic-addon3"><i class="fa fa-server"></i></span>
             <select ng-model="vm.host.types[0].identifier" class="form-control">
               <option ng-repeat="type in vm.types track by type.type" value="{{type.type}}">{{type.label}}</option>
             </select>
           </div>
       <!-- MAC @ input if type == wol -->
           <div class="form-group" ng-show="vm.host.types[0].identifier === \'wol\'">
             <span class="input-group-addon" id="basic-addon4">MAC @</span>
             <input ng-model="vm.host.types[0].additional" type="text" class="form-control" placeholder="MAC @">
           </div>
       <!-- Device input if type == rpi -->
           <div class="form-group" ng-show="vm.host.types[0].identifier === \'rpi\'">
             <span class="input-group-addon" id="basic-addon5"><i class="fa fa-rss"></i></span>
             <select ng-model="vm.host.types[0].additional" class="form-control">
               <option ng-repeat="device in vm.devices track by device.identifier" value="{{device.id}}">{{device.name + \' \' + device.room.name}}</option>
             </select>
           </div>
       <!-- KVM Host input if type == kvm -->
           <div class="form-group" ng-show="vm.host.types[0].identifier === \'kvm\'">
             <span class="input-group-addon" id="basic-addon6"><i class="fa fa-server"></i></span>
             <select ng-model="vm.host.types[0].additional" class="form-control">
               <option ng-repeat="host in vm.hosts" value="{{host.id}}">{{host.name}}</option>
             </select>
           </div>
       <!-- Room input -->
           <div class="form-group">
             <span class="input-group-addon" id="basic-addon7"><i class="fa fa-house"></i></span>
             <select ng-model="vm.host.device.room" class="form-control">
               <option ng-repeat="room in vm.rooms track by room.id" value="{{room.id}}">{{room.houseName + \' - \' + room.name}}</option>
             </select>
           </div>
       <!-- Validate button -->
           <div class="form-group">
             <button ng-click="vm.createHost(vm.host)" class="btn btn-primary">{{ \'SAVE_HOST\' | translate }}</button></div>
           </div>
         </div>
         <div class="clearfix"></div>
       </div>
     `;

  return new Promise(function(resolve, reject) {
    resolve([html, footer]);
  });
};

