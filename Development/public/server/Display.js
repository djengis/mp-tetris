'use strict';

var profil = require('./Profil.js').profil;

/**
 * @module server
 * @namespace server
 *
 * @class Display
 * @constructor
  
 * @param {Number} id	
 * @param {Socket} socket
 */
function Display(id, socket){
	
	/**
	 * @property _id
	 * @type Number
	 * @private
	 */
	this._id = id;
	
	/**
	 * @property _server
	 * @type Server
	 * @private
	 */
	this._server = Display.getServer();
	
	/**
	 * @property _db
	 * @type server.Database
	 * @private
	 */
	this._db = this._server.getDB();
	
	/**
	 * @property _profil
	 * @type server.Profil
	 * @default null
	 * @private
	 */
	this._profil = null;
	
	/**
	 * @property _spiel
	 * @type server.Game
	 * @default null
	 * @private
	 */
	this._spiel = null;
	
	/**
	 * @property _socket
	 * @type Socket
	 * @private
	 */
	this._socket = null;
	this.setSocket(socket);
}

/**
 * Setzt den Server
 *
 * @method setServer
 * @param {server.Server} server
 */
Display.setServer = function(server){
	this._server = server;
};

/**
 * Gibt den Server zurück
 *
 * @method getServer
 * @static
 * @return {server.Server}
 */
Display.getServer = function(){
	if(!this._server){
		throw new Error("Server nicht gesetzt. class Display");
	}
	return this._server;
};

/**
 * Gibt die zufällig generierte ID des Displays wieder.
 *
 * @method getId
 * @return {Number}
 */
Display.prototype.getId = function(){
	return this._id;
};

/**
 *
 *
 * @method tick
 */
Display.prototype.tick = function(){
	/*void*/
};

/**
 * Setzt das Spiel. -> Das Display verfolgt dann das Spiel.
 *
 * @method setSpiel
 * @chainable
 *
 * @param {server.Game} spiel
 */
Display.prototype.setSpiel = function(spiel){
	this._spiel = spiel;
	return this;
};

/**
 * Setzten den Profil. -> Das Display verfolgt dan den Profil und Zeigt immer das Spiel an, in dem er sich bedfindent!
 *
 * @method setProfil
 * @chainable
 * @param {server.Profil} profil
 */
Display.prototype.setProfil = function(profil){
	this._profil = profil;
	return this;
};

/**
 * Setzte und bindet die Socket-Ereignisse.
 *
 * @method setSocket
 * @param {Socket} socket
 */
Display.prototype.setSocket = function(socket){
	this._socket = socket;
	
	this._socket.on('connectToSpiel', function (data, fn) {
	
		var spiel = Display.getServer().getSpielById(data.SpielID);
		var status;
		
		
		if(spiel === null){
			fn({"ok":false, "message": "Spiel ("+data.SpielID+") nicht gefunden!"});
			return;
		}else{
			status = spiel.getGameStatus();
			if(status === "aborted"){
				fn({"ok":false, "message": "Das Spiel wurde abgerochen."});
				return;
			}
			this._spiel = spiel;
			spiel.addDisplay(this);
		
			fn({"ok":true, "data": spiel.getEmitData()});
			return;
		}
		
	}.bind(this));
	
	this._socket.on('disconnectFromSpiel', function (data, fn) {
		this.unsetSpiel();
		fn({"ok":true});
	}.bind(this));
	
	this._socket.on('connectToProfil', function (data, fn) {
	
		var profil = Display.getServer().getProfilById(data.ProfilID);
		
		if(profil){
			profil.addEventListener(this);
			this.setProfil(profil);
			fn({"ok":true, "data":profil.getEmitData()});
		}else{
			fn({"ok":false, "message": "Profil nicht gefunden."});
		}
	}.bind(this));
	
	this._socket.on('disconnectFromProfil', function (data, fn) {
		this.unsetProfil();
	}.bind(this));
	
	
};

/**
 * Versendet ein JSON Objekt mit dem eventName an das entsprechende Display.
 *
 * @method emitToDisplay
 * @chainable
 * @param {String} eventName
 * @param {JSON} obj
 */
Display.prototype.emitToDisplay = function(eventName, obj){
	//if(eventName === "ProfilLoggedInGame"){
	this._socket.emit(eventName, obj);
	//}
	
	return this;
};

/**
 * Setzte das verfolgte Profil zurück auf null.
 *
 * @method unsetProfil
 * @chainable
 */
Display.prototype.unsetProfil = function(){
	if(this._profil!==null){
		this._profil.removeEventListener(this);
	}
	return this;
};

/**
 * Setzte das verfolgte Spiel zurück auf null.
 *
 * @method unsetSpiel
 * @chainable
 */
Display.prototype.unsetSpiel = function(){
	if(this._spiel !== null){	
		this._spiel.removeDisplay(this);
		this._spiel = null;
	}
	return this;
};

/**
 * Listenerimplementierung
 *
 * @method receiveEvent
 * @param {String} eventName
 * @param {JSON} obj
 */
Display.prototype.receiveEvent = function(eventName, obj){
	if(obj.getEmitData === undefined){
		this.emitToDisplay(eventName, obj);
	}else{
		this.emitToDisplay(eventName, obj.getEmitData());
	}
};

/**
 * @method destructor
 */
Display.prototype.destructor = function(){
	this._id = null;
	this.unsetProfil();
	this.unsetSpiel();
};

exports.Display = Display;