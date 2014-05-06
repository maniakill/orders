// var ctrl=angular.module('ctrl',[]);
// start
// ctrl.controller('start',['$scope','$timeout','$location',
// 	function ($scope,$timeout,$location){
// 		var token = localStorage.getItem('token');
// 		var target = token ? '/contacts' : '/login';
// 		$timeout(function() { $location.path(target); }, 1000);
// 	}
// ]);
// login
app.controller('login',['$scope','$http','$templateCache','$location','$timeout','project',
	function ($scope,$http,$templateCache,$location,$timeout,project) {
		$scope.method = 'POST';
		$scope.url = 'https://go.salesassist.eu/pim/mobile/';
		$scope.loged = '';
		$scope.params = [];
		$scope.fetch = function() {
			$scope.params['username']=$scope.username;
			$scope.params['password']=$scope.password;
			if($scope.params['username'] && $scope.params['password']){
				$http({method:$scope.method,url:$scope.url,cache:$templateCache,params:$scope.params}).
				success(function(data,status) {
					if(data.code == 'ok'){
						localStorage.setItem('token',data.response);
						localStorage.setItem('username',$scope.params['username']);
						project.setKey();
						$location.path('/contacts');
					}else{
						$scope.alerts=[{type:'error',msg:data.error_code}];
						$timeout(function(){ $scope.closeAlert(0); },3000);
					}
				}).
				error(function(data,status){
					$scope.alerts=[{type:'error',msg:'Server error. Please try later'}];
					$timeout(function(){ $scope.closeAlert(0); },3000);
				});
			}else{
				$scope.alerts=[{type:'error',msg:'Please fill all the fields'}];
				// $timeout(function(){ $scope.closeAlert(0); },3000);
			}
		};
		$scope.closeAlert=function(index){$scope.alerts.splice(index,1);}
		$scope.openInBrowser=function(){ window.open('https://go.salesassist.eu', '_system', 'location=yes'); }
	}
]);
// orders
app.controller('orders',['$scope','project',
	function ($scope,project) {
		$scope.views = [{name:'All',view:'all',active:'active'},{name:'Draft',view:'draft',active:''},{name:'Ready to deliver',view:'ready',active:''},{name:'Fully delivered',view:'fully',active:''}];

	}
])
