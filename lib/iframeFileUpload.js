'use strict';

/**
 * Iframe file uploading helper for expressjs
 */

var defaultRedirectUrl = null;
exports.addRedirectResponder = function(app, url) {
	url = url || '/__ajaxiframeuploadsresponder__';
	if (~url.indexOf('?')) throw new Error(
		'redirect `url` should be without query string'
	);
	defaultRedirectUrl = url;
	app.get(url, function(req, res) {
		//get the data from query string
		var data = decodeURIComponent(/\?(.*)$/.exec(req.url)[1]);
		res.end('<!DOCTYPE html><html><body>' + data + '</body></html>');
	});

	exports.middleware = function(params) {
		params = params || {};
		params.redirectParamName = params.redirectParamName || 'redirect';

		return function(req, res, next) {
			var oldResJson = res.json;
			res.json = function(data) {
				var redirectTo = req.body[params.redirectParamName];
				if (redirectTo) {
					if (redirectTo == 'default') {
						redirectTo = defaultRedirectUrl;
					}
					redirectTo += '?' + encodeURIComponent(JSON.stringify(data));
					res.redirect(redirectTo);
				} else {
					oldResJson.apply(this, arguments);
				}
			};
			next();
		};
	};
};

exports.middleware = function() {
	throw new Error(
		'You should `addRedirectResponder` first before execute iframe file ' +
		'upload middleware'
	);
};