/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, '__esModule', {
	  value: true
	});

	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var Cron = (function () {
	  _createClass(Cron, null, [{
	    key: 'DEFAULT_DATA',
	    get: function get() {
	      return {
	        days: [],
	        startTime: '00:00:00'
	      };
	    }
	  }, {
	    key: 'DAYS_MAP',
	    get: function get() {
	      return {
	        0: 'SUN',
	        1: 'MON',
	        2: 'TUE',
	        3: 'WED',
	        4: 'THU',
	        5: 'FRI',
	        6: 'SAT'
	      };
	    }
	  }, {
	    key: 'REVERSE_DAYS_MAP',
	    get: function get() {
	      var originalMap = Cron.DAYS_MAP,
	          reverseMap = {};

	      for (var key in Object.keys(originalMap)) {
	        reverseMap[originalMap[key]] = key;
	      }

	      return reverseMap;
	    }
	  }, {
	    key: 'DEFAULT_OPTIONS',
	    get: function get() {
	      return {
	        optimize: false
	      };
	    }

	    /*
	    data <Object>
	      days: <Array>
	        0-6 <Number> or 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' <string>
	      startTime: 'HH:mm:ss' <string>
	    */

	  }]);

	  function Cron(data, options) {
	    _classCallCheck(this, Cron);

	    return {
	      data: data,
	      expression: Cron.make(data, options)
	    };
	  }

	  _createClass(Cron, null, [{
	    key: 'make',
	    value: function make() {
	      var data = arguments.length <= 0 || arguments[0] === undefined ? { days: [], startTime: null } : arguments[0];
	      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	      options = _extends({}, Cron.DEFAULT_OPTIONS, options);

	      data = _extends({}, Cron.DEFAULT_DATA, data);

	      var defaultExp = '* * * * * * *',
	          expression = defaultExp.split(' '),
	          startTime = data.startTime ? data.startTime.split(':').slice(0, 3) : [],
	          days = data.days.map(function (day) {
	        if (!isNaN(parseInt(day)) && typeof parseInt(day) === 'number') {
	          return day;
	        } else {
	          return Cron.REVERSE_DAYS_MAP[day.substr(0, 3)].toUpperCase();
	        }
	      }).sort(function (a, b) {
	        return a - b;
	      });

	      // Sets hours, minutes and seconds
	      if (startTime.length) {
	        if (startTime.length === 2) {
	          startTime.push('00');
	        }

	        startTime.forEach(function (value, index) {
	          if (value) {
	            if (value === '00') {
	              return '*';
	            }
	            return expression[index] = value;
	          }
	        });
	      }

	      // Sets day of the month
	      // expression[3] = ...

	      // Sets month
	      // expression[4] = ...

	      // Sets days of the week
	      if (days.length) {
	        expression[5] = days.join(',');
	        if (options.optimize) {
	          expression = Cron.optimize(expression);
	        }
	      }

	      // Sets year
	      // expression[6] = ...

	      if (!Cron.isExpressionValid(expression)) {
	        var message = new Error('Failed to make Cron expression...', expression);
	        throw new Error(message);
	        return message;
	      }

	      return typeof expression === 'string' ? expression : expression.join(' ');
	    }
	  }, {
	    key: 'parse',
	    value: function parse(expression) {
	      // TODO: Handle string days of week along with integers (e.g.: 'MON', 'TUE')

	      var _expression$match = expression.match(/\S/gi);

	      var _expression$match2 = _slicedToArray(_expression$match, 7);

	      var sec = _expression$match2[0];
	      var min = _expression$match2[1];
	      var hour = _expression$match2[2];
	      var dm = _expression$match2[3];
	      var m = _expression$match2[4];
	      var dw = _expression$match2[5];
	      var year = _expression$match2[6];

	      for (var timeUnit in [sec, min, hour]) {
	        if (timeUnit === '*') {
	          timeUnit = '00';
	        }
	      }

	      if (dw !== '*') {
	        if (dw.indexOf(',') >= 0) {
	          dw = dw.split(',');
	        }

	        for (var i = 0; i < dw.length; i++) {
	          if (dw[i].indexOf('-') >= 0) {
	            var range = dw[i].split('-').map(function (d) {
	              return parseInt(d);
	            }),
	                diff = range[range.length - 1] - range[0],
	                days = [range[0]];

	            for (var _i = 1; _i <= diff; _i++) {
	              days.push(range[0] + _i);
	            }

	            dw = days;
	          }
	        }
	      }

	      return {
	        days: dw,
	        startTime: hour + ':' + min + ':' + sec
	      };
	    }
	  }, {
	    key: 'optimize',
	    value: function optimize(expression) {
	      var exp = Array.isArray(expression) ? expression : expression.split(' '),
	          canBeShorten = null,
	          isNumeric = true;

	      if (exp[5] !== '*' && exp[5].indexOf(',') > 0) {
	        var i = 0,
	            days = exp[5].split(',').map(function (day) {
	          if (!isNaN(parseInt(day))) {
	            return parseInt(day);
	          } else {
	            isNumeric = false;
	            return Cron.REVERSE_DAYS_MAP[day];
	          }
	        });

	        while (i < days.length - 1) {
	          var next = days[i + 1],
	              current = days[i];

	          if (current > 0 && next - current === 1 || current === 0 && current + next === 1) {
	            canBeShorten = true;
	          } else {
	            canBeShorten = false;
	            break;
	          }
	          i++;
	        }

	        if (!isNumeric) {
	          for (var _i2 = 0; _i2 < days.length; _i2++) {
	            days[_i2] = Cron.DAYS_MAP[days[_i2]];
	          }
	        }

	        if (canBeShorten) {
	          exp[5] = days[0] + '-' + days[days.length - 1];
	          return exp.join(' ');
	        }
	      }

	      return expression;
	    }
	  }, {
	    key: 'isExpressionValid',
	    value: function isExpressionValid(expression) {
	      // TODO: validate Cron expression
	      return true;
	    }
	  }]);

	  return Cron;
	})();

	window.Cron = Cron;
	exports['default'] = Cron;
	module.exports = exports['default'];

/***/ }
/******/ ]);