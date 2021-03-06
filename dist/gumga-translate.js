(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

TranslateFilter.$inject = ['GumgaTranslateHelper', '$timeout'];

function TranslateFilter(GumgaTranslateHelper, $timeout) {
  return function translate(value, entity) {
    if (value) {
      if (!angular.isString(value)) throw 'É necessário passar uma string para o filtro gumgaTranslate';
      var stringToTranslate = entity ? entity.toLowerCase().concat('.').concat(value ? value.toLowerCase() : ' ') : value ? value.toLowerCase() : ' ';

      return GumgaTranslateHelper.returnTranslation(stringToTranslate) || value;
    }
    return value;
  };
}

angular.module('gumga.translate.filter', ['gumga.translate.helper']).filter('gumgaTranslate', TranslateFilter);

},{}],2:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	'use strict';

	TranslateHelper.$inject = [];

	function TranslateHelper() {
		return {
			translators: {},
			_translation: {},
			setTranslators: function setTranslators(language, obj) {
				var self = this;
				function iterate(obj, string) {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							_typeof(obj[key]) == 'object' ? iterate(obj[key], string + '.' + key) : self.translators[(string + '.' + key).substring(1).toLowerCase()] = obj[key];
						}
					}
				}
				iterate(obj, '');
				sessionStorage.setItem('language', angular.toJson(this.translators));
			},
			returnTranslation: function returnTranslation(string) {
				return this.translators[string.toLowerCase().replace(/\s/g, '')];
			},
			__getFromLocalStorage: function __getFromLocalStorage() {
				var language = localStorage.getItem('GUMGACurrent'),
				    self = this;
				function iterate(obj, string) {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							_typeof(obj[key]) == 'object' ? iterate(obj[key], string + '.' + key) : self._translation[(string + '.' + key).substring(1)] = obj[key];
						}
					}
				}
				if (language && localStorage.getItem('GUMGA' + language)) {
					iterate(JSON.parse(localStorage.getItem('GUMGA' + language)), '');
					return true;
				}
			},
			getTranslate: function getTranslate(toTranslate) {
				var self = this;
				if (Object.getOwnPropertyNames(self._translation).length === 0) self.__getFromLocalStorage();
				if (!toTranslate || typeof toTranslate != 'string') throw 'The value passed to GumgaTranslate is Wrong!';
				if (self._translation[toTranslate]) return self._translation[toTranslate];
				return toTranslate;
			}
		};
	}
	angular.module('gumga.translate.helper', []).factory('GumgaTranslateHelper', TranslateHelper);
})();

},{}],3:[function(require,module,exports){
'use strict';

require('./helper/helper.js');
require('./filter/filter.js');
require('./provider/provider.js');

angular.module('gumga.translate', ['gumga.translate.helper', 'gumga.translate.filter', 'gumga.translate.provider']);

},{"./filter/filter.js":1,"./helper/helper.js":2,"./provider/provider.js":4}],4:[function(require,module,exports){
'use strict';

(function () {
  'use strict';

  Translate.$inject = [];
  function Translate() {
    return {
      $get: function $get($http) {
        var self = this;
        $http.get('/i18n/' + self._language + '.json').success(function SuccessGet(values) {
          localStorage.setItem('GUMGA' + self._language, JSON.stringify(values));
          localStorage.setItem('GUMGACurrent', self._language);
        });
        return self;
      },
      setLanguage: function setLanguage(language) {
        if (!language) throw 'You must pass a language to GumgaTranslate';
        this._language.toLowerCase() !== language.toLowerCase() ? this._language = language : function () {};
      },
      _language: 'pt-br'
    };
  }
  angular.module('gumga.translate.provider', []).provider('$gumgaTranslate', Translate);
})();

},{}]},{},[3]);
