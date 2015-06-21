"use strict";

var CONFIG = require('./../global/config.js').CONFIG;
var API_SCHEMA = require('./../global/api-schema.js').API_SCHEMA;
var Api = require('./Api.js').Api;
var RouterChache = require('./RouterChache.js').RouterChache;

/**
 * Konstruktor für Router
 *
 * @module server
 * @namespace server
 * @class Router
 * @constructor
 * @param {Object} app
 * @param {Game} gameServer
 */
function Router(app, gameServer){
	/**
	 * @property _express
	 * @type express-instance
	 * @private
	 */
	this._app = app;
	
	/**
	 * @property _gameServer
	 * @type server.Server
	 * @private
	 */
	this._gameServer = gameServer;
	
	/**
	 * @property _express
	 * @type express
	 * @private
	 */
	this._express = require('express');
	
	/**
	 * @property _routerCache
	 * @type server.RouterCache
	 * @private
	 */
	this._routerCache = new RouterChache();
	
	// replace {host}
	this._routerCache.addReplacer(function(data, ext){
		if(ext === "jhtml"){
			data = data.toString();
			return data.replace(/\{host\}/g, "http://localhost/");	
		}else{
			return data;
		}
	});
}

/**
 * Bindet das Profil-Routing
 *
 * @method bindProfilRouter
 */
Router.prototype.bindProfilRouter = function(){
	var router = this._express.Router(); 
	
	router.get('', function(req, res) {
		this.loadAndSendFile(req, res, "../profil/index.jhtml");
	}.bind(this));  
	
	router.get('/:profil_id', function(req, res) {
		this.loadAndSendFile(req, res, "../profil/einzelansichtProfil.jhtml");
	}.bind(this)); 
	
	router.get('/:profil_id/spiele', function(req, res) {
		this.loadAndSendFile(req, res, "../profil/einzelansichtProfil.jhtml");
	}.bind(this)); 
	
	this._app.use('/profil', router);
};

/**
 * Bindet das API-Routing.
 *
 * @method bindApiRouter
 */
Router.prototype.bindApiRouter = function(){
	
	var api = new Api(this._gameServer);
	
	var bindings = api.getBindings();
	for(var e in bindings){
		var router = this._express.Router(); 
		
		for(var i in bindings[e]){
			switch(bindings[e][i].type){
				case "get":
					router.get(bindings[e][i].url, bindings[e][i].func.bind(this));	
				break;
				case "put":
					router.put(bindings[e][i].url, bindings[e][i].func.bind(this));	
				break;
				case "delete":
					router.delete(bindings[e][i].url, bindings[e][i].func.bind(this));	
				break;
				case "post":
					router.post(bindings[e][i].url, bindings[e][i].func.bind(this));	
				break;
			}
		}
		this._app.use(e, router);
	}
	
};

/**
 * Bindet das API-Routing für das Root der API.
 *
 * @method bindApiRootRouter
 */
Router.prototype.bindApiRootRouter = function(){
	var router = this._express.Router(); 
	
	router.get('', function(req, res) {
		res.json(API_SCHEMA);
	}.bind(this)); 
	
	this._app.use('/api', router);
};

/**
 * Leitet dem RouterCache mit, ob er beim Routing Komplimieren und Optimieren soll.
 *
 * @method setChacheParameters
 * @param {Request} req
 */ 
Router.prototype.setChacheParameters = function(req){
	var acceptEncoding = req.headers['accept-encoding'];
	if(!acceptEncoding){ acceptEncoding = ''; }
	var zip = CONFIG.router.zip === true && acceptEncoding.match(/\bgzip\b/);
	
	this._routerCache.setParams(zip, CONFIG.router.minify);
};

/**
 * Laedt die angeforderte Daten ein und sendet sie. 
 *
 * @method loadAndSendFile
 * @param {Request} req
 * @param {Response} res
 * @param {String} dataPath
 * @param {Number} num
 * 
 */
Router.prototype.loadAndSendFile = function(req, res, dataPath, num){
	this.setChacheParameters(req);
	
	this._routerCache.loadFile(dataPath, function(fileData){
		if(fileData === null){
			next(); 
			return;
		}
		
		for(var v in fileData.headers){
			res.setHeader(fileData.headers[v][0], fileData.headers[v][1]);
		}
		
		if(num === undefined)
			res.send(fileData.data);
		else
			res.send(fileData.data, num);
	}.bind(this));
};

/**
 * Bindet den File-Router, um statische Dateien aufrufen zu können.
 *
 * @method bindFileRouter
 */ 
Router.prototype.bindFileRouter = function(){

	// gib die dateien wieder, wenn sie statisch existieren
	this._app.use("/", function(req, res, next){
		
		// cleanup url
		var dataPath = req.originalUrl;
		dataPath = dataPath.replace("../","./");
		dataPath = "../"+dataPath;
		dataPath = dataPath.replace("//","/");
		
		for(var i in CONFIG.router.doNotRoute){
			if(".."+CONFIG.router.doNotRoute[i] === dataPath){
				this.loadAndSendFile(req, res, "../error/403/index.jhtml", 403);
				return;
			}
		}
		
		// setup chache
		this.setChacheParameters(req);	
		
		this._routerCache.loadFile(dataPath, function(fileData){
			if(fileData === null){
				next();
				return;
			}
			
			for(var v in fileData.headers){
				res.setHeader(fileData.headers[v][0], fileData.headers[v][1]);
			}
			
			res.send(fileData.data);
		}.bind(this));
		
		
	}.bind(this));
};

/**
 * Bindet das API-Routing für die Highscores.
 *
 * @method bindHighscoreRouter
 */
Router.prototype.bindHighscoreRouter = function(){
	var router = this._express.Router(); 
	router.get('', function(req, res) {
		this.loadAndSendFile(req, res, "../highscore/index.jhtml");
	}.bind(this));
	this._app.use('/highscore', router);
};

/**
 * Bindet den Display-Router.
 *
 * @method bindDisplayRouter
 */
Router.prototype.bindDisplayRouter = function(){
	var displayRouter = this._express.Router(); 
	displayRouter.get('', function(req, res) {
		this.loadAndSendFile(req, res, "../display/index.jhtml");
	}.bind(this));
	this._app.use('/display', displayRouter);
};

/**
 * Bindet den Controller-Router.
 *
 * @method bindControllerRouter
 */
Router.prototype.bindControllerRouter = function(){
	var controllerRouter = this._express.Router(); 
	controllerRouter.get('', function(req, res) {
		this.loadAndSendFile(req, res, "../controller/index.jhtml");
	}.bind(this));
	this._app.use('/controller', controllerRouter);	
};

/**
 * Bindet den Startseiten-Router.
 *
 * @method bindStartseiteRouter
 */
Router.prototype.bindStartseiteRouter = function(){
	var router = this._express.Router(); 
	router.get('', function(req, res) {
		this.loadAndSendFile(req, res, "../startseite/index.jhtml");
	}.bind(this));
	this._app.use('/', router);	
};


/**
 * Bindet den 404-Router.
 *
 * @method bind404Router
 */
Router.prototype.bind404Router = function(){
	var router = this._express.Router(); 
	router.get('*', function(req, res) {
		this.loadAndSendFile(req, res, "../error/404/index.jhtml", 404); // 404 setzten
	}.bind(this));
	this._app.use('', router);	
};

/**
 * Bindet alle Router.
 *
 * @method bindRouters
 */
Router.prototype.bindRouters = function(){

	// statische Dateien
	this.bindFileRouter();
	
	// Display
	this.bindDisplayRouter();
	
	// Controller
	this.bindControllerRouter();

	// Profil
	this.bindProfilRouter();
	
	// Highscore
	this.bindHighscoreRouter();
	
	// API
	this.bindApiRouter();
	this.bindApiRootRouter();
	
	// Weiteres
	this.bindStartseiteRouter();
	
	// 404
	this.bind404Router();
};

exports.Router = Router;