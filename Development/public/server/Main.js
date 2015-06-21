"use strict";
	
var CONFIG = require('./../global/config.js').CONFIG;
var Server = require('./Server.js').Server;
var Router = require('./Router.js').Router;
var CommandLine = require('./CommandLine.js').CommandLine;
var DEBUG = true;

/**
 * Entwicklungszeitraum: vom xx bis xx
 *
 *
 * Entwickler: Anna Steinhilber, Nicole Emmel, Cengiz Mardin
 * Version: pre-pre-alpha
 *
 *
 * Nice to Knows:
 * * Restful: http://scotch.io/tutorials/javascript/build-a-restful-api-using-node-and-express-4
 * * browser-html: http://de.selfhtml.org/
 * * browser-jquery: http://api.jquery.com/
 * * node.js-express: http://expressjs.com/4x/api.html
 * * node-mysql: https://www.npmjs.org/package/mysql
 * * Doc: http://yui.github.io/yuidoc/syntax/
 * * UglifyJS: https://github.com/mishoo/UglifyJS
 *
 * @module server
 * @namespace server
 *
 * @class Main
 * @constructor
 */
function Main(){
	/**
	 * @property _http
	 * @type http
	 * @private
	 */
	this._http = require('http');
	
	/**
	 * @property _express
	 * @type express
	 * @private
	 */
	this._express = require('express');
	
	/**
	 * @property _bodyParser
	 * @type body-parser
	 * @private
	 */
	this._bodyParser = require('body-parser');
	
	/**
	 * @property _app
	 * @type express-instance
	 * @private
	 */
	this._app = this._express();
	this._app.use(this._bodyParser());
	
	/**
	 * @property _httpserver
	 * @type httpserver
	 * @private
	 */
	this._httpserver = this._http.createServer(this._app).listen(CONFIG.port);
	
	/**
	 * @property _gameServer
	 * @type server.Server
	 * @private
	 */
	this._gameServer = new Server(this._httpserver);
	
	/**
	 * @property _commandLine
	 * @type server.CommandLine
	 * @private
	 */
	this._commandLine = new CommandLine(this);
	
	/**
	 * @property _router
	 * @type server.Router
	 * @private
	 */
	this._router = new Router(this._app, this._gameServer);
	this._router.bindRouters();
}

/**
 * Startet den Server.
 *
 * @method start
 */
Main.prototype.start = function(){
	console.log("Willkommen bei Muliplayer Tetris");
	process.stdout.write("Starte Server... ");
	this._gameServer.start();
	this._commandLine.init();
};

/**
 * Stoppt den Server.
 *
 * @method stop
 */
Main.prototype.stop = function(){
	this._gameServer.stop();
};

/**
 * Startet den Server neu.
 *
 * @method restart
 */
Main.prototype.restart = function(){
	this._gameServer.restart();
};

// main

var main = new Main();
main.start();