/**
 * Created by jerry on 2018/10/26.
 */

'use strict';

function dateGetter(name, size, offset, trim, negWrap) {
	offset = offset || 0;
	return function(date) {
		var value = date['get' + name]();
		if (offset > 0 || value > -offset) {
			value += offset;
		}
		if (value === 0 && offset === -12) value = 12;
		return padNumber(value, size, trim, negWrap);
	};
}

function dateStrGetter(name, shortForm, standAlone) {
	return function(date, formats) {
		var value = date['get' + name]();
		var propPrefix = (standAlone ? 'STANDALONE' : '') + (shortForm ? 'SHORT' : '');
		var get = uppercase(propPrefix + name);
		
		return formats[get][value];
	};
}

function timeZoneGetter(date, formats, offset) {
	var zone = -1 * offset;
	var paddedZone = (zone >= 0) ? '+' : '';
	
	paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) +
		padNumber(Math.abs(zone % 60), 2);
	
	return paddedZone;
}

function getFirstThursdayOfYear(year) {
	// 0 = index of January
	var dayOfWeekOnFirst = (new Date(year, 0, 1)).getDay();
	// 4 = index of Thursday (+1 to account for 1st = 5)
	// 11 = index of *next* Thursday (+1 account for 1st = 12)
	return new Date(year, 0, ((dayOfWeekOnFirst <= 4) ? 5 : 12) - dayOfWeekOnFirst);
}

function getThursdayThisWeek(datetime) {
	return new Date(datetime.getFullYear(), datetime.getMonth(),
		// 4 = index of Thursday
		datetime.getDate() + (4 - datetime.getDay()));
}

function weekGetter(size) {
	return function(date) {
		var firstThurs = getFirstThursdayOfYear(date.getFullYear()),
			thisThurs = getThursdayThisWeek(date);
		
		var diff = +thisThurs - +firstThurs,
			result = 1 + Math.round(diff / 6.048e8); // 6.048e8 ms per week
		
		return padNumber(result, size);
	};
}

function ampmGetter(date, formats) {
	return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}

function eraGetter(date, formats) {
	return date.getFullYear() <= 0 ? formats.ERAS[0] : formats.ERAS[1];
}

function longEraGetter(date, formats) {
	return date.getFullYear() <= 0 ? formats.ERANAMES[0] : formats.ERANAMES[1];
}

var ALL_COLONS = /:/g;
function timezoneToOffset(timezone, fallback) {
	// IE/Edge do not "understand" colon (`:`) in timezone
	timezone = timezone.replace(ALL_COLONS, '');
	var requestedTimezoneOffset = Date.parse('Jan 01, 1970 00:00:00 ' + timezone) / 60000;
	return isNaN(requestedTimezoneOffset) ? fallback : requestedTimezoneOffset;
}
function addDateMinutes(date, minutes) {
	date = new Date(date.getTime());
	date.setMinutes(date.getMinutes() + minutes);
	return date;
}


function convertTimezoneToLocal(date, timezone, reverse) {
	reverse = reverse ? -1 : 1;
	var dateTimezoneOffset = date.getTimezoneOffset();
	var timezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
	return addDateMinutes(date, reverse * (timezoneOffset - dateTimezoneOffset));
}
function toInt(str) {
	return parseInt(str, 10);
}
var slice             = [].slice,
toString          = Object.prototype.toString,
getPrototypeOf    = Object.getPrototypeOf,
hasOwnProperty = Object.prototype.hasOwnProperty;
function concat(array1, array2, index) {
	return array1.concat(slice.call(array2, index));
}

var DATE_FORMATS = {
	yyyy: dateGetter('FullYear', 4, 0, false, true),
	yy: dateGetter('FullYear', 2, 0, true, true),
	y: dateGetter('FullYear', 1, 0, false, true),
	MMMM: dateStrGetter('Month'),
	MMM: dateStrGetter('Month', true),
	MM: dateGetter('Month', 2, 1),
	M: dateGetter('Month', 1, 1),
	LLLL: dateStrGetter('Month', false, true),
	dd: dateGetter('Date', 2),
	d: dateGetter('Date', 1),
	HH: dateGetter('Hours', 2),
	H: dateGetter('Hours', 1),
	hh: dateGetter('Hours', 2, -12),
	h: dateGetter('Hours', 1, -12),
	mm: dateGetter('Minutes', 2),
	m: dateGetter('Minutes', 1),
	ss: dateGetter('Seconds', 2),
	s: dateGetter('Seconds', 1),
	// while ISO 8601 requires fractions to be prefixed with `.` or `,`
	// we can be just safely rely on using `sss` since we currently don't support single or two digit fractions
	sss: dateGetter('Milliseconds', 3),
	EEEE: dateStrGetter('Day'),
	EEE: dateStrGetter('Day', true),
	a: ampmGetter,
	Z: timeZoneGetter,
	ww: weekGetter(2),
	w: weekGetter(1),
	G: eraGetter,
	GG: eraGetter,
	GGG: eraGetter,
	GGGG: longEraGetter
};

function isString(value) {return typeof value === 'string';}
function isNumber(value) {return typeof value === 'number';}
function isDate(value) {
	return toString.call(value) === '[object Date]';
}
var DATE_FORMATS_SPLIT = /((?:[^yMLdHhmsaZEwG']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|L+|d+|H+|h+|m+|s+|a|Z|G+|w+))([\s\S]*)/,
	NUMBER_STRING = /^-?\d+$/;
var isArray = Array.isArray;
function isWindow(obj) {
	return obj && obj.window === obj;
}
function isArrayLike(obj) {
	
	// `null`, `undefined` and `window` are not array-like
	if (obj == null || isWindow(obj)) return false;
	
	// arrays, strings and jQuery/jqLite objects are array like
	// * jqLite is either the jQuery or jqLite constructor function
	// * we have to check the existence of jqLite first as this method is called
	//   via the forEach method when constructing the jqLite object in the first place
	if (isArray(obj) || isString(obj)) return true;
	
	// Support: iOS 8.2 (not reproducible in simulator)
	// "length" in obj used to prevent JIT error (gh-11508)
	var length = "length" in Object(obj) && obj.length;
	
	// NodeList objects (with `item` method) and
	// other objects with suitable length characteristics are array-like
	return isNumber(length) &&
		(length >= 0 && ((length - 1) in obj || obj instanceof Array) || typeof obj.item == 'function');
	
}
function isFunction(value) {return typeof value === 'function';}
function isBlankObject(value) {
	return value !== null && typeof value === 'object' && !getPrototypeOf(value);
}
function forEach(obj, iterator, context) {
	var key, length;
	if (obj) {
		if (isFunction(obj)) {alert(1);
			for (key in obj) {
				// Need to check if hasOwnProperty exists,
				// as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
				if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else if (isArray(obj) || isArrayLike(obj)) {
			var isPrimitive = typeof obj !== 'object';
			for (key = 0, length = obj.length; key < length; key++) {
				if (isPrimitive || key in obj) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else if (obj.forEach && obj.forEach !== forEach) {alert(3);
			obj.forEach(iterator, context, obj);
		} else if (isBlankObject(obj)) {alert(4);
			// createMap() fast path --- Safe to avoid hasOwnProperty check because prototype chain is empty
			for (key in obj) {
				iterator.call(context, obj[key], key, obj);
			}
		} else if (typeof obj.hasOwnProperty === 'function') {alert(5);
			// Slow path for objects inheriting Object.prototype, hasOwnProperty check needed
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		} else {alert(6);
			// Slow path for objects which do not have a method `hasOwnProperty`
			for (key in obj) {
				if (hasOwnProperty.call(obj, key)) {
					iterator.call(context, obj[key], key, obj);
				}
			}
		}
	}
	return obj;
}

/**
 * @ngdoc filter
 * @name date
 * @kind function
 *
 * @description
 *   Formats `date` to a string based on the requested `format`.
 *
 *   `format` string can be composed of the following elements:
 *
 *   * `'yyyy'`: 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
 *   * `'yy'`: 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
 *   * `'y'`: 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
 *   * `'MMMM'`: Month in year (January-December)
 *   * `'MMM'`: Month in year (Jan-Dec)
 *   * `'MM'`: Month in year, padded (01-12)
 *   * `'M'`: Month in year (1-12)
 *   * `'LLLL'`: Stand-alone month in year (January-December)
 *   * `'dd'`: Day in month, padded (01-31)
 *   * `'d'`: Day in month (1-31)
 *   * `'EEEE'`: Day in Week,(Sunday-Saturday)
 *   * `'EEE'`: Day in Week, (Sun-Sat)
 *   * `'HH'`: Hour in day, padded (00-23)
 *   * `'H'`: Hour in day (0-23)
 *   * `'hh'`: Hour in AM/PM, padded (01-12)
 *   * `'h'`: Hour in AM/PM, (1-12)
 *   * `'mm'`: Minute in hour, padded (00-59)
 *   * `'m'`: Minute in hour (0-59)
 *   * `'ss'`: Second in minute, padded (00-59)
 *   * `'s'`: Second in minute (0-59)
 *   * `'sss'`: Millisecond in second, padded (000-999)
 *   * `'a'`: AM/PM marker
 *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200-+1200)
 *   * `'ww'`: Week of year, padded (00-53). Week 01 is the week with the first Thursday of the year
 *   * `'w'`: Week of year (0-53). Week 1 is the week with the first Thursday of the year
 *   * `'G'`, `'GG'`, `'GGG'`: The abbreviated form of the era string (e.g. 'AD')
 *   * `'GGGG'`: The long form of the era string (e.g. 'Anno Domini')
 *
 *   `format` string can also be one of the following predefined
 *   {@link guide/i18n localizable formats}:
 *
 *   * `'medium'`: equivalent to `'MMM d, y h:mm:ss a'` for en_US locale
 *     (e.g. Sep 3, 2010 12:05:08 PM)
 *   * `'short'`: equivalent to `'M/d/yy h:mm a'` for en_US  locale (e.g. 9/3/10 12:05 PM)
 *   * `'fullDate'`: equivalent to `'EEEE, MMMM d, y'` for en_US  locale
 *     (e.g. Friday, September 3, 2010)
 *   * `'longDate'`: equivalent to `'MMMM d, y'` for en_US  locale (e.g. September 3, 2010)
 *   * `'mediumDate'`: equivalent to `'MMM d, y'` for en_US  locale (e.g. Sep 3, 2010)
 *   * `'shortDate'`: equivalent to `'M/d/yy'` for en_US locale (e.g. 9/3/10)
 *   * `'mediumTime'`: equivalent to `'h:mm:ss a'` for en_US locale (e.g. 12:05:08 PM)
 *   * `'shortTime'`: equivalent to `'h:mm a'` for en_US locale (e.g. 12:05 PM)
 *
 *   `format` string can contain literal values. These need to be escaped by surrounding with single quotes (e.g.
 *   `"h 'in the morning'"`). In order to output a single quote, escape it - i.e., two single quotes in a sequence
 *   (e.g. `"h 'o''clock'"`).
 *
 *   Any other characters in the `format` string will be output as-is.
 *
 * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
 *    number) or various ISO 8601 datetime string formats (e.g. yyyy-MM-ddTHH:mm:ss.sssZ and its
 *    shorter versions like yyyy-MM-ddTHH:mmZ, yyyy-MM-dd or yyyyMMddTHHmmssZ). If no timezone is
 *    specified in the string input, the time is considered to be in the local timezone.
 * @param {string=} format Formatting rules (see Description). If not specified,
 *    `mediumDate` is used.
 * @param {string=} timezone Timezone to be used for formatting. It understands UTC/GMT and the
 *    continental US time zone abbreviations, but for general use, use a time zone offset, for
 *    example, `'+0430'` (4 hours, 30 minutes east of the Greenwich meridian)
 *    If not specified, the timezone of the browser will be used.
 * @returns {string} Formatted string or the input if input is not recognized as date/millis.
 *
 * @example
 <example name="filter-date">
 <file name="index.html">
 <span ng-non-bindable>{{1288323623006 | date:'medium'}}</span>:
 <span>{{1288323623006 | date:'medium'}}</span><br>
 <span ng-non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
 <span>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span><br>
 <span ng-non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
 <span>{{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}</span><br>
 <span ng-non-bindable>{{1288323623006 | date:"MM/dd/yyyy 'at' h:mma"}}</span>:
 <span>{{'1288323623006' | date:"MM/dd/yyyy 'at' h:mma"}}</span><br>
 </file>
 <file name="protractor.js" type="protractor">
 it('should format date', function() {
         expect(element(by.binding("1288323623006 | date:'medium'")).getText()).
            toMatch(/Oct 2\d, 2010 \d{1,2}:\d{2}:\d{2} (AM|PM)/);
         expect(element(by.binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).getText()).
            toMatch(/2010-10-2\d \d{2}:\d{2}:\d{2} (-|\+)?\d{4}/);
         expect(element(by.binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).getText()).
            toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(AM|PM)/);
         expect(element(by.binding("'1288323623006' | date:\"MM/dd/yyyy 'at' h:mma\"")).getText()).
            toMatch(/10\/2\d\/2010 at \d{1,2}:\d{2}(AM|PM)/);
       });
 </file>
 </example>
 */
var $locale = {
	"DATETIME_FORMATS": {
		"AMPMS": [
			"AM",
			"PM"
		],
		"DAY": [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday"
		],
		"ERANAMES": [
			"Before Christ",
			"Anno Domini"
		],
		"ERAS": [
			"BC",
			"AD"
		],
		"FIRSTDAYOFWEEK": 6,
		"MONTH": [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		],
		"SHORTDAY": [
			"Sun",
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri",
			"Sat"
		],
		"SHORTMONTH": [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec"
		],
		"STANDALONEMONTH": [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		],
		"WEEKENDRANGE": [
			5,
			6
		],
		"fullDate": "EEEE, MMMM d, y",
		"longDate": "MMMM d, y",
		"medium": "MMM d, y h:mm:ss a",
		"mediumDate": "MMM d, y",
		"mediumTime": "h:mm:ss a",
		"short": "M/d/yy h:mm a",
		"shortDate": "M/d/yy",
		"shortTime": "h:mm a"
	},
	"NUMBER_FORMATS": {
		"CURRENCY_SYM": "$",
		"DECIMAL_SEP": ".",
		"GROUP_SEP": ",",
		"PATTERNS": [
			{
				"gSize": 3,
				"lgSize": 3,
				"maxFrac": 3,
				"minFrac": 0,
				"minInt": 1,
				"negPre": "-",
				"negSuf": "",
				"posPre": "",
				"posSuf": ""
			},
			{
				"gSize": 3,
				"lgSize": 3,
				"maxFrac": 2,
				"minFrac": 2,
				"minInt": 1,
				"negPre": "-\u00a4",
				"negSuf": "",
				"posPre": "\u00a4",
				"posSuf": ""
			}
		]
	},
	"id": "en-us",
	"localeID": "en_US",
	"pluralCat": function(n, opt_precision) {  var i = n | 0;  var vf = getVF(n, opt_precision);  if (i == 1 && vf.v == 0) {    return PLURAL_CATEGORY.ONE;  }  return PLURAL_CATEGORY.OTHER;}
};
function dateFilter() {
	
	
	var R_ISO8601_STR = /^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;
	// 1        2       3         4          5          6          7          8  9     10      11
	function jsonStringToDate(string) {
		var match;
		if ((match = string.match(R_ISO8601_STR))) {
			var date = new Date(0),
				tzHour = 0,
				tzMin  = 0,
				dateSetter = match[8] ? date.setUTCFullYear : date.setFullYear,
				timeSetter = match[8] ? date.setUTCHours : date.setHours;
			
			if (match[9]) {
				tzHour = toInt(match[9] + match[10]);
				tzMin = toInt(match[9] + match[11]);
			}
			dateSetter.call(date, toInt(match[1]), toInt(match[2]) - 1, toInt(match[3]));
			var h = toInt(match[4] || 0) - tzHour;
			var m = toInt(match[5] || 0) - tzMin;
			var s = toInt(match[6] || 0);
			var ms = Math.round(parseFloat('0.' + (match[7] || 0)) * 1000);
			timeSetter.call(date, h, m, s, ms);
			return date;
		}
		return string;
	}
	
	
	return function(date, format, timezone) {
		var text = '',
			parts = [],
			fn, match;
		
		format = format || 'mediumDate';
		format = $locale.DATETIME_FORMATS[format] || format;
		
		if (isString(date)) {
			date = NUMBER_STRING.test(date) ? toInt(date) : jsonStringToDate(date);
		}
		
		if (isNumber(date)) {
			date = new Date(date);
		}
		if (!isDate(date) || !isFinite(date.getTime())) {
			return date;
		}
		
		while (format) {
			match = DATE_FORMATS_SPLIT.exec(format);
			if (match) {
				parts = concat(parts, match, 1);
				format = parts.pop();
			} else {
				parts.push(format);
				format = null;
			}
		}
		
		var dateTimezoneOffset = date.getTimezoneOffset();
		if (timezone) {
			dateTimezoneOffset = timezoneToOffset(timezone, dateTimezoneOffset);
			date = convertTimezoneToLocal(date, timezone, true);
		}
		console.log(dateTimezoneOffset);console.log('88888888888888');
		forEach(parts, function(value) {
			fn = DATE_FORMATS[value];
			text += fn ? fn(date, $locale.DATETIME_FORMATS, dateTimezoneOffset)
				: value === '\'\'' ? '\'' : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
		});
		alert(text);
		return text;
	};
}

window.dateFilter = dateFilter();