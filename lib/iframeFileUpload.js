'use strict';

/**
 * Ajax file uploading iframe fallback for expressjs
 */

function getResponse(data) {
	return '<!DOCTYPE html><html><head><meta charset="utf-8">' +
		'</head><body>' + data + '</body></html>';
}

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
		res.send(getResponse(data));
	});

	exports.middleware = function(params) {
		params = params || {};
		params.redirectParamName = params.redirectParamName || 'redirect';
		params.removeRedirectParam = 'removeRedirectParam' in params ?
			params.removeRedirectParam : true;

		return function(req, res, next) {
			var redirectTo = req.body[params.redirectParamName];

			if (redirectTo) {
				if (params.removeRedirectParam) delete req.body[params.redirectParamName];

				res.json = function(data) {
					if (redirectTo === 'default') {
						redirectTo = defaultRedirectUrl;
					}
					redirectTo += '?' + encodeURIComponent(JSON.stringify(data));
					res.redirect(redirectTo);
				};
			}

			next();
		};
	};
};

exports.middleware = function() {
	return function(req, res, next) {
		// if iframe transport is used send json with text/html content-type
		if (!req.xhr) {
			var oldResJson = res.json;
			res.json = function(data) {
				res.set('Content-Type', 'text/html; charset=utf-8');
				res.status(200);
				oldResJson.call(res, data);
			};
		}

		next();
	};
};