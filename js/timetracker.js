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
}
function date_fromater(format,date){
  if(!format) return '';
  if(!date) return '';
  var day = date.getDate();
  var month = date.getMonth()+1;
  var year = date.getFullYear();
  if(day < 10 ){ day = '0'+day; }
  if(month < 10 ){ month = '0'+month; }
  switch(format){
    case 'MM/dd/yyyy':
      return month + '/' + day + '/' + year;
      break;
    case 'dd/MM/yyyy':
      return day + '/' + month + '/' + year;
      break;
    case 'yyyy-MM-dd':
      return year + '-' + month + '-' + day;
      break;
    case 'dd.MM.yyyy':
      return day + '.' + month + '.' + year;
      break;
    case 'yyyy.MM.dd':
      return year + '.' + month + '.' + day;
      break;
    case 'yyyy/MM/dd':
      return year + '/' + month + '/' + day;
      break;
  }
  return '';
}
angular.module("ui.bootstrap", ["ui.bootstrap.tpls", "ui.bootstrap.alert", "ui.bootstrap.bindHtml", "ui.bootstrap.position", "ui.bootstrap.datepicker", "ui.bootstrap.typeahead"]), angular.module("ui.bootstrap.tpls", ["template/alert/alert.html", "template/datepicker/datepicker.html", "template/datepicker/day.html", "template/datepicker/popup.html", "template/typeahead/typeahead-match.html", "template/typeahead/typeahead-popup.html"]), angular.module("ui.bootstrap.alert", []).controller("AlertController", ["$scope", "$attrs",
    function(e, t) {
        e.closeable = "close" in t
    }
]).directive("alert", function() {
    return {
        restrict: "EA",
        controller: "AlertController",
        templateUrl: "template/alert/alert.html",
        transclude: !0,
        replace: !0,
        scope: {
            type: "@",
            close: "&"
        }
    }
}), angular.module("ui.bootstrap.bindHtml", []).directive("bindHtmlUnsafe", function() {
    return function(e, t, a) {
        t.addClass("ng-binding").data("$binding", a.bindHtmlUnsafe), e.$watch(a.bindHtmlUnsafe, function(e) {
            t.html(e || "")
        })
    }
}), angular.module("ui.bootstrap.dateparser", []).service("dateParser", ["$locale", "orderByFilter",
    function(e, t) {
        function a(e, t, a) {
            return 1 === t && a > 28 ? 29 === a && (e % 4 === 0 && e % 100 !== 0 || e % 400 === 0) : 3 === t || 5 === t || 8 === t || 10 === t ? 31 > a : !0
        }
        this.parsers = {};
        var n = {
            yyyy: {
                regex: "\\d{4}",
                apply: function(e) {
                    this.year = +e
                }
            },
            yy: {
                regex: "\\d{2}",
                apply: function(e) {
                    this.year = +e + 2e3
                }
            },
            y: {
                regex: "\\d{1,4}",
                apply: function(e) {
                    this.year = +e
                }
            },
            MMMM: {
                regex: e.DATETIME_FORMATS.MONTH.join("|"),
                apply: function(t) {
                    this.month = e.DATETIME_FORMATS.MONTH.indexOf(t)
                }
            },
            MMM: {
                regex: e.DATETIME_FORMATS.SHORTMONTH.join("|"),
                apply: function(t) {
                    this.month = e.DATETIME_FORMATS.SHORTMONTH.indexOf(t)
                }
            },
            MM: {
                regex: "0[1-9]|1[0-2]",
                apply: function(e) {
                    this.month = e - 1
                }
            },
            M: {
                regex: "[1-9]|1[0-2]",
                apply: function(e) {
                    this.month = e - 1
                }
            },
            dd: {
                regex: "[0-2][0-9]{1}|3[0-1]{1}",
                apply: function(e) {
                    this.date = +e
                }
            },
            d: {
                regex: "[1-2]?[0-9]{1}|3[0-1]{1}",
                apply: function(e) {
                    this.date = +e
                }
            },
            EEEE: {
                regex: e.DATETIME_FORMATS.DAY.join("|")
            },
            EEE: {
                regex: e.DATETIME_FORMATS.SHORTDAY.join("|")
            }
        };
        this.createParser = function(e) {
            var a = [],
                i = e.split("");
            return angular.forEach(n, function(t, n) {
                var r = e.indexOf(n);
                if (r > -1) {
                    e = e.split(""), i[r] = "(" + t.regex + ")", e[r] = "$";
                    for (var o = r + 1, l = r + n.length; l > o; o++) i[o] = "", e[o] = "$";
                    e = e.join(""), a.push({
                        index: r,
                        apply: t.apply
                    })
                }
            }), {
                regex: new RegExp("^" + i.join("") + "$"),
                map: t(a, "index")
            }
        }, this.parse = function(t, n) {
            if (!angular.isString(t)) return t;
            n = e.DATETIME_FORMATS[n] || n, this.parsers[n] || (this.parsers[n] = this.createParser(n));
            var i = this.parsers[n],
                r = i.regex,
                o = i.map,
                l = t.match(r);
            if (l && l.length) {
                for (var d, c = {
                    year: 1900,
                    month: 0,
                    date: 1,
                    hours: 0
                }, s = 1, p = l.length; p > s; s++) {
                    var u = o[s - 1];
                    u.apply && u.apply.call(c, l[s])
                }
                return a(c.year, c.month, c.date) && (d = new Date(c.year, c.month, c.date, c.hours)), d
            }
        }
    }
]), angular.module("ui.bootstrap.position", []).factory("$position", ["$document", "$window",
    function(e, t) {
        function a(e, a) {
            return e.currentStyle ? e.currentStyle[a] : t.getComputedStyle ? t.getComputedStyle(e)[a] : e.style[a]
        }

        function n(e) {
            return "static" === (a(e, "position") || "static")
        }
        var i = function(t) {
            for (var a = e[0], i = t.offsetParent || a; i && i !== a && n(i);) i = i.offsetParent;
            return i || a
        };
        return {
            position: function(t) {
                var a = this.offset(t),
                    n = {
                        top: 0,
                        left: 0
                    },
                    r = i(t[0]);
                r != e[0] && (n = this.offset(angular.element(r)), n.top += r.clientTop - r.scrollTop, n.left += r.clientLeft - r.scrollLeft);
                var o = t[0].getBoundingClientRect();
                return {
                    width: o.width || t.prop("offsetWidth"),
                    height: o.height || t.prop("offsetHeight"),
                    top: a.top - n.top,
                    left: a.left - n.left
                }
            },
            offset: function(a) {
                var n = a[0].getBoundingClientRect();
                return {
                    width: n.width || a.prop("offsetWidth"),
                    height: n.height || a.prop("offsetHeight"),
                    top: n.top + (t.pageYOffset || e[0].documentElement.scrollTop),
                    left: n.left + (t.pageXOffset || e[0].documentElement.scrollLeft)
                }
            },
            positionElements: function(e, t, a, n) {
                var i, r, o, l, d = a.split("-"),
                    c = d[0],
                    s = d[1] || "center";
                i = n ? this.offset(e) : this.position(e), r = t.prop("offsetWidth"), o = t.prop("offsetHeight");
                var p = {
                        center: function() {
                            return i.left + i.width / 2 - r / 2
                        },
                        left: function() {
                            return i.left
                        },
                        right: function() {
                            return i.left + i.width
                        }
                    },
                    u = {
                        center: function() {
                            return i.top + i.height / 2 - o / 2
                        },
                        top: function() {
                            return i.top
                        },
                        bottom: function() {
                            return i.top + i.height
                        }
                    };
                switch (c) {
                    case "right":
                        l = {
                            top: u[s](),
                            left: p[c]()
                        };
                        break;
                    case "left":
                        l = {
                            top: u[s](),
                            left: i.left - r
                        };
                        break;
                    case "bottom":
                        l = {
                            top: u[c](),
                            left: p[s]()
                        };
                        break;
                    default:
                        l = {
                            top: i.top - o,
                            left: p[s]()
                        }
                }
                return l
            }
        }
    }
]), angular.module("ui.bootstrap.datepicker", ["ui.bootstrap.dateparser", "ui.bootstrap.position"]).constant("datepickerConfig", {
    formatDay: "dd",
    formatMonth: "MMMM",
    formatYear: "yyyy",
    formatDayHeader: "EEE",
    formatDayTitle: "MMMM yyyy",
    formatMonthTitle: "yyyy",
    datepickerMode: "day",
    minMode: "day",
    maxMode: "year",
    showWeeks: !0,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null
}).controller("DatepickerController", ["$scope", "$attrs", "$parse", "$interpolate", "$timeout", "$log", "dateFilter", "datepickerConfig", "$rootScope",
    function(e, t, a, n, i, r, o, l,rt) {
        var d = this,
            c = {
                $setViewValue: angular.noop
            };
        this.modes = ["day", "month", "year"], angular.forEach(["formatDay", "formatMonth", "formatYear", "formatDayHeader", "formatDayTitle", "formatMonthTitle", "minMode", "maxMode", "showWeeks", "startingDay", "yearRange"], function(a, i) {
            d[a] = angular.isDefined(t[a]) ? 8 > i ? n(t[a])(e.$parent) : e.$parent.$eval(t[a]) : l[a]
        }), angular.forEach(["minDate", "maxDate"], function(n) {
            t[n] ? e.$parent.$watch(a(t[n]), function(e) {
                d[n] = e ? new Date(e) : null, d.refreshView()
            }) : d[n] = l[n] ? new Date(l[n]) : null
        }), e.datepickerMode = e.datepickerMode || l.datepickerMode, e.uniqueId = "datepicker-" + e.$id + "-" + Math.floor(1e4 * Math.random()), this.activeDate = angular.isDefined(t.initDate) ? e.$parent.$eval(t.initDate) : new Date, e.isActive = function(t) {
            return 0 === d.compare(t.date, d.activeDate) ? (e.activeDateId = t.uid, !0) : !1
        }, this.init = function(e) {
            c = e, c.$render = function() {
                d.render()
            }
        }, this.render = function() {
            if (c.$modelValue) {
                var e = new Date(c.$modelValue),
                    t = !isNaN(e);
                t ? this.activeDate = e : r.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.'), c.$setValidity("date", t)
            }
            this.refreshView()
        }, this.refreshView = function() {
            if (this.element) {
                this._refreshView();
                var e = c.$modelValue ? new Date(c.$modelValue) : null;
                c.$setValidity("date-disabled", !e || this.element && !this.isDisabled(e))
            }
        }, this.createDateObject = function(e, t) {
            var a = c.$modelValue ? new Date(c.$modelValue) : null;
            return {
                date: e,
                label: o(e, t),
                selected: a && 0 === this.compare(e, a),
                disabled: this.isDisabled(e),
                current: 0 === this.compare(e, new Date)
            }
        }, this.isDisabled = function(a) {
            return this.minDate && this.compare(a, this.minDate) < 0 || this.maxDate && this.compare(a, this.maxDate) > 0 || t.dateDisabled && e.dateDisabled({
                date: a,
                mode: e.datepickerMode
            })
        }, this.split = function(e, t) {
            for (var a = []; e.length > 0;) a.push(e.splice(0, t));
            return a
        }, e.select = function(t) {
            if (e.datepickerMode === d.minMode) {
                var a = c.$modelValue ? new Date(c.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0);
                a.setFullYear(t.getFullYear(), t.getMonth(), t.getDate()), c.$setViewValue(a), c.$render()
                rt.$broadcast('selectDate',a);
            } else d.activeDate = t, e.datepickerMode = d.modes[d.modes.indexOf(e.datepickerMode) - 1]
        }, e.closeDateP = function(){
            rt.$broadcast('closeDateP');
        }, e.move = function(e) {
            var t = d.activeDate.getFullYear() + e * (d.step.years || 0),
                a = d.activeDate.getMonth() + e * (d.step.months || 0);
            d.activeDate.setFullYear(t, a, 1), d.refreshView()
        }, e.toggleMode = function(t) {
            t = t || 1, e.datepickerMode === d.maxMode && 1 === t || e.datepickerMode === d.minMode && -1 === t || (e.datepickerMode = d.modes[d.modes.indexOf(e.datepickerMode) + t])
        }, e.keys = {
            13: "enter",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };
        var s = function() {
            i(function() {
                d.element[0].focus()
            }, 0, !1)
        };
        e.$on("datepicker.focus", s), e.keydown = function(t) {
            var a = e.keys[t.which];
            if (a && !t.shiftKey && !t.altKey)
                if (t.preventDefault(), t.stopPropagation(), "enter" === a || "space" === a) {
                    if (d.isDisabled(d.activeDate)) return;
                    e.select(d.activeDate), s()
                } else !t.ctrlKey || "up" !== a && "down" !== a ? (d.handleKeyDown(a, t), d.refreshView()) : (e.toggleMode("up" === a ? 1 : -1), s())
        }
    }
]).directive("datepicker", function() {
    return {
        restrict: "EA",
        replace: !0,
        templateUrl: "template/datepicker/datepicker.html",
        scope: {
            datepickerMode: "=?",
            dateDisabled: "&"
        },
        require: ["datepicker", "?^ngModel"],
        controller: "DatepickerController",
        link: function(e, t, a, n) {
            var i = n[0],
                r = n[1];
            r && i.init(r)
        }
    }
}).directive("daypicker", ["dateFilter",
    function(e) {
        return {
            restrict: "EA",
            replace: !0,
            templateUrl: "template/datepicker/day.html",
            require: "^datepicker",
            link: function(t, a, n, i) {
                function r(e, t) {
                    return 1 !== t || e % 4 !== 0 || e % 100 === 0 && e % 400 !== 0 ? d[t] : 29
                }

                function o(e, t) {
                    var a = new Array(t),
                        n = new Date(e),
                        i = 0;
                    for (n.setHours(12); t > i;) a[i++] = new Date(n), n.setDate(n.getDate() + 1);
                    return a
                }

                function l(e) {
                    var t = new Date(e);
                    t.setDate(t.getDate() + 4 - (t.getDay() || 7));
                    var a = t.getTime();
                    return t.setMonth(0), t.setDate(1), Math.floor(Math.round((a - t) / 864e5) / 7) + 1
                }
                t.showWeeks = i.showWeeks, i.step = {
                    months: 1
                }, i.element = a;
                var d = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                i._refreshView = function() {
                    var a = i.activeDate.getFullYear(),
                        n = i.activeDate.getMonth(),
                        r = new Date(a, n, 1),
                        d = i.startingDay - r.getDay(),
                        c = d > 0 ? 7 - d : -d,
                        s = new Date(r);
                    c > 0 && s.setDate(-c + 1);
                    for (var p = o(s, 42), u = 0; 42 > u; u++) p[u] = angular.extend(i.createDateObject(p[u], i.formatDay), {
                        secondary: p[u].getMonth() !== n,
                        uid: t.uniqueId + "-" + u
                    });
                    t.labels = new Array(7);
                    for (var h = 0; 7 > h; h++) t.labels[h] = {
                        abbr: e(p[h].date, i.formatDayHeader),
                        full: e(p[h].date, "EEEE")
                    };
                    if (t.title = e(i.activeDate, i.formatDayTitle), t.rows = i.split(p, 7), t.showWeeks) {
                        t.weekNumbers = [];
                        for (var f = l(t.rows[0][0].date), m = t.rows.length; t.weekNumbers.push(f++) < m;);
                    }
                }, i.compare = function(e, t) {
                    return new Date(e.getFullYear(), e.getMonth(), e.getDate()) - new Date(t.getFullYear(), t.getMonth(), t.getDate())
                }, i.handleKeyDown = function(e) {
                    var t = i.activeDate.getDate();
                    if ("left" === e) t -= 1;
                    else if ("up" === e) t -= 7;
                    else if ("right" === e) t += 1;
                    else if ("down" === e) t += 7;
                    else if ("pageup" === e || "pagedown" === e) {
                        var a = i.activeDate.getMonth() + ("pageup" === e ? -1 : 1);
                        i.activeDate.setMonth(a, 1), t = Math.min(r(i.activeDate.getFullYear(), i.activeDate.getMonth()), t)
                    } else "home" === e ? t = 1 : "end" === e && (t = r(i.activeDate.getFullYear(), i.activeDate.getMonth()));
                    i.activeDate.setDate(t)
                }, i.refreshView()
            }
        }
    }
]).constant("datepickerPopupConfig", {
    datepickerPopup: "yyyy-MM-dd",
    currentText: "Today",
    clearText: "Clear",
    closeText: "Done",
    closeOnDateSelection: !0,
    appendToBody: !1,
    showButtonBar: !0
}).directive("datepickerPopup", ["$compile", "$parse", "$document", "$position", "dateFilter", "dateParser", "datepickerPopupConfig",
    function(e, t, a, n, i, r, o) {
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                isOpen: "=?",
                currentText: "@",
                clearText: "@",
                closeText: "@",
                dateDisabled: "&"
            },
            link: function(l, d, c, s) {
                function p(e) {
                    return e.replace(/([A-Z])/g, function(e) {
                        return "-" + e.toLowerCase()
                    })
                }

                function u(e) {
                    if (e) {
                        if (angular.isDate(e) && !isNaN(e)) return s.$setValidity("date", !0), e;
                        if (angular.isString(e)) {
                            var t = r.parse(e, h) || new Date(e);
                            return isNaN(t) ? void s.$setValidity("date", !1) : (s.$setValidity("date", !0), t)
                        }
                        return void s.$setValidity("date", !1)
                    }
                    return s.$setValidity("date", !0), null
                }
                var h, f = angular.isDefined(c.closeOnDateSelection) ? l.$parent.$eval(c.closeOnDateSelection) : o.closeOnDateSelection,
                    m = angular.isDefined(c.datepickerAppendToBody) ? l.$parent.$eval(c.datepickerAppendToBody) : o.appendToBody;
                l.showButtonBar = angular.isDefined(c.showButtonBar) ? l.$parent.$eval(c.showButtonBar) : o.showButtonBar, l.getText = function(e) {
                    return l[e + "Text"] || o[e + "Text"]
                }, c.$observe("datepickerPopup", function(e) {
                    h = e || o.datepickerPopup, s.$render()
                });
                var g = angular.element("<div datepicker-popup-wrap><div datepicker></div></div>");
                g.attr({
                    "ng-model": "date",
                    "ng-change": "dateSelection()"
                });
                var y = angular.element(g.children()[0]);
                c.datepickerOptions && angular.forEach(l.$parent.$eval(c.datepickerOptions), function(e, t) {
                    y.attr(p(t), e)
                }), angular.forEach(["minDate", "maxDate"], function(e) {
                    c[e] && (l.$parent.$watch(t(c[e]), function(t) {
                        l[e] = t
                    }), y.attr(p(e), e))
                }), c.dateDisabled && y.attr("date-disabled", "dateDisabled({ date: date, mode: mode })"), s.$parsers.unshift(u), l.dateSelection = function(e) {
                    angular.isDefined(e) && (l.date = e), s.$setViewValue(l.date), s.$render(), f && (l.isOpen = !1, d[0].focus())
                }, d.bind("input change keyup", function() {
                    l.$apply(function() {
                        l.date = s.$modelValue
                    })
                }), s.$render = function() {
                    var e = s.$viewValue ? i(s.$viewValue, h) : "";
                    d.val(e), l.date = u(s.$modelValue)
                };
                var b = function(e) {
                        l.isOpen && e.target !== d[0] && l.$apply(function() {
                            l.isOpen = !1
                        })
                    },
                    v = function(e) {
                        l.keydown(e)
                    };
                d.bind("keydown", v), l.keydown = function(e) {
                    27 === e.which ? (e.preventDefault(), e.stopPropagation(), l.close()) : 40 !== e.which || l.isOpen || (l.isOpen = !0)
                }, l.$watch("isOpen", function(e) {
                    e ? (l.$broadcast("datepicker.focus"), l.position = m ? n.offset(d) : n.position(d), l.position.top = l.position.top + d.prop("offsetHeight") + 20, l.position.left = 0, l.position.right = 0, a.bind("click", b)) : a.unbind("click", b)
                }), l.select = function(e) {
                    if ("today" === e) {
                        var t = new Date;
                        angular.isDate(s.$modelValue) ? (e = new Date(s.$modelValue), e.setFullYear(t.getFullYear(), t.getMonth(), t.getDate())) : e = new Date(t.setHours(0, 0, 0, 0))
                    }
                    l.dateSelection(e)
                }, l.close = function() {
                    l.isOpen = !1, d[0].focus()
                };
                var w = e(g)(l);
                m ? a.find("body").append(w) : d.after(w), l.$on("$destroy", function() {
                    w.remove(), d.unbind("keydown", v), a.unbind("click", b)
                })
            }
        }
    }
]).directive("datepickerPopupWrap", function() {
    return {
        restrict: "EA",
        replace: !0,
        transclude: !0,
        templateUrl: "template/datepicker/popup.html",
        link: function(e, t) {
            t.bind("click", function(e) {
                e.preventDefault(), e.stopPropagation()
            })
        }
    }
}), angular.module("ui.bootstrap.typeahead", ["ui.bootstrap.position", "ui.bootstrap.bindHtml"]).factory("typeaheadParser", ["$parse",
    function(e) {
        var t = /^\s*(.*?)(?:\s+as\s+(.*?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+(.*)$/;
        return {
            parse: function(a) {
                var n = a.match(t);
                if (!n) throw new Error('Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_" but got "' + a + '".');
                return {
                    itemName: n[3],
                    source: e(n[4]),
                    viewMapper: e(n[2] || n[1]),
                    modelMapper: e(n[1])
                }
            }
        }
    }
]).directive("typeahead", ["$compile", "$parse", "$q", "$timeout", "$document", "$position", "typeaheadParser",
    function(e, t, a, n, i, r, o) {
        var l = [9, 13, 27, 38, 40];
        return {
            require: "ngModel",
            link: function(d, c, s, p) {
                var u, h = (d.$eval(s.typeaheadMinLength) || 1, d.$eval(s.typeaheadWaitMs) || 0),
                    f = d.$eval(s.typeaheadEditable) !== !1,
                    m = t(s.typeaheadLoading).assign || angular.noop,
                    g = t(s.typeaheadOnSelect),
                    y = t(s.typeaheadOnChange),
                    b = s.typeaheadInputFormatter ? t(s.typeaheadInputFormatter) : void 0,
                    v = s.typeaheadAppendToBody ? d.$eval(s.typeaheadAppendToBody) : !1,
                    w = t(s.ngModel).assign,
                    k = o.parse(s.typeahead),
                    D = d.$new();
                d.$on("$destroy", function() {
                    D.$destroy()
                });
                var $ = "typeahead-" + D.$id + "-" + Math.floor(1e4 * Math.random());
                c.attr({
                    "aria-autocomplete": "list",
                    "aria-expanded": !1,
                    "aria-owns": $
                });
                var M = angular.element("<div typeahead-popup></div>");
                M.attr({
                    id: $,
                    matches: "matches",
                    active: "activeIdx",
                    select: "select(activeIdx)",
                    query: "query",
                    position: "position"
                }), angular.isDefined(s.typeaheadTemplateUrl) && M.attr("template-url", s.typeaheadTemplateUrl);
                var x = function() {
                        D.matches = [], D.activeIdx = -1, c.attr("aria-expanded", !1)
                    },
                    T = function(e) {
                        return $ + "-option-" + e
                    };
                D.$watch("activeIdx", function(e) {
                    0 > e ? c.removeAttr("aria-activedescendant") : c.attr("aria-activedescendant", T(e))
                });
                var E = function(e) {
                    var t = {
                        $viewValue: e
                    };
                    m(d, !0), a.when(k.source(d, t)).then(function(a) {
                        if (u)
                            if (a.length > 0) {
                                D.activeIdx = 0, D.matches.length = 0;
                                for (var n = 0; n < a.length; n++) t[k.itemName] = a[n], D.matches.push({
                                    id: T(n),
                                    label: k.viewMapper(D, t),
                                    model: a[n]
                                });
                                D.query = e, D.position = v ? r.offset(c) : r.position(c), D.position.top = D.position.top + c.prop("offsetHeight"), c.attr("aria-expanded", !0)
                            } else x();
                        m(d, !1)
                    }, function() {
                        x(), m(d, !1)
                    })
                };
                x(), D.query = void 0;
                var O;
                p.$parsers.unshift(function(e) {
                    return u = !0, h > 0 ? (O && n.cancel(O), O = n(function() {
                        E(e)
                    }, h)) : E(e), f ? e : e ? void p.$setValidity("editable", !1) : (p.$setValidity("editable", !0), e)
                }), p.$formatters.push(function(e) {
                    var t, a, n = {};
                    return b ? (n.$model = e, b(d, n)) : (n[k.itemName] = e, t = k.viewMapper(d, n), n[k.itemName] = void 0, a = k.viewMapper(d, n), t !== a ? t : e)
                }), D.select = function(e) {
                    var t, a, n = {};
                    n[k.itemName] = a = D.matches[e].model, t = k.modelMapper(d, n), w(d, t), p.$setValidity("editable", !0), g(d, {
                        $item: a,
                        $model: t,
                        $label: k.viewMapper(d, n)
                    }), x()
                }, c.bind("keydown", function(e) {
                    y(d), 0 !== D.matches.length && -1 !== l.indexOf(e.which) && (e.preventDefault(), 40 === e.which ? (D.activeIdx = (D.activeIdx + 1) % D.matches.length, D.$digest()) : 38 === e.which ? (D.activeIdx = (D.activeIdx ? D.activeIdx : D.matches.length) - 1, D.$digest()) : 13 === e.which || 9 === e.which ? D.$apply(function() {
                        D.select(D.activeIdx)
                    }) : 27 === e.which && (e.stopPropagation(), x(), D.$digest()))
                }), c.bind("blur", function() {
                    u = !1
                }).bind("focus", function() {
                    u = !0, O = n(function() {
                        E("")
                    }, h)
                });
                var A = function(e) {
                    c[0] !== e.target && (x(), D.$digest())
                };
                i.bind("click", A), d.$on("$destroy", function() {
                    i.unbind("click", A)
                });
                var V = e(M)(D);
                v ? i.find("body").append(V) : c.after(V)
            }
        }
    }
]).directive("typeaheadPopup", function() {
    return {
        restrict: "EA",
        scope: {
            matches: "=",
            query: "=",
            active: "=",
            position: "=",
            select: "&"
        },
        replace: !0,
        templateUrl: "template/typeahead/typeahead-popup.html",
        link: function(e, t, a) {
            e.templateUrl = a.templateUrl, e.isOpen = function() {
                return e.matches.length > 0
            }, e.isActive = function(t) {
                return e.active == t
            }, e.selectActive = function(t) {
                e.active = t
            }, e.selectMatch = function(t) {
                e.select({
                    activeIdx: t
                })
            }
        }
    }
}).directive("typeaheadMatch", ["$http", "$templateCache", "$compile", "$parse",
    function(e, t, a, n) {
        return {
            restrict: "EA",
            scope: {
                index: "=",
                match: "=",
                query: "="
            },
            link: function(i, r, o) {
                var l = n(o.templateUrl)(i.$parent) || "template/typeahead/typeahead-match.html";
                e.get(l, {
                    cache: t
                }).success(function(e) {
                    r.replaceWith(a(e.trim())(i))
                })
            }
        }
    }
]).filter("typeaheadHighlight", function() {
    function e(e) {
        return e.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
    }
    return function(t, a) {
        return a ? ("" + t).replace(new RegExp(e(a), "gi"), "<strong>$&</strong>") : t
    }
}), angular.module("template/alert/alert.html", []).run(["$templateCache",
    function(e) {
        e.put("template/alert/alert.html", '<div class="alert" ng-class="{\'alert-{{type || \'warning\'}}\': true, \'alert-dismissable\': closeable}" role="alert">\n <button ng-show="closeable" type="button" class="close" ng-click="close()">\n <span aria-hidden="true">&times;</span>\n <span class="sr-only">Close</span>\n </button>\n <div ng-transclude></div>\n</div>\n')
    }
]), angular.module("template/datepicker/datepicker.html", []).run(["$templateCache",
    function(e) {
        e.put("template/datepicker/datepicker.html",
          '<div role="application" ng-keydown="keydown($event)">\n  <daypicker tabindex="0"></daypicker>\n  </div>')
    }
]), angular.module("template/datepicker/day.html", []).run(["$templateCache",
    function(e) {
        e.put("template/datepicker/day.html", '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n  <thead>\n    <tr>\n      <th><button type="button" class="btn btn-default btn-sm pull-left" ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n      <th colspan="{{5 + showWeeks}}"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n      <th><button type="button" class="btn btn-default btn-sm pull-right" ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n    </tr>\n    <tr>\n      <th ng-show="showWeeks" class="text-center"></th>\n      <th ng-repeat="label in labels track by $index" class="text-center" style="width:12.5%"><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr ng-repeat="row in rows track by $index">\n      <td ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n      <td ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" >\n        <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-click="select(dt.date)" tabindex="-1"><span >{{dt.label}}</span></button>\n      </td>\n    </tr>\n <tr><td colspan="7"></td><td> <button type="button" style="width:100%;" class="btn btn-default btn-sm" ng-click="closeDateP()" tabindex="-1"><span >Cancel</span></button></td></tr>  </tbody>\n</table>\n')
    }
]), angular.module("template/datepicker/popup.html", []).run(["$templateCache",
    function(e) {
        e.put("template/datepicker/popup.html", "<ul class=\"dropdown-menu\" ng-style=\"{display: (isOpen && 'block') || 'none', top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\">\n  <li ng-transclude></li>\n</ul>\n")
    }
]), angular.module("template/timepicker/timepicker.html", []).run(["$templateCache",
    function(e) {
        e.put("template/timepicker/timepicker.html", '<table>\n <tbody>\n   <tr class="text-center">\n      <td><a ng-click="incrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n     <td>&nbsp;</td>\n     <td><a ng-click="incrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-up"></span></a></td>\n     <td ng-show="showMeridian"></td>\n    </tr>\n   <tr>\n      <td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidHours}">\n        <input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">\n      </td>\n     <td>:</td>\n      <td style="width:50px;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">\n        <input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">\n     </td>\n     <td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>\n   </tr>\n   <tr class="text-center">\n      <td><a ng-click="decrementHours()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n     <td>&nbsp;</td>\n     <td><a ng-click="decrementMinutes()" class="btn btn-link"><span class="glyphicon glyphicon-chevron-down"></span></a></td>\n     <td ng-show="showMeridian"></td>\n    </tr>\n </tbody>\n</table>\n')
    }
]), angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache",
    function(e) {
        e.put("template/typeahead/typeahead-match.html", '<a tabindex="-1" bind-html-unsafe="match.label | typeaheadHighlight:query"></a>')
    }
]), angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache",
    function(e) {
        e.put("template/typeahead/typeahead-popup.html", '<ul class="auto-menu" ng-if="isOpen()" ng-style="{top: position.top+\'px\', left: position.left+\'px\'}" style="display: block;" role="listbox" aria-hidden="{{!isOpen()}}">\n    <li ng-repeat="match in matches track by $index" ng-class="{active: isActive($index) }" ng-mouseenter="selectActive($index)" ng-click="selectMatch($index)" role="option" id="{{match.id}}">\n        <div typeahead-match index="$index" match="match" query="query" template-url="templateUrl"></div>\n    </li>\n</ul>')
    }
]);
/**
 * highcharts-ng
 * @version v0.0.7-dev - 2014-06-16
 * @link https://github.com/pablojim/highcharts-ng
 * @author Barry Fitzgerald <>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
"use strict";angular.module("highcharts-ng",[]).factory("highchartsNGUtils",function(){return{indexOf:function(a,b,c){void 0===c&&(c=0),0>c&&(c+=a.length),0>c&&(c=0);for(var d=a.length;d>c;c++)if(c in a&&a[c]===b)return c;return-1},prependMethod:function(a,b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);return c.apply(this,a),d?d.apply(this,a):void 0}},deepExtend:function a(b,c){if(angular.isArray(c)){b=angular.isArray(b)?b:[];for(var d=0;d<c.length;d++)b[d]=a(b[d]||{},c[d])}else if(angular.isObject(c))for(var e in c)b[e]=a(b[e]||{},c[e]);else b=c;return b}}}).directive("highchart",["highchartsNGUtils",function(a){var b=0,c=function(a){var c=!1;return angular.forEach(a,function(a){angular.isDefined(a.id)||(a.id="series-"+b++,c=!0)}),c},d=["xAxis","yAxis"],e=function(b,c,e){var f={},g={chart:{events:{}},title:{},subtitle:{},series:[],credits:{},plotOptions:{},navigator:{enabled:!1}};return f=e.options?a.deepExtend(g,e.options):g,f.chart.renderTo=c[0],angular.forEach(d,function(c){angular.isDefined(e[c])&&(f[c]=angular.copy(e[c]),(angular.isDefined(e[c].currentMin)||angular.isDefined(e[c].currentMax))&&(a.prependMethod(f.chart.events,"selection",function(a){var d=this;b.$apply(a[c]?function(){b.config[c].currentMin=a[c][0].min,b.config[c].currentMax=a[c][0].max}:function(){b.config[c].currentMin=d[c][0].dataMin,b.config[c].currentMax=d[c][0].dataMax})}),a.prependMethod(f.chart.events,"addSeries",function(){b.config[c].currentMin=this[c][0].min||b.config[c].currentMin,b.config[c].currentMax=this[c][0].max||b.config[c].currentMax})))}),e.title&&(f.title=e.title),e.subtitle&&(f.subtitle=e.subtitle),e.credits&&(f.credits=e.credits),e.size&&(e.size.width&&(f.chart.width=e.size.width),e.size.height&&(f.chart.height=e.size.height)),f},f=function(a,b){var c=a.getExtremes();(b.currentMin!==c.dataMin||b.currentMax!==c.dataMax)&&a.setExtremes(b.currentMin,b.currentMax,!1)},g=function(a,b,c){(b.currentMin||b.currentMax)&&a[c][0].setExtremes(b.currentMin,b.currentMax,!0)},h=function(a){return angular.extend({},a,{data:null,visible:null})};return{restrict:"EAC",replace:!0,template:"<div></div>",scope:{config:"=",disableDataWatch:"="},link:function(b,i){var j={},k=function(d){var e,f=[];if(d){var g=c(d);if(g&&!b.disableDataWatch)return!1;if(angular.forEach(d,function(a){f.push(a.id);var b=l.get(a.id);b?angular.equals(j[a.id],h(a))?(void 0!==a.visible&&b.visible!==a.visible&&b.setVisible(a.visible,!1),b.setData(angular.copy(a.data),!1)):b.update(angular.copy(a),!1):l.addSeries(angular.copy(a),!1),j[a.id]=h(a)}),b.config.noData){var i=!1;for(e=0;e<d.length;e++)if(d[e].data&&d[e].data.length>0){i=!0;break}i?l.hideLoading():l.showLoading(b.config.noData)}}for(e=l.series.length-1;e>=0;e--){var k=l.series[e];a.indexOf(f,k.options.id)<0&&k.remove(!1)}return!0},l=!1,m=function(){l&&l.destroy(),j={};var a=b.config||{},c=e(b,i,a),f=a.func||void 0;l=a.useHighStocks?new Highcharts.StockChart(c,f):new Highcharts.Chart(c,f);for(var h=0;h<d.length;h++)a[d[h]]&&g(l,a[d[h]],d[h]);a.loading&&l.showLoading()};m(),b.disableDataWatch?b.$watchCollection("config.series",function(a){k(a),l.redraw()}):b.$watch("config.series",function(a){var b=k(a);b&&l.redraw()},!0),b.$watch("config.title",function(a){l.setTitle(a,!0)},!0),b.$watch("config.subtitle",function(a){l.setTitle(!0,a)},!0),b.$watch("config.loading",function(a){a?l.showLoading():l.hideLoading()}),b.$watch("config.credits.enabled",function(a){a?l.credits.show():l.credits&&l.credits.hide()}),b.$watch("config.useHighStocks",function(a,b){a!==b&&m()}),angular.forEach(d,function(a){b.$watch("config."+a,function(b,c){b!==c&&b&&(l[a][0].update(b,!1),f(l[a][0],angular.copy(b)),l.redraw())},!0)}),b.$watch("config.options",function(a,b,c){a!==b&&(m(),k(c.config.series),l.redraw())},!0),b.$watch("config.size",function(a,b){a!==b&&a&&l.setSize(a.width||void 0,a.height||void 0)},!0),b.$on("highchartsng.reflow",function(){l.reflow()}),b.$on("$destroy",function(){l&&l.destroy(),i.remove()})}}}]);
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
            callbacks.start = function(e, ui) {
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
var app = angular.module('orders', ['ngRoute','angular-gestures','ngSanitize','ui.bootstrap','highcharts-ng','ui.sortable']);
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
    .when('/dashboard2',{controller: 'dashboard2',templateUrl: 'layout/dashboard2.html'})
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
}).factory('vibrate', ['cordovaReady','$rootScope' ,function (cordovaReady,$rootScope){
  return {
    vib: function (milliseconds) {
      if(navigator.notification){ navigator.notification.vibrate(milliseconds); }
    },
    conf: cordovaReady(function (message, confirmCallback, title, buttonLabels) {
        navigator.notification.confirm(message, function () {
          var that = this,
            args = arguments;
          $rootScope.$apply(function () {
            confirmCallback.apply(that, args);
          });
        }, title, buttonLabels);
      })
  };
}]).factory('project', ['$http','$location','$rootScope','$q','$timeout','checkConnection', function ($http,$location,$rootScope,$q,$timeout,checkConnection) {
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