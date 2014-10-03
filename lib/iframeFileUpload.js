'use strict';

var qs = require('querystring');

/**
 * Ajax file uploading iframe fallback for expressjs
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
		var params = qs.parse(decodeURIComponent(/\?(.*)$/.exec(req.url)[1]));

		res.status(Number(params.statusCode || 200));
		res.send('<!DOCTYPE html><html><body>' + params.data + '</body></html>');
	});

	exports.middleware = function(params) {
		params = params || {};
		params.redirectParamName = params.redirectParamName || 'redirect';
		params.removeRedirectParam =
			'removeRedirectParam' in params ? params.removeRedirectParam : true;

		return function(req, res, next) {
			var oldResJson = res.json,
				redirectTo = req.body[params.redirectParamName];
			if (params.removeRedirectParam) delete req.body[params.redirectParamName];
			res.json = function(data) {
				if (redirectTo) {
					if (redirectTo == 'default') {
						redirectTo = defaultRedirectUrl;
					}
					var statusCode = res.statusCode || 200;
					redirectTo += '?statusCode=' + statusCode + '&data=' +
						encodeURIComponent(JSON.stringify(data));
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
	return function(req, res, next) {
		next(new Error(
			'You should `addRedirectResponder` first before execute iframe file ' +
			'upload middleware'
		));
	}
};
