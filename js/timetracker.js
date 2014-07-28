window.addEventListener('load', function() { FastClick.attach(document.body); }, false);
function exitTheApp(){ navigator.app.exitApp(); }
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
}//'ui.sortable',
var app = angular.module('orders', ['ngRoute','angular-gestures','ngSanitize','ui.bootstrap','highcharts-ng']);
app.config(function ($routeProvider) {
  $routeProvider
    .when('/',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/login',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/login/:error',{controller: 'login',templateUrl: 'layout/login.html'})
    .when('/orders',{controller: 'orders',templateUrl: 'layout/orders.html'})
    .when('/orders/:view',{controller: 'orders',templateUrl: 'layout/orders.html'})
    .when('/add_order',{controller: 'add_order',templateUrl: 'layout/add_order.html'})
    .when('/order',{controller: 'order',templateUrl: 'layout/order.html'})
    .when('/order/:id',{controller: 'order',templateUrl: 'layout/order.html'})
    .when('/vorder/:id',{controller: 'vorder',templateUrl: 'layout/vorder.html'})
    .when('/menu',{controller: 'menu',templateUrl: 'layout/menu.html'})
    .when('/dashboard',{controller: 'dashboard',templateUrl: 'layout/dashboard.html'})
    .otherwise({ redirectTo: '/' });
}).factory('cordovaReady', function() {
  return function (fn) {
    var queue = [];
    var impl = function () {
      queue.push(Array.prototype.slice.call(arguments));
    };
    document.addEventListener('deviceready', function () {
      document.addEventListener("backbutton", exitTheApp, false);
      queue.forEach(function (args) {
        fn.apply(this, args);
      });
      impl = fn;
    }, false);
    return function () {
      return impl.apply(this, arguments);
    };
  };
}).factory('checkConnection',function (cordovaReady){
  return {
    check: cordovaReady(function(){
      return navigator.connection.type;
    })
  };
}).factory('vibrate', function (){
  return {
    vib: function (milliseconds) {
      console.info('e');
      if(navigator.notification){ navigator.notification.vibrate(milliseconds); }
    }
  };
}).factory('project', ['$http','$location','$rootScope','$q','$timeout','checkConnection', function ($http,$location,$rootScope,$q,$timeout,checkConnection) {
  var project = {}, url = 'https://app.salesassist.eu/pim/mobile/admin/', key = 'api_key='+localStorage.Otoken+'&username='+localStorage.Ousername, obj = {},search='',canceler;
  project.d = '';
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
    var connect = checkConnection.check();
    if(connect == 'none' || connect =='unknown'){ this.data = []; alert("check your internet connection"); project.stopLoading(); }
    else{
      if (canceler) { canceler.resolve(); }
      canceler = $q.defer();
      params.api_key = localStorage.Otoken;
      params.username = localStorage.Ousername;
      this.data = $http({method:method,url:url,params:params,data:data,headers: {'Content-Type': 'application/x-www-form-urlencoded'},timeout:canceler.promise}).then(function(response){
        if(response.data.code=='error'){ project.logout(response.data); }
        return response.data;
      },function(response){ return; });
    }
    return this.data;
  }
  project.loading = function(parent){
    if(parent == undefined) { parent=''; }
    var stuff = angular.element(parent+'.scrolling_stuff'),
        load = angular.element(parent+'.loading');
    load.show();
  }
  project.stopLoading = function(){ angular.element('.loading').hide(); }
  project.logout = function(code){
    if(code.error_code=='authentication required' || code.error_code=='wrong username' || code.logout === true){
        // localStorage.setItem('Ousername',''); we keep the username to show it on the login screen
        localStorage.setItem('Otoken','');
        if(code.error_code){ $location.path('/login/'+LANG[project.lang][code.error_code]); }
        else{ $location.path('/login'); }
    }// else unknown error!!! and we don't need to relog the user
  }
  project.setKey = function(){ key = 'api_key='+localStorage.Otoken+'&username='+localStorage.Ousername; init(); }
  project.deleteData = function(){ localStorage.clear(); }
  return project;
}]).directive('lng',['project',function(project){
  return {
    restrict: 'A',
    link: function (scope,element,attrs){
      /*
      works for input type text,password and submit, div,span,p,h[1-6] basicly any kind of element that can contain text
      element should have the lng attr and it's value should be the text to be translated
      element can have text inside of it that can be appended or prepended to the text in the lng attr (if you set the befor attr as true it will be appended)
      element should not contain other html in it because it will stop working
      element should not have angular bindings in it
      */
      if(element[0].tagName == 'INPUT'){
        if(element[0].type == 'submit'){
          element.val(attrs.lng);
          if(LANG[project.lang][attrs.lng]){ element.val( LANG[project.lang][attrs.lng] ); }
        }
        if(element[0].type == 'text' || element[0].type == 'password'){
          element[0].placeholder = attrs.lng;
          if(LANG[project.lang][attrs.lng]){ element[0].placeholder = LANG[project.lang][attrs.lng]; }
        }
      }else{
        var extra = element[0].innerHTML, text = LANG[project.lang][attrs.lng] ? LANG[project.lang][attrs.lng] : attrs.lng, val = attrs.befor ? text + extra : extra + text;
        element.html(val);
      }
    }
  }
}]);