app.controller('login',['$scope','$http','$templateCache','$location','$timeout','project',function ($scope,$http,$templateCache,$location,$timeout,project) {
	$scope.method = 'POST';
	$scope.url = 'https://app.salesassist.eu/pim/mobile/admin/';
	$scope.params = [];
	$scope.lang = {};
	angular.forEach(LANG[project.lang],function(value,key){
		$scope.lang[key]=value;
	});
	$scope.fetch = function() {
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
					$location.path('/orders');
				}else{
					$scope.alerts=[{type:'error',msg:data.error_code}];
					$timeout(function(){ $scope.closeAlert(0); },3000);
				}
			}).
			error(function(data,status){
				$scope.alerts=[{type:'error',msg:LANG[project.lang]['Server error. Please try later']}];
				$timeout(function(){ $scope.closeAlert(0); },3000);
			});
		}else{
			$scope.alerts=[{type:'error',msg:LANG[project.lang]['Please fill all the fields']}];
			$timeout(function(){ $scope.closeAlert(0); },3000);
		}
	};
	$scope.closeAlert=function(index){$scope.alerts.splice(index,1);}
	$scope.openInBrowser=function(){ window.open('https://app.salesassist.eu', '_system', 'location=yes'); }
}]).controller('orders',['$scope','project','$filter','$timeout',function ($scope,project,$filter,$timeout) {
	var getparams = {};
	getparams.do = 'orders-orders';
	getparams.view = 0;
	$scope.views = [{name:'All',view:'all',active:'active',p:'0'},{name:'Draft',view:'draft',active:'',p:'1'},{name:'Ready to deliver',view:'ready',active:'',p:'2'},{name:'Fully delivered',view:'fully',active:'',p:'3'}];
	$scope.search = false;
	$scope.pick_date_format = '';
	$scope.showSearch = function(){
		$scope.search = !$scope.search;
		angular.element('.search').toggleClass('cancel');
		angular.element('.loaded').toggleClass('lower');
		if(!$scope.search){
			$scope.serch=''; $scope.sdate=''; $scope.edate=''; $scope.ddate=''; $scope.dedate='';
    	$scope.submit();
		}
	}
	$scope.orders = [];
	$scope.pagg = '';
	$scope.doIt = function(method,params,callback){
		project.doGet(method,params).then(function(res){
			$scope.pagg = res.pagin;
			$scope.backlink = res.backlink;
			$scope.nextlink = res.nextlink;
			$scope.last_link = res.last_link;
			$scope.first_link = res.first_link;
			$scope.is_pagination = res.is_pagination;
			$scope.orders.length = 0;
			angular.forEach(res.order_row,function(value,key){ $scope.orders.push(value); });
			if (callback && typeof(callback) === "function") { callback(); }
  		$scope.pick_date_format = res.pick_date_format;
			project.stopLoading();
		},function(){project.stopLoading();});
	}
	$scope.doIt('get',getparams);
	$scope.submit = function() {
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
		angular.element('.main_menu').show(0,function(){
			var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
			_this.removeClass('slide_right slide_left').css({'right':'-'+width+'px'});
			$timeout(function(){ _this.addClass('slide_left'); });
		});
	}
	$scope.handleGesture = function($event){ $scope.snap();	}
	$scope.page = function(pag){
		if(pag == undefined){ return false; }
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
	$scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();
  $scope.clear = function () {
    $scope.dt = null;
  };
  $scope.open = function($event,type) {
  	$event.preventDefault();
    $event.stopPropagation();
    $scope.openeds = false;
    $scope.openede = false;
    $scope.openedds = false;
    $scope.openedde = false;
    $scope[type] = true;
  };
  $scope.dateOptions = { 'starting-day': 1 };
/* datepicker */
}]).controller('order', ['$scope','project','$http','$timeout','$routeParams','$location', function ($scope,project,$http,$timeout,$routeParams,$location){
	$scope.order_id = isNaN($routeParams.id) === false ? $routeParams.id : 0;
	var s = $routeParams.id.split('&'),p = [];
	for(x in s){
		var a = s[x].split('=');
		p[a[0]] = a[1];
	}
	var getparams = { 'do':'orders-norder','order_id':$scope.order_id, 'buyer_id':p.buyer_id, 'contact_id':p.contact_id, 's_buyer_id':p.s_buyer_id, 's_customer_id':p.s_customer_id,'currency_type':p.currency_type,'languages':p.languages };
	$('select').width($('.date').outerWidth()-17);
	$scope.dateOptions = { 'starting-day': 1 };
	$scope.details = false;
	$scope.order = {'in':{serial_number:''},author_id:'',customer_name:'&nbsp;',total_vat:'&nbsp;',article_line:[]};
	$scope.details2 = true;
	$scope.showAddress = false;
	$scope.autorul_puli='';
	$scope.style = '.,';
	$scope.disc_global = false;
	$scope.disc_line = false;
	$scope.open = function($event,type) {
  	$event.preventDefault();
    $event.stopPropagation();
    $scope.opens = false;
    $scope.opend = false;
    $scope[type] = true;
  };
  $scope.doIt = function(method,params,callback){
  	project.doGet(method,params).then(function(res){
  		if (callback && typeof(callback) === "function") { callback(res); }
  		project.stopLoading();
		},function(){project.stopLoading();});
	}
	$scope.doIt('get',getparams,function(res){
		$scope.order = res;
		$scope.style = res.style;
		if(!$scope.order.article_line){ $scope.order.article_line = []; }
		if(angular.isString($scope.order.show_vat_checked)){ if($scope.order.show_vat_checked == '1'){ $scope.order.show_vat_checked = true; }else{ $scope.order.show_vat_checked = false; } }
		if($scope.order.acc_manager){ $scope.autorul_puli = project.utf8_encode($scope.order.acc_manager); }
		if($scope.order.in.apply_discount > 1){ $scope.disc_global = true; }
		if($scope.order.in.apply_discount == 1 || $scope.order.in.apply_discount == 3){ $scope.disc_line = true;  }
	});
  $scope.getLocation = function(val) {
    return $http.get('https://app.salesassist.eu/pim/mobile/admin/',{params:{'do':'orders-authors',api_key:localStorage.Otoken,username:localStorage.Ousername,term:val}}).then(function(res){
      var authors = [];
      angular.forEach(res.data, function(item){ authors.push(item); });
      return authors;
    });
  };
  $scope.addLine = function(){
  	var random = new Date().getTime();
    var line = {"tr_id":"tmp" + random,"article":"","article_code":"","is_article_code":false,"article_id":"","tax_for_article_id":"0","is_tax":0,"quantity_old":"1","quantity":"1","price_vat":"","price":"","percent_x":"","percent":"","vat_value_x":"","vat_value":"","sale_unit_x":"1","packing_x":"1","sale_unit":"1","stock":"","pending_articles":0,"threshold_value":0,"packing":"1","content":"1","colspan":"","disc":"0","content_class":"","line_total":"0","th_width":"","td_width":"","input_width":""};
    $scope.order.article_line.push(line);
  }
  $scope.addArticle = function(item){
  	var vpercent = $scope.order.remove_vat == 1 ? 0 : item.vat;
  			p_vat =  item.price*1 + item.price * vpercent/100,
  			pack = item.packing ? item.packing : 1,
  			sale = item.sale_unit ? item.sale_unit : 1,
  			random = new Date().getTime();
  	if($scope.order.allow_article_packing == 0){ pack = 1; sale = 1;}
  	if($scope.order.allow_article_sale_unit == 0){ sale = 1; }
  	var line_total = display_value(item.price * ( pack / sale ));
  	var line = {"tr_id":"tmp" + random,
  							"article":item.quoteformat,
  							"article_code":item.code,
  							"is_article_code":true,
  							"article_id":item.article_id,
  							"tax_for_article_id":"0",
  							"is_tax":0,
  							"quantity_old":"1",
  							"quantity":display_value(1),
  							"price_vat":display_value(p_vat),
  							"price": display_value(item.price),
  							"percent_x": display_value(item.vat),
  							"percent":item.vat,
  							"vat_value_x":"",
  							"vat_value":"",
  							"sale_unit_x":"1",
  							"packing_x":"1",
  							"sale_unit":item.sale_unit,
  							"stock":"",
  							"pending_articles":item.pending_articles,
  							"threshold_value":item.threshold_value,
  							"packing":item.packing,
  							"content":"0",
  							"colspan":"",
  							"disc":"0",
  							"content_class":"",
  							"line_total":line_total,
  							"th_width":"",
  							"td_width":"",
  							"input_width":""};
  	$scope.order.article_line.push(line);
  	$scope.calcTotal();
  }
  $scope.removeLine = function($i){ if($i > -1){ $scope.order.article_line.splice($i, 1); $scope.calcTotal(); } }
  $scope.go = function(h){ $location.path(h); }
  $scope.autos = function(item){ $scope.order.author_id=item.id; }
  $scope.snap = function(){
		angular.element('.main_menu').show(0,function(){
			var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
			_this.removeClass('slide_right slide_left').css({'right':'-'+width+'px'});
			$timeout(function(){ _this.addClass('slide_left'); });
		});
	}
	$scope.handleGesture = function($event){ $scope.snap();	}
	$scope.snap_modal = function(){
		angular.element('.main_menu2').show(0,function(){
			var _this = angular.element('.m_wrapper');
			_this.removeClass('slide_right slide_left');
			$timeout(function(){ _this.addClass('slide_left'); });
		});
	}
  $scope.show = function(e,t){
  	var eq = 0;
  	e.preventDefault();
  	$scope[t] = !$scope[t];
  	$scope.details2 = !$scope.details2;
  	if(t == 'showAddress'){ eq = 1; }
  	$timeout(function(){
  		var h = angular.element('.orderdetails').eq(eq).outerHeight();
  		if($scope.details2 === true){ h = 193; }
  		angular.element('.lines').css({top:h+63});
  	});
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
  			pack = l.packing ? l.packing : 1,
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
  				pack = item.packing ? item.packing : 1,
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
  }  
  $scope.sortableOptions = { handle: ".move_line", axis: 'y' };
  $scope.save = function(){  	
  	if($scope.order_id && $scope.order_id !=0){ $scope.order.do = 'orders--order-update_order'; }
  	else{ $scope.order.do = 'orders--order-add_order'; }
  	var data = $.param($scope.order);
  	$scope.doIt('post',data,function(res){ $scope.order_id=res.response; });
  }
}]).controller('menu',['$scope','project','$timeout','$location',function ($scope,project,$timeout,$location){
	$scope.snap_back = function(){
		$timeout(function(){ angular.element('.cmain_menu').addClass('slide_right'); });
		$timeout(function(){ angular.element('.main_menu').hide(); },400);
	}
	$scope.go = function(h){ $location.path(h); }
	$scope.handleGesture = function($event){ $scope.snap_back(); }
	$scope.name = localStorage.Olast_name && localStorage.Ofirst_name ? localStorage.Olast_name + ' ' + localStorage.Ofirst_name : localStorage.Ousername;
	$scope.email = localStorage.Oemail ? localStorage.Oemail : '';
	$scope.logout = function(){ var code ={}; code.logout = true; project.logout(code); }
}]).controller('modal', ['$scope','project','$timeout', function ($scope,project,$timeout){
	$scope.article_list = false;
	$scope.choice = true;
	$scope.articles = [];
	var getparams = { 'do':'orders-xproducts_list' };
	$scope.doIt = function(method,params,callback){
		project.doGet(method,params,'.modal_wrap ').then(function(res){
			$scope.pagg = res.pagin;
			$scope.backlink = res.backlink;
			$scope.nextlink = res.nextlink;
			$scope.last_link = res.last_link;
			$scope.first_link = res.first_link;
			$scope.is_pagination = res.is_pagination;
			$scope.articles.length = 0;
			angular.forEach(res.articles_row,function(value,key){ $scope.articles.push(value); });
			if (callback && typeof(callback) === "function") { callback(); }
  		project.stopLoading();
		},function(){project.stopLoading();});
	}
	$scope.snap_back = function(){
		$timeout(function(){ angular.element('.m_wrapper').addClass('slide_right'); });
		$timeout(function(){ angular.element('.main_menu2').hide(); $scope.choice = true; $scope.article_list = false; },400);
	}
	$scope.show_art_list = function(){
		$scope.choice = false; $scope.article_list = true;
		getparams.cat_id = $scope.order.in.price_category_id ? $scope.order.in.price_category_id : 0;
		getparams.lang_id = $scope.order.in.languages;
		$timeout(function(){ $scope.doIt('get',getparams); });
	}
	$scope.page = function(pag){
		if(pag == undefined){ return false; }
		getparams.offset = pag;
		$scope.doIt('get',getparams);
	}
	$scope.submit = function() {
		getparams.offset=0;
		getparams.search = $scope.serch;
    $scope.doIt('get',getparams);
  };
  $scope.add_article = function(item){ $scope.addArticle(item); }
}]).controller('add_order', ['$scope','project','$location','$timeout','$http', function ($scope,project,$location,$timeout,$http){
	var getparams = { 'do':'orders-add_order' };
	$scope.language_select = [{ name:"Dutch", val:3},{ name:"English", val:1},{ name:"French", val:2}];
	$scope.currency = [{ name:"EUR &euro;", val:1},{ name:"USD $", val:2},{ name:"GBP &pound;", val:3}];
	$scope.lq = 1;
	$scope.c = 1;
	$scope.cs = function(){ $scope.buyer_id=0; $scope.s_buyer_id = ''; $scope.contact_id = 0; $scope.s_customer_id = ''; }
	$scope.cs();
	$scope.snap = function(){
		angular.element('.main_menu').show(0,function(){
			var _this = angular.element('.cmain_menu'), width = _this.outerWidth();
			_this.removeClass('slide_right slide_left').css({'right':'-'+width+'px'});
			$timeout(function(){ _this.addClass('slide_left'); });
		});
	}
	$scope.handleGesture = function($event){ $scope.snap();	}
	$scope.autos = function(item){ $scope.buyer_id=item.id; $scope.lq = item.lang_id && item.lang_id!=0 ? item.lang_id : 1 ; $scope.c=item.currency_id && item.currency_id!=0 ? item.currency_id : 1; }
	$scope.autosc = function(item){ $scope.contact_id=item.id; $scope.s_buyer_id = item.c_name; $scope.buyer_id=item.customer_id; }
	$scope.getLocation = function(val,pag) {
		var customer_id = $scope.buyer_id ? $scope.buyer_id : 0;
    return $http.get('https://app.salesassist.eu/pim/mobile/admin/',{params:{'do':'orders-'+pag,api_key:localStorage.Otoken,username:localStorage.Ousername,term:val, customer_id:customer_id}}).then(function(res){
      var authors = [];
      angular.forEach(res.data, function(item){ authors.push(item); });
      return authors;
    });
  };
  $scope.go = function(h,check){
  	if(check === true){
  		if($scope.buyer_id || $scope.contact_id){
  			h += '/buyer_id='+$scope.buyer_id+'&s_buyer_id='+$scope.s_buyer_id+'&contact_id='+$scope.contact_id+'&s_customer_id='+$scope.s_customer_id+'&currency_type='+$scope.c+'&languages='+$scope.lq;
  			$location.path(h);
  		}
  		return false;
  	}
  	$location.path(h);
  }
  $scope.doIt = function(method,params,callback){
		project.doGet(method,params,'.modal_wrap ').then(function(res){
			if (callback && typeof(callback) === "function") { callback(res); }
  		project.stopLoading();
		},function(){project.stopLoading();});
	}
	$scope.doIt('get',getparams,function(r){
		$scope.language_select = r.l;
		$scope.currency = r.c;
	});
}]);