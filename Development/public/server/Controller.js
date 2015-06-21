'use strict';

var BUTTON = require('../global/enum_controller_buttons.js').BUTTON;
var CONFIG = require('./../global/config.js').CONFIG;
var Profil = require('./Profil.js').Profil;
var Game = require('./Game.js').Game;

/**
 * @module server
 * @namespace server
 *
 * @class Controller
 * @constructor
  
 * @param {Number} id
 * @param {Socket} socket
 */
function Controller(id, socket){
	/**
	 * Zufällig vergabene ID um die jeweiligen Controller zu identifizieren.
	 *
	 * @property _id
	 * @private
	 * @type Number
	 */
	this._id = id;
	
	/**
	 * @property _socket
	 * @private
	 * @type Socket
	 */
	this._socket = null;
	this.setSocket(socket);
	
	/**
	 * @property _server
	 * @private
	 * @type server.Server
	 */
	this._server = Controller.getServer();
	
	/**
	 * @property _db
	 * @private
	 * @type server.Database
	 */
	this._db = this._server.getDB();
	
	/**
	 * Instanz des Profils, welches mit dem Controller verknüpft ist, sofern verknüpft. 
	 * 
	 * @property _profil
	 * @private
	 * @type server.Profil
	 * @default null
	 */
	this._profil = null;
}

/**
 * @method setServer
 * @static
 *
 * @param {server.Server} server
 */
Controller.setServer = function(server){
	this._server = server;
};

/**
 * @method getServer
 *
 * @return {server.Server}
 */
Controller.getServer = function(){
	if(!this._server){
		throw new Error("Server nicht gesetzt. class Controller");
	}
	return this._server;
};

/**
 * Gibt die id des Controllers zurück.
 *
 * @method getId
 * @return {Number} die id
 */
Controller.prototype.getId = function(){
	return this._id;
};

/**
 * Total nutzlose Methode die entfernt werden sollte.
 *
 * @deprecated
 * @method tick
 */
Controller.prototype.tick = function(){
	throw new Error("why i am here?");
};

/**
 * @method emitToController
 *
 * @param {String} eventName
 * @param {JSON} obj
 */
Controller.prototype.emitToController = function(eventName, obj){
	if(obj instanceof Profil){
		this._socket.emit(eventName, obj.getEmitData());
		return;
	}
	if(obj instanceof Game){
		this._socket.emit(eventName, obj.getEmitData());
		return;
	}
	this._socket.emit(eventName, obj);
};

/**
 * @method setSocket
 *
 * @param {Socket} socket
 */
Controller.prototype.setSocket = function(socket){
	this._socket = socket;
	
	// Control
	this._socket.on('button', function (data) {
		if(this.hasProfil()){
			this.getProfil().onButton(data);
		}
	}.bind(this));
	
	// Profil
	
	this._socket.on('createPlayer', function (data, fn){
		this._server.createProfil(data, fn, this);
	}.bind(this));
		
	this._socket.on('updatePlayerlist', function (data, fn) {
		var all = this._server.getAllProfils();
		var i;
		var table = [];
		
		for(i in all){
			table.push(all[i].getEmitData());
		}
		
		fn(table); 
	}.bind(this));
		
	this._socket.on('selectPlayer', function (data, fn) {
	
		var profil = this._server.getProfilById(data.profil_id);
		if(profil!==null){
   			this.setProfil(profil);
	   		fn({ok: true, data: {id: profil.getId(), name: profil.getName()}});
		}else{
		   	fn({ok: false, message: "message not defined"});
		}
	}.bind(this));
	
	this._socket.on('disselectPlayer', function (data, fn) {
	   	this.unsetProfil();
	   	fn({ok: true, message: CONFIG.byebye_message});
	}.bind(this));
	
	// Games
	
	this._socket.on('createGame', function (data, fn){
		if(this.getProfil() === null){ throw new Error("Kein Profil im Controller. Konnte Spiel nicht erstellen."); }
		data.ProfilID = this.getProfil().getId();
		
		this._server.createGame(data, fn);
	}.bind(this));
	
	this._socket.on('selectGame', function (data, fn) {
		var spiel = Controller.getServer().getSpielById(data.SpielID);
		var profil = this.getProfil();
		
		if(spiel===null){
			return;
		}
		if(spiel.hasMitprofil(profil)){
	   		fn({ok: true, data: spiel.getEmitData()}); 
			return;
		}
		
		if(spiel.addMitprofil(profil)){
	   		fn({ok: true, data: spiel.getEmitData()}); 
		}else{
		   	fn({ok: false, message: "Das Spiel ist leider schon Voll."});
		}
	}.bind(this));
	
	this._socket.on('leaveGame', function (data, fn) {
		//var spiel = Controller.getServer().getSpielById(data.SpielID);
		var profil = this.getProfil();
		
		if(!profil){
		   	fn({ok: false, message: "Sie sind nicht Angemeldet."});
			return;
		}
		
		var spiel = profil.getLoggedInGame();
		
		if(!spiel){
		   	fn({ok: false, message: "Sie waren in keinem Spiel."});
			return;
		}
		
		var ersteller = spiel.removeMitprofil(profil);
		
	   	fn({ok: true, data: null});
		
	
	}.bind(this));
	
	this._socket.on('startGame', function (data, fn) {
		var spiel = Controller.getServer().getSpielById(data.SpielID);
		var profil = this.getProfil();
		
		if(spiel === null){
		   	fn({ok: false, message: "Sie befinden sich nicht in einem Spiel."});
		   	return;
		}
		
		if(spiel.getErstellerId() == profil.getId()){
		
	   		if(spiel.startGame()){
		   		var game_data = spiel.getEmitData();
		   		game_data.gameStartWaitTimer = CONFIG.gameStartWaitTimer;
		   		
			   	fn({ok: true, data: game_data}); 
	   		}else{
		   		fn({ok: false, message: "Das Spiel befindet sich in einem ungültigen Zustand."});
	   		}
		}else{
		   	fn({ok: false, message: "Nur der Spiel-Ersteller kann das Spiel starten."});
		}
		
	
	}.bind(this));
		
	this._socket.on('updateGamelist', function (data, fn) {
		var all = this._server.getAllGames();
		var i;
		var table = [];
		
		for(i in all){
			// beendete Spiele nicht übertragen. wofür den auch..
			if(all[i]._gameStatus !== "ended"){
				table.push(all[i].getEmitData());
			}
		}
		
		fn(table); 
	}.bind(this));
	
	// unbinden von on event gibts leider noch nicht, weswegen das event schon hier gebindet
	// wird und nicht da, wo es gebraucht wird :/
	// schöner wäre es natürlich beim adden zu einem chat.. man kann leider net alles haben
	this._socket.on('ChatWrite', function (data, fn) {
		if(this.hasProfil()){
			var profil = this.getProfil();
			if(profil.hasChat()){
				profil.getChat().write(profil, data.chatText);
			}
		}
	}.bind(this));
	
	
	//hasChat
};

/**
 * Gibt die Instanz des Profils wieder, mitder der Controller verknüpft ist. Sofern verknüpft.
 *
 * @method getProfil
 *
 * @return {server.Profil}
 */
Controller.prototype.getProfil = function(){
	return this._profil;
};

/**
 * Setzte die Instanz des Profil zu diesem Controller und umgekehrt.
 * 
 * @method setProfil
 * @chainable
 *
 * @param {server.Profil} profil
 */
Controller.prototype.setProfil = function(profil){
	this.unsetProfil();
	
	this._profil = profil;
	
	if(this.getProfil().getController() !== this){
		this.getProfil().setController(this);
	}
	
	profil.setOnline(true);
	
	return this;
};

/**
 * Unsetzt die Instanz des Profil zu diesem Controller und umgekehrt.
 *
 * @method unsetProfil
 * @chainable
 *
 * @param {Boolean} bubble
 */
Controller.prototype.unsetProfil = function(bubble){
	if(bubble === undefined) bubble = true;

	if(this.hasProfil()){
		if(bubble){
			this.getProfil().unsetController(false);		
		}
		
		this._profil.setOnline(false);
		this._profil = null;	
	}
	
	return this;
};

/**
 * Gibt wieder, ob dieser Controller mit einem Profil verknüpft ist.
 *
 * @method hasProfil
 *
 * @return {Boolean}
 */
Controller.prototype.hasProfil = function(){
	return (this._profil !== null);
}

/**
 * @method destructor
 */
Controller.prototype.destructor = function(){
	this.unsetProfil();
};

exports.Controller = Controller;