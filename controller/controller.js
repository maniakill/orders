app.controller('login',['$scope','$http','$templateCache','$location','$timeout','project','$routeParams','vibrate',function ($scope,$http,$templateCache,$location,$timeout,project,$routeParams,vibrate) {
  var token = localStorage.getItem('Otoken');
  if(token){ $location.path('/dashboard'); }
  if($routeParams.error){ $scope.alerts=[{type:'danger',msg:$routeParams.error}]; }
  $scope.method = 'POST';
  $scope.url = 'https://app.salesassist.eu/pim/mobile/admin/';
  $scope.params = [];
  $scope.username = localStorage.getItem('Ousername');
  var apromise;
  $scope.fetch = function() {
    vibrate.vib(100);
    $scope.params['username']=$scope.username;
    $scope.params['password']=$scope.password;
    if($scope.params['username'] && $scope.params['password']){
      $http({method:$scope.method,url:$scope.url,cache:$templateCache,params:$scope.params}).
      success(function(data,status) {
        if(data.code == 'ok'){
          localStorage.setItem('Otoken',data.response);
          localStorage.setItem('Ousername',$scope.params['username']);
          localStorage.setItem('OrdersLang',data.lang_id);
          localStorage.setItem('Ofirst_name',data.first_name);
          localStorage.setItem('Olast_name',data.last_name);
          localStorage.setItem('Oemail',data.email);
          project.setKey();
          $location.path('/dashboard');
        }else{
          $scope.alerts=[{type:'danger',msg:data.error_code}];
        }
      }).
      error(function(data,status){
        $scope.alerts=[{type:'danger',msg:LANG[project.lang]['Server error. Please try later']}];
      });
    }else{
      $scope.alerts=[{type:'danger',msg:LANG[project.lang]['Please fill all the fields']}];
    }
  };
  $scope.closeAlert=function(index){$scope.alerts.splice(index,1);}
  // $scope.openInBrowser=function(){ window.open('https://app.salesassist.eu', '_system', 'location=yes'); }
}]).controller('orders',['$scope','project','$filter','$timeout','$routeParams','vibrate',function ($scope,project,$filter,$timeout,$routeParams,vibrate) {
  var getparams = {'do' : 'orders-orders',view:0};
  $scope.views = [{name:'All',view:'all',active:'active',p:'0'},{name:'My orders',view:'my_order',active:'',p:'4'},{name:'Draft',view:'draft',active:'',p:'1'},{name:'Ready to deliver',view:'ready',active:'',p:'2'},{name:'Fully delivered',view:'fully',active:'',p:'3'}];
  $scope.search = false;
  $scope.pick_date_format = '';
  $scope.orders = [];
  $scope.pagg = '';
  $scope.openeds = false;
  $scope.selectedInput = null;
  if($routeParams.view){
    getparams.view = $routeParams.view;
    angular.forEach($scope.views, function(value,key){
      value.active = '';
      if(value.p == $routeParams.view){ value.active = 'active'; }
    });
  }
  $scope.showSearch = function(){
    if(!$scope.search){ vibrate.vib(100); }
    $scope.search = !$scope.search;
    angular.element('.search').toggleClass('cancel');
    angular.element('.loaded').toggleClass('lower');
    if(!$scope.search){
      $scope.serch=''; $scope.sdate=''; $scope.edate=''; $scope.ddate=''; $scope.dedate='';
      $scope.submit();
    }
  }
  $scope.doIt = function(method,params,callback){
    project.doGet(method,params).then(function(res){
      if(res.code!='error'){
        $scope.pagg = res.pagin;
        $scope.backlink = res.backlink;
        $scope.nextlink = res.nextlink;
        $scope.last_link = res.last_link;
        $scope.first_link = res.first_link;
        $scope.is_pagination = res.is_pagination;
        $scope.orders.length = 0;
        angular.forEach($scope.views, function(value,key){
          value.active = '';
          if(value.p == res.in.view){ value.active = 'active'; }
        });
        angular.forEach(res.order_row,function(value,key){ $scope.orders.push(value); });
        if (callback && typeof(callback) === "function") { callback(); }
        $scope.pick_date_format = res.pick_date_format;
      }
      project.stopLoading();
    },function(){project.stopLoading();});
  }
  $scope.submit = function() {
    $scope.openeds = false;
    vibrate.vib(100);
    getparams.offset=0;
    getparams.search = $scope.serch;
    if($scope.pick_date_format){
      getparams.start_date = $filter('date')($scope.sdate, $scope.pick_date_format);
      getparams.stop_date = $filter('date')($scope.edate, $scope.pick_date_format);
      getparams.d_start_date = $filter('date')($scope.ddate, $scope.pick_date_format);
      getparams.d_stop_date = $filter('date')($scope.dedate, $scope.pick_date_format);
    }
    $scope.doIt('get',getparams);
  };
  $scope.fil = function(view){
    if(getparams.view == view){ return false; }
    vibrate.vib(100);
    getparams.offset=0;
    getparams.view = view;
    $scope.doIt('get',getparams, function(){
      angular.forEach($scope.views, function(value,key){
        value.active = '';
        if(value.p == view){ value.active = 'active'; }
      });
    });
  }
  $scope.snap = function(){
    vibrate.vib(100);
    angular.element('.main_menu').show(0,function(){
      var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
      _this.removeClass('slide_right slide_left').css({'left':'-'+width+'px'});
      $timeout(function(){ _this.addClass('slide_left'); });
    });
  }
  $scope.handleGesture = function($event){ $scope.snap(); }
  $scope.page = function(pag){
    if(pag == undefined){ return false; }
    vibrate.vib(100);
    getparams.offset = pag;
    $scope.doIt('get',getparams);
  }
  $scope.delete_order = function(item){
    var params = {};
    params.do = 'orders-orders-order-archive_order';
    params.view = getparams.view;
    params.offset = getparams.offset;
    params.order_id = item;
    $scope.doIt('get',params);
  }
/* datepicker */
  $scope.today = function() { $scope.dt = new Date(); };
  $scope.today();
  $scope.clear = function () { $scope.dt = null; };
  $scope.open = function($event,type) {
    $event.stopPropagation();
    $scope.openeds = true;
    $scope.selectedInput = type;
  };
  $scope.$on('selectDate',function(arg,args){
    var d = date_fromater($scope.pick_date_format,args);
    $scope[$scope.selectedInput] = d;
    $scope.openeds = false;
    $scope.selectedInput = null;
  });
  $scope.$on('closeDateP',function(arg){ $scope.openeds = false; });
  $scope.dateOptions = { 'starting-day': 1,'show-weeks':false, };
/* datepicker */
  $timeout( function(){ $scope.doIt('get',getparams); });
}]).controller('order', ['$scope','project','$http','$timeout','$routeParams','$location','$rootScope','vibrate', function ($scope,project,$http,$timeout,$routeParams,$location,$rootScope,vibrate){
  $scope.order_id = isNaN($routeParams.id) === false ? $routeParams.id : 0;
  $scope.text = $scope.order_id ? 'Edit' : 'Add';
  $scope.cancel_link = isNaN($routeParams.id) === false ? 'vorder/'+$scope.order_id : 'orders';
  var s = $routeParams.id.split('&'),p = [];
  for(x in s){
    var a = s[x].split('=');
    p[a[0]] = a[1];
  }
  var getparams = { 'do':'orders-norder','order_id':$scope.order_id, 'buyer_id':p.buyer_id, 'contact_id':p.contact_id, 's_buyer_id':p.s_buyer_id, 's_customer_id':p.s_customer_id,'currency_type':p.currency_type,'languages':p.languages };
  $('select').width($('.date').outerWidth()-17);
  $scope.dateOptions = { 'starting-day': 1 };
  $scope.details = false;
  $scope.order = {'in':{serial_number:''},author_id:'',customer_name:' ',total_vat:'&nbsp;',article_line:[],total_currency_hide:true, email_language: (p.languages ? p.languages : 1),field: (p.buyer_id ? 'customer_id': 'contact_id') };
  $scope.details2 = true;
  $scope.showAddress = false;
  $scope.style = '.,';
  $scope.disc_global = false;
  $scope.disc_line = false;
  $scope.show_modal = false;
  $scope.openeds = false;
  $scope.pick_date_format = 'dd/MM/yyyy';
  $scope.selectedInput = null;
  $scope.open = function($event,type) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.openeds = true;
    // $scope[type] = true;
    $scope.selectedInput = type;
  };
  $scope.$on('selectDate',function(arg,args){
    var d = date_fromater($scope.pick_date_format,args);
    $scope[$scope.selectedInput] = d;
    $scope.openeds = false;
    $scope.selectedInput = null;
    $scope.order.in.date = $scope.sdate;
    $scope.order.in.delivery_date = $scope.ddate;
  });
  $scope.$on('closeDateP',function(arg){ $scope.openeds = false; });
  $scope.doIt = function(method,params,callback){
    project.doGet(method,params).then(function(res){
      if (callback && typeof(callback) === "function" && res.code!='error') { callback(res); }else{ $location.path('orders'); }
      project.stopLoading();
    },function(){project.stopLoading();});
  }
  $scope.getLocation = function(val) {
    return $http.get('https://app.salesassist.eu/pim/mobile/admin/',{params:{'do':'orders-authors',api_key:localStorage.Otoken,username:localStorage.Ousername,term:val}}).then(function(res){
      var authors = [];
      angular.forEach(res.data, function(item){ authors.push(item); });
      return authors;
    });
  };
  $scope.addLine = function(){
    vibrate.vib(100);
    var random = new Date().getTime();
    var line = {"tr_id":"tmp" + random,"article":"","article_code":"","is_article_code":false,"article_id":"","tax_for_article_id":"0","is_tax":0,"quantity_old":"1","quantity":"1","price_vat":"","price":"","percent_x":"","percent":"","vat_value_x":"","vat_value":"","sale_unit_x":"1","packing_x":"1","sale_unit":"1","stock":"","pending_articles":0,"threshold_value":0,"packing":"1","content":"1","colspan":"","disc":"0","content_class":"","line_total":"0","th_width":"","td_width":"","input_width":""};
    $scope.order.article_line.push(line);
  }
  $scope.addArticle = function(item){
    // console.log($scope.order.in.currency_rate);
    vibrate.vib(100);
    $scope.show_pending_articles = false;
    var vpercent = $scope.order.remove_vat == 1 ? 0 : item.vat;
        price = $scope.order.in.currency_rate ? item.price/return_value($scope.order.in.currency_rate) : item.price,
        p_vat =  price*1 + price * vpercent/100,
        pack = item.packing ? return_value(item.packing) : 1,
        sale = item.sale_unit ? item.sale_unit : 1,
        random = new Date().getTime(),
        line_discont = return_value($scope.order.in.discount_line_gen);
    if($scope.order.allow_article_packing == 0){ pack = 1; sale = 1;}
    if($scope.order.allow_article_sale_unit == 0){ sale = 1; }
    var line_total = display_value((price - (price*line_discont/100) )  * item.quantity * ( pack / sale ));
    var line = {"tr_id":"tmp" + random,"article":item.quoteformat,"article_code":item.code,"is_article_code":true,"article_id":item.article_id,"tax_for_article_id":"0","is_tax":0,"quantity_old":"1","quantity":display_value(item.quantity),"price_vat":display_value(p_vat),"price": display_value(price),"percent_x": display_value(item.vat),"percent":item.vat,"vat_value_x":"","vat_value":"","sale_unit_x":"1","packing_x":"1","sale_unit":item.sale_unit,"stock":item.stock,"pending_articles":item.pending_articles,"threshold_value":item.threshold_value,"packing":item.packing,"content":"0","colspan":"","disc":$scope.order.in.discount_line_gen,"content_class":"","line_total":line_total,"th_width":"","td_width":"","input_width":""};
    $scope.order.article_line.push(line);
    $scope.calcTotal();
    $scope.alert_stock(item);
  }
  $scope.removeLine = function($i){ vibrate.vib(100);
    $scope.rmline = $i;
    vibrate.conf(LANG[project.lang]['Are you sure you want to remove this entries?'],$scope.reallyDelete,'Alert');
    // if($i > -1){ $scope.order.article_line.splice($i, 1); $scope.calcTotal(); }
  }
  $scope.reallyDelete = function(btnIndex){
    if(btnIndex == '1'){
      if($scope.rmline > -1){ $scope.order.article_line.splice($scope.rmline, 1); $scope.calcTotal(); }
    }
  }
  $scope.go = function(h){ vibrate.vib(100); $location.path(h); }
  $scope.autos = function(item){ $scope.order.author_id=item.id; }
  $scope.snap = function(){
    vibrate.vib(100);
    angular.element('.main_menu').show(0,function(){
      var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
      _this.removeClass('slide_right slide_left').css({'left':'-'+width+'px'});
      $timeout(function(){ _this.addClass('slide_left'); });
    });
  }
  $scope.handleGesture = function($event){ $scope.snap(); }
  $scope.snap_modal = function(){
    vibrate.vib(100);
    angular.element('.main_menu2').show(0,function(){
      var _this = angular.element('.m_wrapper');
      _this.removeClass('slide_right slide_left');
      $timeout(function(){ _this.addClass('slide_left'); });
    });
  }
  $scope.show = function(t){
    vibrate.vib(100);
    var eq = 0;
    // e.preventDefault();
    $scope[t] = !$scope[t];
    $scope.details2 = !$scope.details2;
    if(t == 'showAddress'){ eq = 1; }
    $timeout(function(){
      var h = angular.element('.orderdetails').eq(eq).outerHeight();
      if($scope.details2 === true){ h = 193; }
      angular.element('.lines').css({top:h+63});
    });
    return false
  }
  var display_value = function (number){
    var style = $scope.style;
    return number_format(number,2,style[1],style[0]);
  }
  var return_value = function(number){
    var style = $scope.style;
    var number1 = str_replace(style[0],'',number);
    var number2 = number1.replace(style[1],'.');
    return number2;
  }
  $scope.blur_disc = function(){ $scope.order.in.discount = display_value(return_value($scope.order.in.discount)); $scope.calcTotal(); }
  $scope.change_disc = function(){
    $scope.disc_global = false;
    $scope.disc_line = false;
    if($scope.order.in.apply_discount > 1){ $scope.disc_global = true; }
    if($scope.order.in.apply_discount == 1 || $scope.order.in.apply_discount == 3){ $scope.disc_line = true;  }
    $scope.calcTotal();
  }
  $scope.calc = function(l,s){
    var ldisc = $scope.disc_line ? return_value(l.disc) : 0,
        pack = l.packing ? return_value(l.packing) : 1,
        sale = l.sale_unit ? l.sale_unit : 1,
        vpercent = $scope.order.remove_vat == 1 ? 0 : l.percent;
    if($scope.order.allow_article_packing == 0){ pack = 1; sale = 1;}
    if($scope.order.allow_article_sale_unit == 0){ sale = 1; }
    switch (s){
      case 'price_vat':
        l.price_vat = display_value(return_value(l.price_vat));
        l.price = display_value(return_value(l.price_vat)/(1+vpercent/100));
        break;
      case 'price':
        l.price_vat = display_value(return_value(l.price)*1 + (return_value(l.price)*vpercent/100));
        l.price = display_value(return_value(l.price));
        break;
      case 'quantity':
        l.quantity = display_value(return_value(l.quantity));
        var params = { article_id: l.article_id,price:return_value(l.price) ,quantity:return_value(l.quantity), 'do': 'orders--order-get_article_quantity_price' };
        $scope.doIt('get',params,function(res){
          if(res.response){ l.price = display_value(res.response); return $scope.calc(l,'price'); }
        });
        $scope.alert_stock(l);
        break;
      case 'discount_line':
        l.disc = display_value(return_value(l.disc));
        break;
    }
    var p = return_value(l.price) - return_value(l.price)*ldisc/100;
    l.line_total = display_value(p * return_value(l.quantity) * ( pack / sale ));
    $scope.calcTotal();
  }
  $scope.calcTotal = function(){
    var gdisc = $scope.disc_global ? return_value($scope.order.in.discount) : 0,
        total = 0, vtotal = 0, tdiscount = 0;
    $scope.order.total_vat=0;
    angular.forEach($scope.order.article_line, function(item){
      var ldisc = $scope.disc_line ? return_value(item.disc) : 0,
          pack = item.packing ? return_value(item.packing) : 1,
          sale = item.sale_unit ? item.sale_unit : 1,
          p = return_value(item.price) - return_value(item.price)*ldisc/100,
          vpercent = $scope.order.remove_vat == 1 ? 0 : item.percent;
      if($scope.order.allow_article_packing == 0){ pack = 1; sale = 1;}
      if($scope.order.allow_article_sale_unit == 0){ sale = 1; }
      total += p * return_value(item.quantity) * ( pack / sale );
      p = p - p * gdisc / 100;
      vtotal += p*vpercent/100 * return_value(item.quantity) * ( pack / sale );
    });
    tdiscount = total * gdisc / 100;
    $scope.order.total_vat = display_value( vtotal + total - tdiscount );
    $scope.order.total_default_c = display_value((vtotal + total - tdiscount) * return_value($scope.order.in.currency_rate));
  }
  $scope.sortableOptions = { handle: ".move_line", axis: 'y' };
  $scope.save = function(){
    vibrate.vib(100);
    if($scope.order_id && $scope.order_id !=0){ $scope.order.do = 'orders--order-update_order'; }
    else{ $scope.order.do = 'orders--order-add_order'; }
    var data = $.param($scope.order);
    $scope.doIt('post',data,function(res){ $scope.order_id=res.response; $location.path('/vorder/'+$scope.order_id); });
  }
  $scope.snap_send = function(elem,d,t){
    vibrate.vib(100);
    if(d){ $scope.sel_del = d; }
    angular.element('.'+elem).show(0,function(){
      var _this = angular.element('.m_wrapper');
      _this.removeClass('slide_right slide_left');
      $timeout(function(){ _this.addClass('slide_left'); if(t){ $rootScope.$broadcast(t); } });
    });
  }
  $scope.remove_address = function(){
    $scope.show('showAddress');
    $scope.order.delivery_address = '';
    $scope.show('showAddress');
  }
   $scope.alert_stock = function(item){
    if($scope.order.allow_stock == 1 && $scope.order.show_stock_warning == 1){
      var new_stock=parseFloat(item.stock) - parseFloat(item.quantity);
      if(new_stock < parseFloat(item.threshold_value)){
        $scope.new_stock = new_stock;
        $scope.threshold_value = item.threshold_value;
        $scope.colors= 'ea7a69';
        if(new_stock<0){
          $scope.colors= 'ff2100';
        }
        if(item.pending_articles) {
          $scope.show_pending_articles = true;
          $scope.pending_articles = item.pending_articles
        }
        $scope.show_modal = true;
      }
    }
  }
  $scope.close_modal = function(){
    vibrate.vib(100);
    $scope.show_modal = false;
  }
  $timeout( function(){
    $scope.doIt('get',getparams,function(res){
      $scope.order = res;
      $scope.sdate = res.in.date;
      $scope.ddate = res.in.delivery_date;
      $scope.style = res.style;
      $scope.pick_date_format = res.pick_date_format;
      $scope.order.email_language = res.in.languages;
      if(!$scope.order.article_line){ $scope.order.article_line = []; }
      if(angular.isString($scope.order.show_vat_checked)){ if($scope.order.show_vat_checked == '1'){ $scope.order.show_vat_checked = true; }else{ $scope.order.show_vat_checked = false; } }
      if($scope.order.in.apply_discount > 1){ $scope.disc_global = true; }
      if($scope.order.in.apply_discount == 1 || $scope.order.in.apply_discount == 3){ $scope.disc_line = true;  }
    });
  });
}]).controller('menu',['$scope','project','$timeout','$location','vibrate',function ($scope,project,$timeout,$location,vibrate){
  $scope.snap_back = function(){
    vibrate.vib(100);
    $timeout(function(){ angular.element('.cmain_menu').addClass('slide_right'); });
    $timeout(function(){ angular.element('.main_menu').hide(); },400);
  }
  $scope.go = function(h){ vibrate.vib(100); $location.path(h); }
  $scope.handleGesture = function($event){ $scope.snap_back(); }
  $scope.name = localStorage.Olast_name && localStorage.Ofirst_name ? localStorage.Olast_name + ' ' + localStorage.Ofirst_name : localStorage.Ousername;
  $scope.email = localStorage.Oemail ? localStorage.Oemail : '';
  $scope.logout = function(){ vibrate.vib(100); var code ={}; code.logout = true; project.logout(code); }
}]).controller('modal', ['$scope','project','$timeout','vibrate', function ($scope,project,$timeout,vibrate){
  $scope.article_list = false;
  $scope.choice = true;
  $scope.articles = [];
  var spromise, cpromise;
  var getparams = { 'do':'orders-xproducts_list' };
  $scope.doIt = function(method,params,callback){
    project.doGet(method,params,'.modal_wrap ').then(function(res){
      if(res.code != 'error'){
        if (callback && typeof(callback) === "function") { callback(res); }
      }
      project.stopLoading();
    },function(){project.stopLoading();});
  }
  $scope.snap_back = function(){
    vibrate.vib(100);
    $timeout(function(){ angular.element('.m_wrapper').addClass('slide_right'); });
    $timeout(function(){ angular.element('.main_menu2').hide(); $scope.choice = true; $scope.article_list = false; },400);
  }
  $scope.show_art_list = function(){
    $scope.choice = false; $scope.article_list = true;
    getparams.cat_id = $scope.order.in.price_category_id ? $scope.order.in.price_category_id : 0;
    getparams.lang_id = $scope.order.in.languages;
    $timeout(function(){ $scope.doIt('get',getparams,function(res){
      $scope.pagg = res.pagin;
      $scope.backlink = res.backlink;
      $scope.nextlink = res.nextlink;
      $scope.last_link = res.last_link;
      $scope.first_link = res.first_link;
      $scope.is_pagination = res.is_pagination;
      $scope.articles.length = 0;
      angular.forEach(res.articles_row,function(value,key){ $scope.articles.push(value); });
    }); });
  }
  $scope.$on('show_art_list', function(arg,args) {
    $scope.show_art_list();
  });
  // $scope.show_art_list(); // once we have more buttons we remove this one;
  $scope.page = function(pag){
    if(pag == undefined){ return false; }
    vibrate.vib(100);
    getparams.offset = pag;
    $scope.doIt('get',getparams,function(res){
      $scope.pagg = res.pagin;
      $scope.backlink = res.backlink;
      $scope.nextlink = res.nextlink;
      $scope.last_link = res.last_link;
      $scope.first_link = res.first_link;
      $scope.is_pagination = res.is_pagination;
      $scope.articles.length = 0;
      angular.forEach(res.articles_row,function(value,key){ $scope.articles.push(value); });
    });
  }
  $scope.submit = function() {
    getparams.offset=0;
    getparams.search = $scope.serch;
    $scope.doIt('get',getparams,function(res){
      $scope.pagg = res.pagin;
      $scope.backlink = res.backlink;
      $scope.nextlink = res.nextlink;
      $scope.last_link = res.last_link;
      $scope.first_link = res.first_link;
      $scope.is_pagination = res.is_pagination;
      $scope.articles.length = 0;
      angular.forEach(res.articles_row,function(value,key){ $scope.articles.push(value); });
    });
  };
  $scope.add_article = function(item){
    $scope.addArticle(item);
    $scope.alerts=[{type:'success',msg:LANG[project.lang]['Article added']}];
    if(cpromise){ $timeout.cancel(cpromise); }
    cpromise = $timeout(function(){ $scope.closeAlert(0); },1500);
  }
  $scope.closeAlert=function(index){$scope.alerts.splice(index,1);}
  $scope.change_qty = function(item){
    var params = { article_id: item.article_id,price:item.price ,quantity:item.quantity, 'do': 'orders--order-get_article_quantity_price' };
    $scope.doIt('get',params,function(res){
      if(res.response){ item.price = res.response; }
    });
  }
  $scope.search = function(){
    if(spromise){ $timeout.cancel(spromise); }
    spromise = $timeout(function(){ $scope.submit(); },500);
  }
}]).controller('add_order', ['$scope','project','$location','$timeout','$http','vibrate', function ($scope,project,$location,$timeout,$http,vibrate){
  var getparams = { 'do':'orders-add_order' },cpromise;
  $scope.language_select = [{ name:"Dutch", val:3},{ name:"English", val:1},{ name:"French", val:2},{name:"German",val:4}];
  $scope.currency = [{ name:"EUR &euro;", val:1},{ name:"USD $", val:2},{ name:"GBP &pound;", val:3}];
  $scope.lq = 1;
  $scope.c = 1;
  $scope.cStuff = { comp_start : false, c_start : false };
  $scope.cs = function(){ $scope.buyer_id=0; $scope.s_buyer_id = ''; $scope.contact_id = 0; $scope.s_customer_id = ''; $scope.cStuff.comp_start = false; }
  $scope.cs2 = function(){ $scope.cStuff.c_start = false; }
  $scope.cs();
  $scope.snap = function(){
    vibrate.vib(100);
    angular.element('.main_menu').show(0,function(){
      var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
      _this.removeClass('slide_right slide_left').css({'left':'-'+width+'px'});
      $timeout(function(){ _this.addClass('slide_left'); });
    });
  }
  $scope.handleGesture = function($event){ $scope.snap(); }
  $scope.autos = function(item){
    $scope.buyer_id=item.id; $scope.lq = item.lang_id && item.lang_id!=0 ? item.lang_id : 1 ; $scope.c=item.currency_id && item.currency_id!=0 ? item.currency_id : 1; $scope.custname= item.ref;
    $scope.s_buyer_id = item.label; $scope.contact_id='';$scope.s_customer_id='';
    var details = { 'do':'orders-xcustomer_details', c_id:item.id };
    $scope.doIt('get',details,function(r){
      $scope.cStuff = r;
    });
  }
  $scope.autosc = function(item){
    $scope.contact_id=item.id; $scope.s_buyer_id = item.c_name; $scope.buyer_id=item.customer_id;
    var details = { 'do':'orders-xcustomer_details', c_id:item.customer_id,contact_id:item.id };
    $scope.doIt('get',details,function(r){
      $scope.cStuff = r;
    });
  }
  $scope.getLocation = function(val,pag) {
    var customer_id = $scope.buyer_id ? $scope.buyer_id : 0;
    return $http.get('https://app.salesassist.eu/pim/mobile/admin/',{params:{'do':'orders-'+pag,api_key:localStorage.Otoken,username:localStorage.Ousername,term:val, customer_id:customer_id}}).then(function(res){
      var authors = [];
      angular.forEach(res.data, function(item){ authors.push(item); });
      return authors;
    });
  };
  $scope.go = function(h,check){
    vibrate.vib(100);
    if(check === true){
      if($scope.buyer_id || $scope.contact_id){
        h += '/buyer_id='+$scope.buyer_id+'&s_buyer_id='+$scope.s_buyer_id+'&contact_id='+$scope.contact_id+'&s_customer_id='+$scope.s_customer_id+'&currency_type='+$scope.c+'&languages='+$scope.lq;
        $location.path(h);
      }else{
        $scope.alerts=[{type:'danger',msg:LANG[project.lang]['Please select a company or a contact']}];
        // if(cpromise){ $timeout.cancel(cpromise); }
        // cpromise = $timeout(function(){ $scope.closeAlert(0); },1500);
      }
      return false;
    }
    $location.path(h);
  }
  $scope.closeAlert=function(index){$scope.alerts.splice(index,1);}
  $scope.doIt = function(method,params,callback){
    project.doGet(method,params,'.modal_wrap ').then(function(res){
      if (callback && typeof(callback) === "function" && res.code != 'error') { callback(res); }
      project.stopLoading();
    },function(){project.stopLoading();});
  }
  $timeout(function(){
    $scope.doIt('get',getparams,function(r){
      $scope.language_select = r.l;
      $scope.currency = r.c;
    });
  });
}]).controller('vorder', ['$scope','project','$routeParams','$location','$timeout','$route','$rootScope','vibrate', function ($scope,project,$routeParams,$location,$timeout,$route,$rootScope,vibrate){
  if(isNaN($routeParams.id)){ $location.path('/orders'); }
  var getparams = { 'do':'orders-order','order_id': $routeParams.id };
  $scope.order = { 'order_buyer_name':'-','languages_pdf':[{ language:"Dutch", pdf_link_loop:3},{ language:"English", pdf_link_loop:1},{ language:"French", pdf_link_loop:2}],'languages':1,'include_pdf_checked':false,'in':{copy:false},'total_hide':true,'sh_vat':true};
  $scope.details = false;
  $scope.revert = false;
  $scope.ss = [];
  $scope.doIt = function(method,params,callback){
    project.doGet(method,params).then(function(res){
      if (callback && typeof(callback) === "function" && res.code != 'error') { callback(res); }
      if(res.code == 'error'){ $location.path('/orders'); }
      project.stopLoading();
    },function(){project.stopLoading();});
  }
  $scope.snap = function(){
    vibrate.vib(100);
    angular.element('.main_menu').show(0,function(){
      var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
      _this.removeClass('slide_right slide_left').css({'left':'-'+width+'px'});
      $timeout(function(){ _this.addClass('slide_left'); });
    });
  }
  $scope.handleGesture = function($event){ $scope.snap(); }
  $timeout(function(){
    $scope.doIt('get',getparams,function(res){
      $scope.order = res;
      $scope.func();
    });
  });
  $scope.func = function(){
    $scope.revert = false;
    $scope.order.in.copy = false;
    if($scope.order.include_pdf_checked == "true" ){ $scope.order.include_pdf_checked = true }else{ $scope.order.include_pdf_checked = false; }
    if($scope.order.is_editable != 1 && !$scope.order.delivery ){ $scope.revert = true; }
  }
  $scope.show = function(t,f){
    vibrate.vib(100);
    $scope[t] = !$scope[t];
    angular.element('.show_btns').toggleClass('hide_btns');
  }
  $scope.go = function(h,check){ vibrate.vib(100); $location.path(h); }
  $scope.delete_order = function(item){
    vibrate.vib(100);
    var params = {};
    params.do = 'orders--order-archive_order';
    params.order_id = item;
    $scope.doIt('get',params,function(){ $location.path('orders'); });
  }
  $scope.mark = function(p,t){
    vibrate.vib(100);
    var params = p;
    $scope.doIt('get',params,function(res){
      if(res.code =='ok'){
        $scope.order.is_editable = !$scope.order.is_editable;
        $scope.func();
      }
      if(t === true){
        $scope.order = res;
        $scope.func();
      }
    });
  }
  $scope.snap_send = function(elem,d,t){
    vibrate.vib(100);
    if(d){ $scope.sel_del = d; }
    angular.element('.'+elem).show(0,function(){
      var _this = angular.element('.m_wrapper');
      _this.removeClass('slide_right slide_left');
      $timeout(function(){ _this.addClass('slide_left'); if(t){ $rootScope.$broadcast('do_get'); } });
    });
  }
}]).controller('send_by_email', ['$scope','$timeout','$http', function ($scope,$timeout,$http){
  $scope.send = function (){
    var params = {};
    params.do = 'orders--order-send';
    params.order_id = $scope.order.order_id;
    params.copy = $scope.order.in.copy;
    params.recipients = [];
    params.include_pdf = $scope.order.include_pdf_checked === true ? 1 : 0;
    params.e_message = $scope.order.e_message;
    params.subject = $scope.order.subject;
    params.lid = $scope.order.languages;
    angular.forEach($scope.ss,function(value,key){
      if(value===true){ params.recipients.push(key); }
    });
    $scope.doIt('get',params,function(){ $scope.snap_back(); });
  }
  $scope.snap_back = function(elem){
    $timeout(function(){ angular.element('.m_wrapper').addClass('slide_right'); });
    $timeout(function(){ angular.element('.'+elem).hide(); },400);
  }
  $scope.set_model = function(m,i){ $scope[m][i] = !$scope[m][i]; }
  $scope.set_m = function(m){ $scope[m] = !$scope[m]; }
  $scope.set_copy = function(){ $scope.order.in.copy = !$scope.order.in.copy; }
  $scope.set_pdf = function(){ $scope.order.include_pdf_checked = !$scope.order.include_pdf_checked; }
  $scope.getLocation = function(val,pag) {
    return $http.get('https://app.salesassist.eu/pim/mobile/admin/',{params:{'do':'orders-'+pag,api_key:localStorage.Otoken,username:localStorage.Ousername,term:val, customer_id:$scope.order.buyer_id}}).then(function(res){
      var authors = [];
      angular.forEach(res.data, function(item){ authors.push(item); });
      return authors;
    });
  };
  $scope.autosc = function(item){ $scope.del_contact_id=item.id; }
  $scope.send_del = function (){
    var params = {};
    params.do = 'orders--order-notice';
    params.order_id = $scope.order.order_id;
    params.copy = $scope.copy;
    params.c_email = $scope.c_email;
    params.send_to = $scope.send_to;
    params.lid = $scope.order.languages;
    params.include_pdf = $scope.order.include_pdf_checked === true ? 1 : 0;
    params.e_message = $scope.e_message;
    params.subject = $scope.subject;
    params.contact_id = $scope.del_contact_id;
    params.customer_id = $scope.order.buyer_id;
    params.delivery_id = $scope.sel_del;
    $scope.doIt('get',params,function(){ $scope.snap_back('editd'); });
  }
}]).controller('view_del', ['$scope','$timeout','$http','vibrate', function ($scope,$timeout,$http,vibrate){
  $scope.dely = [];
  $scope.do_it = function (){
    $scope.dely = [];
    var params = {};
    params.do = 'orders-view_order_line';
    params.order_id = $scope.order.order_id;
    params.delivery_id = $scope.sel_del;
    $scope.doIt('get',params,function(res){ $scope.dely = res; });
  }
  $scope.$on('do_get', function(arg,args) {
    $scope.do_it();
  });
  $scope.snap_back = function(elem){
    vibrate.vib(100);
    $timeout(function(){ angular.element('.m_wrapper').addClass('slide_right'); });
    $timeout(function(){ angular.element('.'+elem).hide(); },400);
  }
}]).controller('sel_del', ['$scope','$timeout','$http', function ($scope,$timeout,$http){
  $scope.adel = [];
  $scope.selected_address = '';
  // var e = new MouseEvent('click', { 'view': window, 'bubbles': true, 'cancelable': true });
  $scope.do_it = function (){
    $scope.adel = [];
    var params = {};
    params.do = 'orders-xdelivery_address_list';
    params.customer_id = $scope.order.in.customer_id;
    if(!params.customer_id){ params.contact_id = $scope.order.in.contact_id; }
    $scope.doIt('get',params,function(res){ $scope.adel = res; });
  }
  $scope.$on('do_get', function(arg,args) { $scope.do_it(); });
  $scope.snap_back = function(elem){
    $timeout(function(){ angular.element('.m_wrapper').addClass('slide_right'); });
    $timeout(function(){ angular.element('.'+elem).hide(); },400);
    $scope.show('showAddress');
    $scope.show('showAddress');
  }
  $scope.set_item = function(item){
    $scope.selected_address = item.address+"\n"+item.zip+" "+item.city+"\n"+item.country;
  }
  $scope.select = function(){
    if($scope.selected_address){
      $scope.order.delivery_address = $scope.selected_address;
      $scope.selected_address = ''; }
    $scope.snap_back('viewd');
  }
  $scope.cancel = function(){
    $scope.selected_address = '';
    $scope.snap_back('viewd');
  }
}]).controller('dashboard', ['$scope','project','$timeout','$location','checkConnection','$rootScope','vibrate', function ($scope,project,$timeout,$location,checkConnection,$rootScope,vibrate){
  var getparams = {};
  getparams.do = 'orders-orders';
  getparams.view = 2;
  getparams.limit = 5;
  $scope.all = 0;
  $scope.all_ready = 0;
  $scope.all_del = 0;
  $scope.all_del_last = 0;
  $scope.all_draft = 0;
  $scope.snap = function(){
    vibrate.vib(100);
    angular.element('.main_menu').show(0,function(){
      var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
      _this.removeClass('slide_right slide_left').css({'left':'-'+width+'px'});
      $timeout(function(){ _this.addClass('slide_left'); });
    });
  }
  $scope.orders = [];
  $scope.doIt = function(method,params,callback){
    project.doGet(method,params).then(function(res){
      if(res.code!='error'){
        if (callback && typeof(callback) === "function") { callback(res); }
      }
      project.stopLoading();
    },function(){project.stopLoading();});
  }
  $scope.go = function(h,t){ vibrate.vib(100); var p = t ? h+'/'+t : h; $location.path(p);  }
/*chart*/
  $scope.chartConfig = {
    // categories : ['Delivered', 'Ready', 'Draft'],
    options: { chart: { type: 'pie' } },
    series: [{
      type: 'pie',
      name: LANG[project.lang]['Orders'],
      innerSize: '90%',
      dataLabels: { formatter: function() { return  null; } },
      data: [
        {name: LANG[project.lang]['Delivered'],       y: $scope.all_del,   color: "#67b34f"},
        {name: LANG[project.lang]['Delivered'],   y: $scope.all_del_last, color: "#83fa5d"}
        ]
    }],
    title: { text: LANG[project.lang]['Last Month / This Month'] },
    credits: { enabled: false }
  }
  $scope.linechartConfig = {
    options: { chart: { type: 'column' },legend: { enabled: false } },
    series: [{
      // name: 'Articles',
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }],
    xAxis: { categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] },
    yAxis: { title: { text: LANG[project.lang]['Articles'] } },
    title: { text: LANG[project.lang]['Last 12 Months sold articles'] },
    credits: { enabled: false },
    size: { height: 325 }
  }
  $scope.resizeLineChart = function(){
    var h = window.innerHeight - (angular.element('.border_b').outerHeight()+angular.element('#top_menu').outerHeight()) - 10;
    $scope.$apply(function(){ $scope.linechartConfig.size.height = h; });
  }
  window.addEventListener('orientationchange', $scope.resizeLineChart, false);
  /*chart*/
  $scope.snap = function(){
    vibrate.vib(100);
    angular.element('.main_menu').show(0,function(){
      var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
      _this.removeClass('slide_right slide_left').css({'left':'-'+width+'px'});
      $timeout(function(){ _this.addClass('slide_left'); });
    });
  }
  $scope.handleGesture = function($event){ $scope.snap(); }
  $timeout( function(){
    $scope.doIt('get',getparams,function(res){
      $scope.all_ready=parseFloat(res.all_ready);
      $scope.all_del=parseFloat(res.all_del_this);
      $scope.all_del_last=parseFloat(res.all_del_last);
      $scope.all_draft=parseFloat(res.all_draft);
      $scope.all = res.all,
      $scope.chartConfig.series[0].data = [
        {name: LANG[project.lang]['Delivered'],       y: $scope.all_del,   color: "#67b34f"},
        {name: LANG[project.lang]['Delivered'],   y: $scope.all_del_last, color: "#83fa5d"}
      ];
      $scope.linechartConfig.series[0].data = res.in.art_all;
      $scope.linechartConfig.xAxis.categories = res.in.month_all;
      var h = window.innerHeight - (angular.element('.border_b').outerHeight()+angular.element('#top_menu').outerHeight()) - 10;
      $scope.linechartConfig.size.height = h;
      $scope.orders.length = 0;
      angular.forEach(res.order_row,function(value,key){ $scope.orders.push(value); });
    });
  });
}]);
