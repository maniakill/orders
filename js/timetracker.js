window.addEventListener('load', function() { FastClick.attach(document.body); }, false);
function checkConnection() {
  if(devReady === true){ var networkState = navigator.connection.type; }
  else{ var networkState = 'browser'; }
  return networkState;
}
function str_replace(search, replace, subject, count) {
  var i = 0, j = 0, temp = '', repl = '', sl = 0, fl = 0, f = [].concat(search), r = [].concat(replace), s = subject, ra = Object.prototype.toString.call(r) === '[object Array]', sa = Object.prototype.toString.call(s) === '[object Array]';
  s = [].concat(s);
  if(count) { this.window[count] = 0; }
  for( i = 0, sl = s.length; i < sl; i++) {
    if(s[i] === '') {
      continue;
    }
    for( j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + '';
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0];
      s[i] = (temp).split(f[j]).join(repl);
      if(count && s[i] !== temp) {
        this.window[count] += (temp.length - s[i].length) / f[j].length;
      }
    }
  }
  return sa ? s : s[0];
}
function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number, prec = !isFinite(+decimals) ? 0 : Math.abs(decimals), sep = ( typeof thousands_sep === 'undefined') ? ',' : thousands_sep, dec = ( typeof dec_point === 'undefined') ? '.' : dec_point, s = '', toFixedFix = function(n, prec) {
    var k = Math.pow(10, prec);
    return '' + Math.round(n * k) / k;
  };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = ( prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if(s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
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
var app = angular.module('orders', ['ngRoute','angular-gestures','ngSanitize','ui.bootstrap','ui.sortable']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/login',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/login/:error',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/orders',{controller: 'orders',templateUrl: 'layout/orders.html'})
    .when('/add_order',{controller: 'add_order',templateUrl: 'layout/add_order.html'})
    .when('/order',{controller: 'order',templateUrl: 'layout/order.html'})
    .when('/order/:id',{controller: 'order',templateUrl: 'layout/order.html'})
    .when('/vorder/:id',{controller: 'vorder',templateUrl: 'layout/vorder.html'})
    .when('/menu',{controller: 'menu',templateUrl: 'layout/menu.html'})
    .otherwise({ redirectTo: '/' });
}).factory('project', ['$http','$location','$rootScope','$q', function ($http,$location,$rootScope,$q) {
  var project = {}, url = 'https://app.salesassist.eu/pim/mobile/admin/', key = 'api_key='+localStorage.Otoken+'&username='+localStorage.Ousername, obj = {},search='',canceler;
  /* store data */
  var init = function(){
    project.lang = localStorage.getItem("OrdersLang") ? JSON.parse(localStorage.getItem("OrdersLang")) : 2;
  }
  init();
  var save = function(type, item){
    if(!localStorage.Ousername){ return false; } if(!type){ return false; } if(!item){ return false; }
    localStorage.setItem(type+localStorage.Ousername, JSON.stringify(item));
  }
  project.doGet = function(method,params,parent){
    var data = {};
    if(method=='post'){
      data = params;
      params = {};
    }
    project.loading(parent);
    var connect = checkConnection();
    if(connect == 'none' && connect =='unknown'){ this.data = []; }
    else{
      if (canceler) { canceler.resolve(); }
      canceler = $q.defer();
      params.api_key = localStorage.Otoken;
      params.username = localStorage.Ousername;
      this.data = $http({method:method,url:url,params:params,data:data,headers: {'Content-Type': 'application/x-www-form-urlencoded'},timeout:canceler.promise}).then(function(response){
        if(response.data.code=='error'){ project.logout(response.data); }
        return response.data;
      });
    }
    return this.data;
  }
  project.loading = function(parent){
    if(parent == undefined) { parent=''; }
    var stuff = angular.element(parent+'.scrolling_stuff'),
        load = angular.element(parent+'.loading');
    /*var h = stuff.height();
    if(parent) {
      var w = stuff.width();
      if(w){ load.width(w); }
    }
    if(h){ load.height(h); }*/
    load.show();
  }
  project.stopLoading = function(){ angular.element('.loading').hide(); }
  project.logout = function(code){
    if(code.error_code=='authentication required' || code.error_code=='wrong username' || code.logout === true){
        localStorage.setItem('Ousername','');
        localStorage.setItem('Otoken','');
        if(code.error_code){ $location.path('/login/'+code.error_code); }
        else{ $location.path('/login'); }
    }// else unknown error!!! and we don't need to relog the user
  }
  project.setKey = function(){ key = 'api_key='+localStorage.Otoken+'&username='+localStorage.Ousername; init(); }
  project.deleteData = function(){ localStorage.clear(); }
  project.utf8_encode = function(argString) {
    if (argString === null || typeof argString === 'undefined') { return ''; }
    var string = (argString + '');
    var utftext = '', start, end, stringl = 0;
    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
      var c1 = string.charCodeAt(n);
      var enc = null;
      if (c1 < 128) {
        end++;
      } else if (c1 > 127 && c1 < 2048) {
        enc = String.fromCharCode(
          (c1 >> 6) | 192, (c1 & 63) | 128
        );
      } else if ((c1 & 0xF800) != 0xD800) {
        enc = String.fromCharCode(
          (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
        );
      } else {
        if ((c1 & 0xFC00) != 0xD800) {
          throw new RangeError('Unmatched trail surrogate at ' + n);
        }
        var c2 = string.charCodeAt(++n);
        if ((c2 & 0xFC00) != 0xDC00) {
          throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
        }
        c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
        enc = String.fromCharCode(
          (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
        );
      }
      if (enc !== null) {
        if (end > start) {
          utftext += string.slice(start, end);
        }
        utftext += enc;
        start = end = n + 1;
      }
    }
    if (end > start) {
      utftext += string.slice(start, stringl);
    }
    return utftext;
  }
  return project;
}]).directive('loading',['project',function(project){
  return {
    restrict: 'C',
    link:  function(scope,element,attrs){
      // console.log('loading');
      // var h = angular.element('.loaded').height();
      // element.height(h).show();
    }
  }
}]);
