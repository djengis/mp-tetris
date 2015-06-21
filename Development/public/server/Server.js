'use strict';
  
var Controller = require('./Controller.js').Controller;
var Display = require('./Display.js').Display;
var Game = require('./Game.js').Game;
var Profil = require('./Profil.js').Profil;
var Database = require('./Database.js').Database;
var SpielTyp = require('./SpielTyp.js').SpielTyp;
var CONFIG = require('./../global/config.js').CONFIG;
var Util = require('./../global/Util.js').Util;
var DB = require('./../global/db.js').DB;

/**
 * Konstruktor für Server
 *
 * @class Server
 * @constructor
 * @module server
 * @namespace server
 * @param {Object} httpserver
 */
function Server(httpserver) {
	/**
	 * @property _httpserver
	 * @type Object
	 * @private
	 */
	this._httpserver = httpserver;
	
	/**
	 * @property _socket
	 * @type socket@
	 * @private
	 */
	this._socket = require('socket.io');
	
	/**
	 * Instanz der Datenbank.
	 *
	 * @property _db
	 * @type server.Database
	 * @private
	 */
	this._db = null;
	
	/**
	 * Wert, die bei jeder Vergabe weiter hochgezählt wird im eindeutige ID während des Betriebes zu schaffen.
	 *
	 * @property _idPool
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._idPool = 0;
	
	/**
	 * @property _io
	 * @type socket.io-instance
	 * @default null
	 * @private
	 */
	this._io = null;
	
	/**
	 * Hält eine Liste mit ALLEN Spielen.
	 *
	 * @property _games
	 * @type Array
	 * @default []
	 * @private
	 */
	this._games = [];
	
	/**
	 * Hält eine Liste mit ALLEN Profilen.
	 *
	 * @property _profils
	 * @type Array
	 * @default []
	 * @private
	 */
	this._profils = []; 
	
	/**
	 * Hält eine Liste mit allen SpielTypen.
	 *
	 * @property _spielTyps
	 * @type Array
	 * @default []
	 * @private
	 */
	this._spielTyps = [];
	
	/**
	 * Hält eine Liste mit ALLEN Controllern.
	 *
	 * @property _controllers
	 * @type Array
	 * @default []
	 * @private
	 */
	this._controllers = [];
	
	/**
	 * Hält eine Liste mit ALLEN Displays.
	 * 
	 * @property _displays
	 * @type Array
	 * @default []
	 * @private
	 */
	this._displays = [];
}

/**
 * Gibt die Datenbakverbindung wieder.
 *
 * @method getDB
 * @return {server.Database} die Datenbank
 */
Server.prototype.getDB = function(){
	return this._db;
};

/**
 * Listenerimplementierung
 *
 * @method receiveEvent
 * @param {String} eventName
 * @param {JSON} obj
 */
Server.prototype.receiveEvent = function(eventName, obj){
	switch(eventName){
		case "SpielNoPlayers":
			this.deleteSpiel(obj);
			break;
		default:
			this.emitToAllControllers(eventName, obj);
	}
};

/**
 * Senden Nachrichten an _alle_ Verbundenen Controller.
 *
 * @method emitToAllControllers
 * @param {String} eventName der Event-Name
 * @param {JSON} obj das geänderte Object/die Daten
 */
Server.prototype.emitToAllControllers = function(eventName, obj){
	var i, controller;

	for(i in this._controllers){
		controller = this._controllers[i];
		controller.emitToController(eventName, obj);
	}
};

/**
 * Gibt alle Profile wieder.
 *
 * @method getAllProfils
 * @return {Array} Array mit allen Profilen
 */
Server.prototype.getAllProfils = function(){
	return this._profils;
};

/**
 * Gibt alle Spiele wieder.
 *
 * @method getAllGames
 * @return {Array}
 */
Server.prototype.getAllGames = function(){
	return this._games;
};

/**
 * Gibt ein SpielTyp anhand der ID wieder.
 * Stimmt die übergebene ID mit keiner SpielTyp ID über ein, wird null zurück gegeben.
 *
 * @method getSpielTypById
 * @param {Number} id die SpielTypID
 * @return {server.SpielTyp|null}
 */
Server.prototype.getSpielTypById = function(id){
	var i;
	for(i in this._spielTyps){
		if(this._spielTyps[i].getId() === id){
			return this._spielTyps[i];
		}
	}
	return null;
};

/**
 * Gibt ein Spiel anhand der ID wieder.
 * Stimmt die übergebene ID mit keiner SpieleID über ein, wird null zurück gegeben.
 *
 * @method getSpielById
 * @param {Number} id die SpielID
 * @return {server.Game|null} 
 */
Server.prototype.getSpielById = function(id){
	var i;
	for(i in this._games){
		if(this._games[i].getId() === id){
			return this._games[i];
		}
	}
	return null;
};

/**
 * Gibt den Profil mit der übergebene id wieder.
 * Stimmt die übergebene ID mit keiner Profil ID über ein, wird null zurück gegeben.
 * 
 * @method getProfilById
 * @param {Number} id die ProfilID
 * @return {server.Profil|null}
 */
Server.prototype.getProfilById = function(id){
	// lineare suche.. skaliert nicht wirklich schön. über eine datenbank wäre dies prettyer
	// ABER wir erwarten auch keine 100.000.000.000 Profile ;)
	var i, profil;
	
	for(i in this._profils){
		profil = this._profils[i];
		if(profil.getId() === id){
			return profil;
		}
	}
	return null;
};

/**
 * Fügt einen Spiel der Spielliste hinzu und hörcht. (receiveEvent)
 *
 * @method addSpiel
 * @param {server.Game} game Instanz der Klasse Spiel
 */
Server.prototype.addSpiel = function(spiel){
	this._games.push(spiel);
	spiel.addEventListener(this); // füge den Server als Listener hinzu
	this.emitToAllControllers("SpielAdded", spiel); 
	spiel.startEvents();
};

/**
 * Fügt einen Profil der Profilliste hinzu und hörcht. (receiveEvent)
 *
 * @method addProfil
 * @param {Profil} profil Instanz der Klasse Profil
 */
Server.prototype.addProfil = function(profil){
	this._profils.push(profil);
	profil.addEventListener(this); // füge den Server als Listener hinzu
	this.emitToAllControllers("ProfilAdded", profil); 
	profil.startEvents();
};

/**
 * Erstellt einen neuen Profil, fügt diesen der Profilliste hinzu und horcht.
 *
 * @method createProfil
 * @param {JSON} data Die Daten des Profils.
 * @param {Function} fn (optional) Callback, welches von einem socket ausgehen kann.
 * @param {Function} controller (optional) der Controller, der das Event ausgeführt hat. ruft dessen setProfil auf. 
 */
Server.prototype.createProfil = function(data, fn, controller){ 

	var Name = data.name;
	
	if(Name===""){
		fn({ok: false, message: "Der Name darf nicht leer sein."});
		return;
	}
	
	Profil.create(function(profil){	
	
		if(profil){
			profil.setName(Name);
	   		this.addProfil(profil);
		
	   		if(controller !== undefined){
		   		controller.setProfil(profil);   
		   	}
			if(fn !== undefined){
				var ret = profil.getEmitData();
				ret.ok = true;
				fn(ret);
			}
			profil.save();
	   	}else{
			if(fn !== undefined){
				var ret = {};
				ret.ok = false;
				ret.message = "Konnte das Profil nicht erstellen.";
				fn(ret);
			}
	   	}

	}.bind(this));
};

/**
 * Erstellt einen neuen Spiel, fügt diesen der Spielliste hinzu und horcht.
 *
 * @method createGame
 * @param {JSON} data Die Daten des Spiels.
 * @param {Function} [fn] Callback, welches von einem socket ausgehen kann.
 */
Server.prototype.createGame = function(data, fn){
	var ersteller = this.getProfilById(data.ProfilID);
	var maxProfil = data.MaxProfil;
	var spielTyp = this.getSpielTypById(data.SpielTypID);

	Game.create(function(game){
		game.setMaxProfil(maxProfil);
		game.setSpielTyp(spielTyp);
		game.setErsteller(ersteller);
		game.addMitprofil(ersteller, true);
		
   		this.addSpiel(game); 
		
		if(fn !== undefined){
			var ret = game.getEmitData();
			ret.ok = true;
			fn(ret);
		}
	}.bind(this));
};

/**
 * LÖSCHT Spiel aus der DB
 *
 * @method deleteSpiel
 * @param {server.Game} spiel
 */
Server.prototype.deleteSpiel = function(spiel){
	this.emitToAllControllers("SpielDeleted", spiel);
	spiel.stopEvents();
	this.removeSpiel(spiel);
	spiel.delete();
};

/**
 * Entfernt Spiel aus der Liste, NICHT aus der DB
 *
 * @method removeSpiel
 * @param {server.Game} spiel
 */
Server.prototype.removeSpiel = function(spiel){
	//spiel.removeEventListener(this); <- relevant?
	spiel.destruct();
	this._games = Util.delArray(this._games, spiel); 
};
  

/**
 * Start des Servers.
 *
 * @method start
 */
Server.prototype.start = function(){
	
	
	// Datenbank
	this._db = new Database(DB.host, DB.user, DB.password);
	this._db.connectDatabase(DB.name, DB.create_database);

	Game.setServer(this);
	Profil.setServer(this);
	Controller.setServer(this);
	Display.setServer(this);

	// lade Profil
	var sqlProfil = "SELECT ProfilID FROM Profil ORDER BY Name ASC";
	
	this._db.query(sqlProfil, [], function(err, result){
   		if(err){ throw err; }
   		var i, row, profil;
   		   		
   		for(i in result){
	   		row = result[i];
   			profil = new Profil(row.ProfilID);
   			profil.load();
   			this.addProfil(profil);
   		
   		}
	}.bind(this));

	// lade Spiele
	//Der Server ist grade erst gestartet, es gibt keine Spiele, die grad laufen..
	var sqlSpiel = "SELECT SpielID FROM Spiel";
	
	this._db.query(sqlSpiel, [], function(err, result){
   		if(err){ throw err; }
   		var i, row, spiel;
   		   		
   		for(i in result){
	   		row = result[i];
   			Game.getGameById(row.SpielID, this, function(o){
   				this.addSpiel(o);
   			}.bind(this));
   		
   		}
	}.bind(this));
	
	
	// lade Spieltypen
	var sqlSpieltyp = "SELECT * FROM SpielTyp ORDER BY Bezeichnung";
	
	this._db.query(sqlSpieltyp, [], function(err, result){
   		if(err){ throw err; }
   		var i, row, spielTyp;
   		
   		for(i in result){
	   		row = result[i];
   			spielTyp = new SpielTyp(row.SpielTypID, row.Bezeichnung, row.Class);
   			this._spielTyps.push(spielTyp);
   		
   		}
	}.bind(this));
	
	
	// binde Sockets
	this._io = this._socket.listen(this._httpserver, { 
		log: false
	});
	
	
	this._io.sockets.on('connection', function(socket) {
	
		var id, type, obj;
		
		id = this._idPool++;
		type = null;
		obj = null;
	
		socket.on('connectController', function (data, fn) {
			type = "controller";
			obj = new Controller(id, socket);
			this._controllers.push(obj);
			
			fn({id: id});
		}.bind(this));
	
		socket.on('connectDisplay', function (data, fn) {
			type = "display";
			obj = new Display(id, socket);
			this._displays.push(obj);
			fn(id);
		}.bind(this));
		
		socket.on('disconnect', function () {
			if(type==="controller"){
				Util.delArray(this._controllers, obj);
				obj.destructor();
			}
			if(type==="display"){
				Util.delArray(this._displays, obj);
				obj.destructor();
			}
		}.bind(this));
		
	}.bind(this));
	
	console.log('läuft.');
};

/**
 * Stoppt des Servers.
 *
 * @method stop
 */
Server.prototype.stop = function(){
	console.log('Stopping Server (not correct implemented yet).');
	process.exit();
};

/**
 * Startet den Server neu.
 *
 * @method restart
 */
Server.prototype.restart = function(){
	console.log('Restart Server (not correct implemented yet).');
	process.exit();
};

exports.Server = Server;
