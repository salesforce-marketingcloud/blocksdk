/* 
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license. 
 * For full license text, see LICENSE.txt file in the repo root  or https://opensource.org/licenses/BSD-3-Clause
 */

var SDK = function (whitelistOverride, sslOverride) {

	// the custom block should verify it is being called from
	// the marketing cloud
	this._validateOrigin = function (origin) {
		var whiteterm;
		var whitelist = whitelistOverride || ['marketingcloudapps.com'];
		if (sslOverride || origin.indexOf('https://') === 0) {
			if (origin === 'https://blocktester.herokuapp.com') {
				return true;
			}
			for (var key in whitelist) {
				whiteterm = whitelist[key];
				checkWhite = origin.replace(sslOverride && 'http://' || 'https://', '').split('/')[0].split(':')[0];
				if (checkWhite.indexOf(whiteterm) === checkWhite.length - whiteterm.length) {
					return true;
				}
			}
		}
		return false;
	};

	this._messageId = 1;
	this._messages = {
		0: function () {}
	};

	this._receiveMessage = function (message) {
		message = message || {};
		var data = message.data || {};
		if (data.method === 'handShake') {
			if (this._validateOrigin(data.origin)) {
				this._parentOrigin = data.origin;
				return;
			}
		}
		// if the message is not from the validated origin it gets ignored
		if (!this._parentOrigin || this._parentOrigin !== message.origin) {
			return;
		}
		// when the message has been received, we execute its callback
		(this._messages[data.id || 0] || function () {})(data.payload);
		delete this._messages[data.id];
	};

	window.addEventListener('message', this._receiveMessage.bind(this), false);

	this._postToEditor = function (payload, callback, ttl) {
		var self = this;
		// we only message up if we have
		// validated the origin
		if (!this._parentOrigin) {
			if (ttl === undefined || ttl > 0) {
				window.setTimeout(function () {
					self._postToEditor(payload, callback, (ttl || 5) - 1);
				}, 20);
			}
			return;
		}
		this._messages[this._messageId] = callback;
		payload.id = this._messageId;
		this._messageId += 1;
		// the actual postMessage always uses
		// the validated origin
		window.parent.postMessage(payload, this._parentOrigin);
	};

	this.getContent = function (cb) {
		this._postToEditor({
			method: 'getContent'
		}, cb);
	};

	this.setContent = function (content, cb) {
		this._postToEditor({
			method: 'setContent',
			payload: content
		}, cb);
	};

	this.setSuperContent = function (content, cb) {
		this._postToEditor({
			method: 'setSuperContent',
			payload: content
		}, cb);
	};

	this.getData = function (cb) {
		this._postToEditor({
			method: 'getData'
		}, cb);
	};

	this.setData = function (dataObj, cb) {
		this._postToEditor({
			method: 'setData',
			payload: dataObj
		}, cb);
	};

	this.getCentralData = function (cb) {
		this._postToEditor({
			method: 'getCentralData'
		}, cb);
	};

	this.setCentralData = function (dataObj, cb) {
		this._postToEditor({
			method: 'setCentralData',
			payload: dataObj
		}, cb);
	};

	window.parent.postMessage({
		method: 'handShake',
		origin: window.location.origin
	}, '*');
};

if (typeof(window) === 'object') {
	window.sfdc = window.sfdc || {};
	window.sfdc.BlockSDK = SDK;
}
if (typeof(module) === 'object') {
	module.exports = SDK;
}
