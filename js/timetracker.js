function checkConnection() {
  if(devReady === true){ var networkState = navigator.connection.type; }
  else{ var networkState = 'browser'; }
  return networkState;
}
angular.module('fsCordova', [])
.service('CordovaService', ['$document', '$q',
  function($document, $q) {
    var d = $q.defer(), resolved = false; self = this;
    this.ready = d.promise;
    document.addEventListener('deviceready', function() {
      resolved = true;
      d.resolve(window.cordova);
    });
    setTimeout(function() {
      if (!resolved) {
        if (window.cordova) d.resolve(window.cordova);
      }
    }, 3000);
}]);
var app = angular.module('orders', ['ngRoute','angular-gestures']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/login',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/login/:error',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/orders',{controller: 'orders',templateUrl: 'layout/orders.html'})
    .otherwise({ redirectTo: '/' });
});
app.factory('project', ['$http','$templateCache','$location','$rootScope','$interval',
  function ($http,$templateCache,$location,$rootScope,$interval) {
    var project = {}, url = 'https://go.salesassist.eu/pim/mobile/', key = 'api_key='+localStorage.token+'&username='+localStorage.username, obj = {},search='';
    /* store data */
    var init = function(){

    }
    init();
    var save = function(type, item){
      if(!localStorage.username){ return false; } if(!type){ return false; } if(!item){ return false; }
      localStorage.setItem(type+localStorage.username, JSON.stringify(item));
    }

    project.getContacts = function(off,pag){
      $rootScope.$broadcast('loadingz');
      var offset = off ? off : 0;
      var list = pag ? pag : 'contacts_list';
      var connect = checkConnection();
      if(connect == 'none' && connect =='unknown'){ this.data = []; }
      else{
        this.data = $http.get(url+'index.php?do=mobile-'+list+'&'+key+'&offset='+offset).then(function(response){
          if(response.data.code=='ok'){
            if(typeof(response.data.response.contacts) == 'object' ){
              var contact = response.data.response.contacts;
              angular.forEach(contact, function(value, key){
                saveContact(value);
              });
            }else if(typeof(response.data.response.customers) == 'object'){
              var customer = response.data.response.customers;
              angular.forEach(customer,function(value,key){
                saveCustomer(value);
              })
            }
          }
          if(response.data.code=='error'){ project.logout(response.data); }
          return response.data;
        });
      }
      return this.data;
    }
    project.logout = function(code){
        if(code.error_code=='authentication required' || code.error_code=='wrong username'){
            localStorage.setItem('username','');
            localStorage.setItem('token','');
            $location.path('/login/'+code.error_code);
        }// else unknown error!!! and we don't need to relog the user
    }
    project.setKey = function(){ key = 'api_key='+localStorage.token+'&username='+localStorage.username; init(); }
    project.deleteData = function(){ localStorage.clear(); }
    return project;
  }
]);
app.directive('loadMore',['project',function(project){
  return {
    restrict: 'C',
    link:  function(scope,element,attrs){
      element.bind('scroll',function(){
        if(this.scrollTop+this.clientHeight > this.scrollHeight-400){
          scope.loadMore();
        }
      })
    }
  }
}]);
