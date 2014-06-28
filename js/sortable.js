/*
 jQuery UI Sortable plugin wrapper

 @param [ui-sortable] {object} Options to pass to $.fn.sortable() merged onto ui.config
 */
angular.module('ui.sortable', [])
  .value('uiSortableConfig',{})
  .directive('uiSortable', [
    'uiSortableConfig', '$timeout', '$log',
    function(uiSortableConfig, $timeout, $log) {
      return {
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
          var savedNodes;
          function combineCallbacks(first,second){
            if(second && (typeof second === 'function')) {
              return function(e, ui) {
                first(e, ui);
                second(e, ui);
              };
            }
            return first;
          }
          function hasSortingHelper (element) {
            var helperOption = element.sortable('option','helper');
            return helperOption === 'clone' || typeof helperOption === 'function';
          }
          var opts = {};
          var callbacks = { receive: null, remove:null, start:null, stop:null, update:null };
          angular.extend(opts, uiSortableConfig, scope.$eval(attrs.uiSortable));
          if (!angular.element.fn || !angular.element.fn.jquery) {
            $log.error('ui.sortable: jQuery should be included before AngularJS!');
            return;
          }
          if (ngModel) {
            scope.$watch(attrs.ngModel+'.length', function() {
              $timeout(function() {
                if (!!element.data('ui-sortable')) { element.sortable('refresh'); }
              });
            });
            callbacks.start = function(e, ui) {console.log('start');
              ui.item.sortable = {
                index: ui.item.index(),
                cancel: function () { ui.item.sortable._isCanceled = true; },
                isCanceled: function () { return ui.item.sortable._isCanceled; },
                _isCanceled: false
              };
            };
            callbacks.activate = function(/*e, ui*/) {
              savedNodes = element.contents();
              var placeholder = element.sortable('option','placeholder');
              if (placeholder && placeholder.element && typeof placeholder.element === 'function') {
                var phElement = placeholder.element();
                phElement = angular.element(phElement);
                var excludes = element.find('[class="' + phElement.attr('class') + '"]');
                savedNodes = savedNodes.not(excludes);
              }
            };
            callbacks.update = function(e, ui) {
              if(!ui.item.sortable.received) {
                ui.item.sortable.dropindex = ui.item.index();
                ui.item.sortable.droptarget = ui.item.parent();
                element.sortable('cancel');
              }
              if (hasSortingHelper(element) && !ui.item.sortable.received) { savedNodes = savedNodes.not(savedNodes.last()); }
              savedNodes.appendTo(element);
              if(ui.item.sortable.received && !ui.item.sortable.isCanceled()) {
                scope.$apply(function () {
                  ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0, ui.item.sortable.moved);
                });
              }
            };
            callbacks.stop = function(e, ui) {
              if(!ui.item.sortable.received &&
                 ('dropindex' in ui.item.sortable) &&
                 !ui.item.sortable.isCanceled()) {
                scope.$apply(function () {
                  ngModel.$modelValue.splice(
                    ui.item.sortable.dropindex, 0,
                    ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]);
                });
              } else {
                if ((!('dropindex' in ui.item.sortable) || ui.item.sortable.isCanceled()) && !hasSortingHelper(element)) { savedNodes.appendTo(element); }
              }
            };
            callbacks.receive = function(e, ui) { ui.item.sortable.received = true; };
            callbacks.remove = function(e, ui) {
              if (!ui.item.sortable.isCanceled()) {
                scope.$apply(function () {
                  ui.item.sortable.moved = ngModel.$modelValue.splice(
                    ui.item.sortable.index, 1)[0];
                });
              }
            };
            scope.$watch(attrs.uiSortable, function(newVal /*, oldVal*/) {
              if (!!element.data('ui-sortable')) {
                angular.forEach(newVal, function(value, key) {
                  if(callbacks[key]) {
                    if( key === 'stop' ){
                      value = combineCallbacks( value, function() { scope.$apply(); });
                    }
                    value = combineCallbacks(callbacks[key], value);
                  }
                  element.sortable('option', key, value);
                });
              }
            }, true);
            angular.forEach(callbacks, function(value, key) {
              opts[key] = combineCallbacks(value, opts[key]);
            });
          } else { $log.info('ui.sortable: ngModel not provided!', element); }
          element.sortable(opts);
        }
      };
    }
  ]);
