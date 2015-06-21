'use strict';

var Util = require('./../global/Util.js').Util;

/**
 * Konstruktor für Profil
 *
 * @module server
 * @namespace server
 * @class Profil
 * @constructor
 * @param {Number} id
 */
function Profil(id){

	/**
	 * ID des Profils
	 *
	 * @property _id
	 * @type Number
	 * @private
	 */
	this._id = id;
	
	/**
	 * Name des Profils
	 *
	 * @property _Name
	 * @type String
	 * @default null
	 * @private
	 */
	this._Name = null;
	
	/**
	 * Ist das Profil online?
	 *
	 * @property _online
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._online = false;
	
	/**
	 * Datenbankinstanz
	 *
	 * @property _db
	 * @type server.Database
	 * @private
	 */
	this._db = Profil._server.getDB();
	
	/**
	 * Liste für EventListener
	 *
	 * @property _eventListeners
	 * @type Array
	 * @default []
	 * @private
	 */
	this._eventListeners = [];
	
	/**
	 * Zeitstempel der letzten Anmeldung
	 *
	 * @property _LetzteAnmeldung
	 * @type Date
	 * @default null
	 * @private
	 */
   	this._LetzteAnmeldung = null; 
	
	/**
	 * Zeitstempel der Registrierung
	 *
	 * @property _AnmeldeDatum
	 * @type Date
	 * @default null
	 * @private
	 */
   	this._AnmeldeDatum = null;
	
	/**
	 * Anzahl der gespielten Spiele
	 *
	 * @property _gespielteSpiele
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._gespielteSpiele = 0;
	
	/**
	 * Anzahl der gesetzten Steine
	 * 
	 * @property _gesetzteSteine
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._gesetzteSteine = 0;
	
	/**
	 * Spiel, indem das Profil angemeldet ist
	 *
	 * @property _loggedInGame
	 * @type server.Game
	 * @default null
	 * @private
	 */
	this._loggedInGame = null;
	
	/**
	 * Controller des Profils
	 *
	 * @property _controller
	 * @type server.Controller
	 * @default null
	 * @private
	 */
	this._controller = null;
	
	/**
	 * Läuft momentan ein Event?
	 *
	 * @property _fireEvents
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._fireEvents = false;
	
	/**
	 * @property _chat
	 * @type server.Chat
	 * @default null
	 * @private
	 */
	this._chat = null;
}

/**
 * Setzt den Server
 *
 * @method setServer
 * @chainable
 * @static
 * @param {server.Server} server
 */
Profil.setServer = function(server){
	this._server = server;
};

/**
 * Gibt den Server zurück
 *
 * @method getServer
 * @static
 * @return {server.Server}
 */
Profil.getServer = function(){
	if(!this._server){
		throw new Error("Server nicht gesetzt. class Profil");
	}
	return this._server;
};

/**
 * @method setChat
 * @param {server.Chat} chat
 */
Profil.prototype.setChat = function(chat){
	this._chat = chat;
};

/**
 * @method getChat
 * @return {server.Chat} 
 */
Profil.prototype.getChat = function(){
	return this._chat;
};

/**
 * @method hasChat
 * @return {Boolean} 
 */
Profil.prototype.hasChat = function(){
	return !!this._chat;
};

/**
 * @method unsetChat
 */
Profil.prototype.unsetChat = function(){
	this._chat = null;
};

/**
 * Setzt den Controller des Profils.
 *
 * @method setController
 *
 * @param {server.Controller} controller
 */
Profil.prototype.setController = function(controller){
	this.unsetController();
		
	this._controller = controller;
	
	if(this.getController().getProfil() !== this){
		this.getController().setProfil(this);
	}
   	this._broadcastEvent("ProfilChange", this);
};

/**
 * Setzt den Controller des Profils zurück.
 * Setzt auch im Controller das verbundene Profil zurück, 
 * wenn bubble nicht auf gesetzt wird. 
 *
 * @method unsetController
 * @param {Boolean} [bubble=true]
 */
Profil.prototype.unsetController = function(bubble){
	if(bubble === undefined) bubble = true;
	
	if(this.hasController()){
		if(bubble){
			this.getController().unsetProfil(false);
		}
		this._controller = null;
	}	
   	this._broadcastEvent("ProfilChange", this);
};

/**
 * Gibt wieder, ob ein Controller definiert wurde.
 *
 * @method hasController
 * @return {Boolean}
 */
Profil.prototype.hasController = function(){
	return this._controller !== null;
};

/**
 * Gibt den Controller wieder.
 *
 * @method getController
 * @return {server.Controller}
 */
Profil.prototype.getController = function(){
	return this._controller;
};

/**
 * Gibt das Spiel wieder, indem sich das Profil angemeld hat.
 *
 * @method getLoggedInGame
 * @return {server.Game}
 */
Profil.prototype.getLoggedInGame = function(){
	return this._loggedInGame;
};

/**
 * Setzte das Spiel, indem sich das Profil befinden soll.
 *
 * @method setLoggedInGame
 * @chainable
 * @param {server.Game} spiel
 */
Profil.prototype.setLoggedInGame = function(spiel){
	this._loggedInGame = spiel;
   	this._broadcastEvent("ProfilChange", this);
   	this._broadcastEvent("ProfilLoggedInGame", this);
	return this;
};

/**
 * Gibt wieder, ob das Profil sich in ein Spiel eingeklingt hat.
 *
 * @method isLoggedInGame
 * @return {Boolean}
 */
Profil.prototype.isLoggedInGame = function(){
	return this._loggedInGame !== null;
};


/**
 * Addiert die Zahl n zu der Anzahl der gesetzten Steine hinzu
 *
 * @method AddGesetzteSteine
 * @chainable
 * @param {Number} n
 */
Profil.prototype.AddGesetzteSteine = function(n){
	if(n==0){
		return;
	}
	this._gesetzteSteine += n;
   	this._broadcastEvent("ProfilChange", this); 
   	return this;
};

/**
 * Addiert die Zahl n zu der Anzahl der gespielten Spiele hinzu
 *
 * @method AddGespielteSpiele
 * @chainable
 * @param {Number} n
 */
Profil.prototype.AddGespielteSpiele = function(n){
	if(n==0){
		return;
	}

	this._gespielteSpiele += n;
   	this._broadcastEvent("ProfilChange", this); 
   	return this;
};

/**
 * Gibt den Namen des Profils zurück.
 *
 * @method getName
 * @return {String}
 */
Profil.prototype.getName = function(){
	return this._Name;
};

/**
 * Setzt den Namen des Profils
 *
 * @method setName
 * @chainable
 * @param {String} name
 */
Profil.prototype.setName = function(name){
	this._Name = name;
   	this._broadcastEvent("ProfilChange", this); 
	
	return this;
};

/**
 * Gibt die ID des Profils wieder.
 *
 * @method getId
 * @return {Number}
 */
Profil.prototype.getId = function(){
	return this._id;
};

/**
 * Gibt wieder, ob das Profil online ist oder nicht.
 *
 * @method isOnline
 * @retrun {boolean}
 */
Profil.prototype.isOnline = function(){
	return this._online;
};

/**
 * Setzt den Onlinestatus des Spielers. Aktuallisiert in der Datenbank,
 * die Spalte "LetzteAnmeldung".
 * Falls der User auf offline gesetzt wird, wird dieser aus dem aktuellen
 * sich befindenen Spiel entfernt.
 *
 * @method setOnline
 * @chainable
 * @param {Boolean} booli
 */
Profil.prototype.setOnline = function(booli){
	if(this._online !== booli){
		this._online = booli;	

		this._LetzteAnmeldung = new Date(); 	
		
		var sqlLetzterLogin = "" + 
		"UPDATE Profil " +
		"SET LetzteAnmeldung = CURRENT_TIMESTAMP " +
		"WHERE ProfilID = ? " +
		"LIMIT 1;";
		
		this._db.query(sqlLetzterLogin, [this.getId()], function(err, result){
   			if(err) { throw err; }
   			   	  		
		}.bind(this));
	}
	
	if(this._online === false){
		if(this.isLoggedInGame()){
			var spiel = this.getLoggedInGame();
			spiel.removeMitprofil(this);
		}
	}
	
	this._broadcastEvent("ProfilChange", this); 
	return this;
};

/**
 * Erstellt ein Json Objekt vom Profil
 *
 * @method getEmitData
 * @return {JSON}
 */
Profil.prototype.getEmitData = function(){
	var o = {};
	o.ProfilID = this.getId();
	o.isOnline = this.isOnline();
	o.Name = this.getName();
	
	o.AnmeldeDatum = this._AnmeldeDatum;
	o.LetzteAnmeldung = this._LetzteAnmeldung; 
	o.gespielteSpiele = this._gespielteSpiele;
	o.gesetzteSteine = this._gesetzteSteine;
	
	o.isLoggedInGame = this.isLoggedInGame();
	if(o.isLoggedInGame){
		o.SpielID = this.getLoggedInGame().getId();
	}
	
	return o;
};

/**
 * Fügt der Button Aktion ein Profil hinzu und setzt anschließend ein Broadcast drauf 
 *
 * @method onButton
 * @param {JSON} data
 *
 * @example onButton({"type":"buttonDown","key":button})
 */
Profil.prototype.onButton = function(data){
	data.profil = this.getEmitData();
	this._broadcastEvent("ProfilButton", data);
};

/**
 * Fügt einen EventListener der Liste hinzu
 *
 * @method addEventListener
 * @param {Object} listener
 */
Profil.prototype.addEventListener = function(listener){
	this._eventListeners.push(listener);
};

/**
 * Entfernt einen Listener.
 *
 * @method removeEventListener
 * @param {Object} listener zu entfernender Listener.
 * @return {Boolean} Gibt true bei Erfolg wieder.
 */
Profil.prototype.removeEventListener = function(listener){
	var oldL = this._eventListeners.length;
	this._eventListeners = Util.delArray(this._eventListeners, listener);
	return (oldL != this._eventListeners.length)
};

/**
 * Stopt ein Event
 *
 * @method stopEvents
 * @chainable
 */
Profil.prototype.stopEvents = function(){
	this._fireEvents = false;
	return this; 
};

/**
 * Startet ein Event
 *
 * @method startEvents
 * @chainable
 * @param {Boolean} emitNow
 */
Profil.prototype.startEvents = function(emitNow){
	this._fireEvents = true;
	if(emitNow){
		this._broadcastEvent("ProfilChange", this); 	
	}
	return this;
};

/**
 * @method _broadcastEvent
 * @private
 * @param {String} eventName 
 * @param {JSON} obj
 * @param {Boolean} force
 */
Profil.prototype._broadcastEvent = function(eventName, obj, force){
	if(!this._fireEvents && !force){
		return;
	}
	var i, listener;
	for(i in this._eventListeners){
		listener = this._eventListeners[i];
		if(listener!==undefined && listener.receiveEvent !== undefined){
			listener.receiveEvent(eventName, obj);
		}
	}
};

/**
 * Erstellt den Spieler inkusive Datenbankeintrag.
 *
 * @method create
 * @async
 * @static
 * @param {Function} callback
 */
Profil.create = function(callback){
	var sqlProfilCreate = "" +
	"INSERT INTO Profil SET " +
	" Name = '"+((new Date()).valueOf())+"', " + // tmp, da der Name unique ist
	" AnmeldeDatum = CURRENT_TIMESTAMP;";
		
	Profil.getServer().getDB().query(sqlProfilCreate, [], function(err, result){
   		if(err){
   			console.log(err);
			callback(null);
			return;
   		}
   		
   		var profil = new Profil(result.insertId);
			
		if(callback){
			callback(profil);
		}
	}.bind(this));
};

/**
 * Lädt ein Spieler, anhand der ID, die im Kontruktor mitgegeben wurde.
 *
 * @method load
 * @async
 * @param {Function} callback
 */	
Profil.prototype.load = function(callback){
	var sqlProfil = "" +
	"SELECT Profil.*, " +
	"       SUM(IFNULL(Score.GesetzteBloecke,0)) AS GesetzteBloeckeSUM, " +
	"       COUNT(Spiel.SpielID) AS SpieleCOUNT " +
	" FROM Profil " +
	" NATURAL LEFT JOIN Score " +
	" NATURAL LEFT JOIN Spiel " +
	"WHERE ProfilID = ? " +
	"GROUP BY Profil.ProfilID " +
	"LIMIT 1;";
		
	this._db.query(sqlProfil, [this.getId()], function(err, result){
   		if(err){
   			console.log(err);
			callback(null);
			return;
   		}
   		
	   	var row = result[0];
	   	this._Name = row.Name;
	   	this._LetzteAnmeldung = row.LetzteAnmeldung; 
	   	this._AnmeldeDatum = row.AnmeldeDatum;
		this._gespielteSpiele = row.SpieleCOUNT;
		this._gesetzteSteine = row.GesetzteBloeckeSUM; 
		
		if(callback){
			callback(this);
		}
		
		this._broadcastEvent("ProfilChange", this);  
	}.bind(this));	 	
};

/**
 * Persistiert die in der Instanz befindtlichen Daten.
 *
 * @method save
 * @async
 * @param {Function} callback
 */
Profil.prototype.save = function(callback){
	var sqlUpdateProfil = "UPDATE Profil SET " +
	" Name = ?, " +
	" LetzteAnmeldung = ? " +
	" WHERE ProfilID = ? " +
	" LIMIT 1";	
	
	var daten = [this._Name, this._LetzteAnmeldung, this.getId()];

	this._db.query(sqlUpdateProfil, [daten], function(err, result){
   		if(err){
   			console.log(err);
			callback(null);
			return;
   		}
		
		if(callback){
			callback(this);
		}
		
	}.bind(this));	 		
}

/**
 * Entfernt Profil, dessen Scores und die Verknüpfung zu Spielen aus der Datenbank
 *
 * @method delete
 * @async
 * @param {Function} callback
 */
Profil.prototype.delete = function(callback){

	var id = this.getId();
	
	if(id===null){
		if(callback)
			callback(null);
		return false;
	}
	
	var sqlDeleteProfil = "DELETE FROM Profil WHERE ProfilID = ?;";
	var sqlDeleteSpielt = "DELETE FROM Profil_Spielt_Spiel WHERE ProfilID = ?;";
	var sqlDeleteScore = "DELETE FROM Score WHERE ProfilID = ?;";
	this._db.query(sqlDeleteProfil, [id], function(err, result){
   		if(err){ throw err; }
		if(callback)
			callback(id);
	}.bind(this));
	this._db.query(sqlDeleteSpielt, [id], function(err, result){
   		if(err){ throw err; }
		if(callback)
			callback(id);
	}.bind(this));
	this._db.query(sqlDeleteScore, [id], function(err, result){
   		if(err){ throw err; }
		if(callback)
			callback(id);
	}.bind(this));
};

exports.Profil = Profil;
