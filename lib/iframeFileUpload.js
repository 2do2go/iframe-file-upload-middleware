'use strict';

var urlParse = require('url').parse;

/**
 * Iframe file uploading helper for expressjs
 */

exports.addRedirectResponder = function(app, url) {
	url = url || '/ajax/uploads/response';
	app.get(url, function(req, res) {
		res.end(
			'<!DOCTYPE html><html><head></head><body>' +
			decodeURIComponent(urlParse(req.url).query) +
			'</body></html>'
		);
	});

	exports.middleware = function(params) {
		params = params || {};
		params.redirectParamName = params.redirectParamName || 'redirect';
		params.queryDataPlaceholder = params.queryDataPlaceholder || '%s';

		return function(req, res, next) {
			var oldResJson = res.json;
			res.json = function(data) {
				var redirectTo = req.body[params.redirectParamName];
				if (redirectTo) {
					res.redirect(redirectTo.replace(
						params.queryDataPlaceholder,
						encodeURIComponent(JSON.stringify(data))
					));
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