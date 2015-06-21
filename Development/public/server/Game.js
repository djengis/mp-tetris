'use strict';

var CONFIG = require('./../global/config.js').CONFIG;
var Util = require('./../global/Util.js').Util;
var SpielAufZeit = require('./Games/SpielAufZeit/SpielAufZeit.js').SpielAufZeit;
var BUTTON = require('../global/enum_controller_buttons.js').BUTTON;
var Display = require('./Display.js').Display;
var Chat = require('./Chat.js').Chat;

/**
 * Konstruktor für Game
 *
 * @module server
 * @namespace server
 * @class Game
 * @constructor
 * @param {Number} id
 */
function Game(id){
	
	/**
	 * Die ID des Spieles in der Datenbank, sowie im System.
	 *
	 * @property _SpielID
	 * @type Number
	 * @private
	 */
	this._SpielID = parseInt(id);
	
	/**
	 * Instanz des Servers.
	 *
	 * @property _server
	 * @type server.Server
	 * @private
	 */
	this._server = Game.getServer();
	
	/**
	 * Instanz der Datenbank.
	 *
	 * @property _db
	 * @type server.Database
	 * @private
	 */
	this._db = this._server.getDB();
	
	/**
	 * Liste mit allem Controllern, die mit im Spiel sind.
	 *
	 * @property _controller
	 * @type server.Controller
	 * @default []
	 * @private
	 */
	this._controller = [];
	
	/**
	 * Gibt an, in welchem Status das Spiel sich befindet. 
	 * 
	 * Es gibt folgende Möglichkeiten:
	 * * waiting
	 * * boarding
	 * * boarded
	 * * playing
	 * * ended
	 * * aborted
	 *
	 * @property _gameStatus
	 * @type String
	 * @default "boarding"
	 * @private
	 */
	this._gameStatus = "waiting"; 
	
	/**
	 * @property _profileAtStart
	 * @type Array
	 * @default []
	 * @private
	 */
	this._profileAtStart = [];
	
	/**
	 * Die maximale Anzahl an Profilen (Controllern), die im Spiel sein dürfen.
	 *
	 * @property _maxProfil
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._maxProfil = 0;
	
	/**
	 * Der Spieltyp.
	 *
	 * @property _SpielTyp
	 * @type server.SpielTyp
	 * @default null
	 * @private
	 */
	this._SpielTyp = null;
	
	/**
	 * Liste mit allen Objekten, die sich als Listener angemeldet haben.
	 *
	 * @property _eventListeners
	 * @type Array
	 * @default []
	 * @private
	 */
	this._eventListeners = [];
	
	/**
	 * Die ID des Profils(!), die das Spiel erstellt hat.
	 *
	 * @property _ersteller
	 * @type server.Profil
	 * @default null
	 * @private
	 */
	this._ersteller = null;
	
	/**
	 * Profile, die im Spiel sind. Sollte während des spielens syncron mit den
	 * den Controllern sein und danach geg. nicht mehr.
	 *
	 * @property _mitprofil
	 * @type Array(server.Profil)
	 * @default []
	 * @private
	 */
	this._mitprofil = [];
	
	/**
	 * Die Instanzen der Displays, die das Spiel verfolgen. 
	 *
	 * @property _displays
	 * @type Array(server.Display)
	 * @default []
	 * @private
	 */
	this._displays = [];
	
	/**
	 * 
	 *
	 * @property _active
	 * @type Boolean
	 * @default true
	 * @private
	 */
	this._active = true;
	
	/**
	 * Die Instanz, die von setInterval kommt, welche jeweils den Tick des Spieles aufruft.
	 *
	 * @property _interval 
	 * @type Interval
	 * @default null
	 * @private
	 */
	this._interval = null;
	
	/**
	 * Die Ticks Per Second.
	 *
	 * @property _tps
	 * @type Number
	 * @default 1000/60
	 * @private
	 */
	this._tps = 1000/60; // 1000/60
	
	/**
	 * Das Datum, wann das Spiel erstellt wurde.
	 *
	 * @property _gameCreateTime
	 * @type Date
	 * @default NOW
	 * @private
	 */
	this._gameCreateTime = new Date();
	
	/**
	 * Das Datum, wann das Spiel gestartet wurde.
	 *
	 * @property _gameStartTime
	 * @type Date
	 * @default null
	 * @private
	 */
	this._gameStartTime = null;
	
	/**
	 * Das Datum, wann das Spiel beendet wurde.
	 *
	 * @property _gameEndTime
	 * @type Date
	 * @default null
	 * @private
	 */
	this._gameEndTime = null;
	
	/**
	 * Instanz, des eigentliches Spieles nach Spieltyp.
	 *
	 * @property _gameinstance
	 * @type server.Games.AbstractGame
	 * @default null
	 * @private
	 */
	this._gameinstance = null;
	
	/**
	 * 
	 *
	 * @property _lastEmitData
	 * @type {JSON}
	 * @default null
	 * @private
	 */
	this._lastEmitData = null;
	
	/**
	 * Gibt an, ob die Events automatisch gefeuert werden oder nicht.
	 *
	 * @property _fireEvents
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._fireEvents = false;
	
	/**
	 *
	 * @property _chat
	 * @type server.Chat
	 * @default null
	 * @private
	 */
	this._chat = null;
	
	/**
	 *
	 * @property _colors
	 * @type {Array} of Arrays
	 * @default [...]
	 * @private
	 */
	this._colors = [
		[149, 171, 57 ],
		[242, 104, 53 ],
		[108, 106, 166],
		[242, 242, 242]
	];
	
	/**
	 *
	 * @property _playerColor
	 * @type {Map} of things and stuff
	 * @default {}
	 * @private
	 */
	this._playerColor = {};
	
	/**
	 *
	 * @property _statistics
	 * @type {Map} of things and stuff
	 * @default {}
	 * @private
	 */
	this._statistics = {};
	
	/**
	 *
	 * @property _statisticsForDb
	 * @type {String} 
	 * @default null
	 * @private
	 */
	this._statisticsForDb = null;
	
   		
	this.startBoarding();
}

/**
 * Erstellt ein Spiel in der Datenbank und gibt dessen Instanz per Callback zurück.
 *
 * @method create
 * @async
 * @param {Function} callback
 */
Game.create = function(callback){
	var sqlCreateSpiel = "INSERT INTO Spiel VALUES ();";
	
	Game.getServer().getDB().query(sqlCreateSpiel, [], function(err, result){
   		if(err){ throw err; }
   		
   		var game = new Game(result.insertId);
			
		if(callback)
			callback(game);
	}.bind(this));
};

/**
 * Löscht das Spiel aus der Datenbank und entfernt danach alle informationen aus diesem Objekt.
 *
 * @method delete
 * @async
 * @param {Function} callback
 */
Game.prototype.delete = function(callback){

	var id = this.getId();
	
	if(id===null){
		if(callback)
			callback(null);
		return false;
	}
	
	var sqlDeleteSpiel = "DELETE FROM Spiel WHERE SpielID = ?;";
	Game.getServer().getDB().query(sqlDeleteSpiel, [id], function(err, result){
   		if(err){ throw err; }
   		
   		this.destruct();
			
		if(callback)
			callback(id);
	}.bind(this));
};

/**
 * Setzt den Server.
 *
 * @method setServer
 * @chainable
 * @static
 * @param {server.Server} server
 */
Game.setServer = function(server){
	this._server = server;
	return this;
};

/**
 * Gibt den Server zurück 
 *
 * @method getServer
 * @static
 * @return {server.Server} 
 */
Game.getServer = function(){
	if(!this._server){
		throw new Error("Server nicht gesetzt. class Game");
	}
	return this._server;
};

/**
 * Gibt ein Spiel anhand der ID zurück
 * 
 * @method getGameById
 * @async
 * @static
 * @param {Number} id
 * @param {server.Server} server
 * @param {Function} callback
 */
Game.getGameById = function(id, server, callback){
	var r = new Game(id, server);
	r.load(callback);
};

/**
 * @method getAvailableColor
 *
 * @return {Array} 
 */
Game.prototype.getAvailableColor = function(){
	var a1,a2,nope,color;
	for(var i in this._colors){
		color = this._colors[i];
		nope = false;
		for(var j in this._playerColor){
			a1 = color;
			a2 = this._playerColor[j];
			if(a1 === a2){
				nope = true;
				break;
			}
		}
		if(!nope){
			return color;
		}
	}

	return null; // fehler..
}

/**
 * @method getColors
 *
 * @return {Array} 
 */
Game.prototype.getColors = function(){
	return this._colors;
}

/**
 * @method getTicksPerSecond
 * @return {Number} 
 */
Game.prototype.getTicksPerSecond = function(){
	return this._tps;
};

/**
 * Setzt die maximale Anzahl der Profile.
 *
 * @method setMaxProfil
 * @chainable
 * @param {Number} maxProfil
 */
Game.prototype.setMaxProfil = function(maxProfil){
	this._maxProfil = maxProfil;
	return this;
};

/**
 * Setzt den Spieltyp.
 *
 * @method setSpielType
 * @param {String} SpielTyp
 */
Game.prototype.setSpielType = function(SpielTyp){
	this._SpielTyp = SpielTyp;
};

/**
 * Macht noch nichts!
 *
 * @method save
 * @async
 * @param {Function} callback
 */ 
Game.prototype.save = function(callback){
	var sqlUpdateSpiel = " UPDATE Spiel SET "
					   + " MaxProfil = ?, "
					   + " Dauer = ?, " 
					   + " SpielTypID = ?, " 
					   + " ProfilID = ?, " 
					   + " Statistiken = ? " 
					   + " WHERE SpielID = ? "
					   + " LIMIT 1";
	
	// mitspieler + score
	var playerId;
	for (playerId in this._statistics.spieler){
		this.insertScore(playerId, this._statistics.spieler[playerId].punkte, callback);
	}
	
	var gameData = [this.getMaxProfil(),this.getDuration()/1000,this.getSpielTyp().getId(),this.getErstellerId(),this._statisticsForDb,this.getId()];

	this._db.query(sqlUpdateSpiel, [gameData], function(err, result){
   		if(err){
   			console.log(err);
			if(callback){ callback(null); }
			return;
   		}
		
		if(callback){
			if(callback){ callback(this); }
		}
		
	}.bind(this));
};

/**
 * @method insertScore
 * @param {Number} playerId
 * @param {Function} callback
 */
Game.prototype.insertScore = function(playerId, punkte, callback){
	var sqlInsertScore = "INSERT INTO Score SET ProfilID = ?, SpielID = ?, Punkte = ?, GesetzteBloecke = ?, Tastenanschlaege = ?;";
	var sqlInsertProfil_Spiel = "INSERT INTO Profil_Spielt_Spiel SET ProfilID = ?, SpielID = ?;";
	
	this._db.query(sqlInsertScore, [parseInt(playerId), this.getId(), punkte, 0, 0], function(err, result){
   		if(err){
   			console.log(err);
			if(callback){ callback(null); }
			return;
   		}
		if(callback){
			if(callback){ callback(this); }
		}
	}.bind(this));	

	this._db.query(sqlInsertProfil_Spiel, [parseInt(playerId), this.getId()], function(err, result){
		if(err){   			
			console.log(err);
			if(callback){ callback(null); }
			return;
   		}
		
		if(callback){
			if(callback){ callback(this); }
		}

	}.bind(this));	
};

/**
 * Holt sich aus der Datenbank die Spieldaten.
 *
 * @method load
 * @async
 * @param {Function} callback
 */	
Game.prototype.load = function(callback){
	var sqlGame = "" 
				+ " SELECT Spiel.* " 
				+ " FROM Spiel " 
				+ " WHERE SpielID = ? "; 
	
	this._db.query(sqlGame, [this.getId()], function(err, result){
   		if(err){ throw err; }
   		if(result[0] === undefined){ throw new Error("result[0] ist undefined!"); }
   		
	   	var row = result[0];
	   	this._maxProfil = row.MaxProfil;
	   	this._dauer = row.Dauer;
	   	this._ersteller = this._server.getProfilById(row.ProfilID);
	   	this._SpielTyp = row.SpielTyp;
	   	this._statisticsForDb = row.Statistiken;
	   	this.setGameStatus("ended"); // wird geladen.. muss also schon beendet sein.
		this._broadcastEvent("SpielChange"); 
	
		if(callback){ callback(this); }
	}.bind(this));
};

/**
 * Wird das Spiel von einen Display verfolgt?
 *
 * @method hasDisplay
 * @param {server.Display} display
 * @return {Boolean}
 */
Game.prototype.hasDisplay = function(display){
	var i;
	for(i in this._displays){
		if(display === this._displays[i]){
			return true;
		}
	}
	return false;
};

/**
 * Fügt ein Display, das das Spiel verfolgen, hinzu.
 *
 * @method addDisplay
 * @param {server.Display} display
 * @return {Boolean}
 */
Game.prototype.addDisplay = function(display){
	if(this.hasDisplay(display)){
		return false;
	}
	
	this._displays.push(display);
	
	if(this.getGameStatus() === "playing"){
		display.emitToDisplay("SpielStarts", this.getEmitData());
		display.emitToDisplay("SpielPlatzierung", this._gameinstance.getEmitData().spieler);
		//
	}
	if(this.getGameStatus() === "ended"){
		display.emitToDisplay("SpielEnds", this._getDataForSpielEnds());	
	}
	
	return true;
};

/**
 * Entfernt ein Display, das das Spiel verfolgen.
 *
 * @method removeDisplay
 * @param {server.Display} display
 */
Game.prototype.removeDisplay = function(display){
	this._displays = Util.delArray(this._displays, display);
};

/**
 * 
 *
 * @method _getDataForSpielEnds
 * @private
 * @return JSON
 */
Game.prototype._getDataForSpielEnds = function(){
	var data = {};
	if(this._statisticsForDb===null){
		if(this._lastEmitData === null){
			return null;
		}
		data.spieler = this._lastEmitData.spieler;
		data.statistics = this._statistics;
		this._statisticsForDb = JSON.stringify(data);
	}else{
		data = JSON.parse(this._statisticsForDb);
	}
	return data;
};

/**
 * Gibt zurück, ob das Spiel gerade läuft.
 *
 * @method isRunning
 * @return {Boolean}
 */
Game.prototype.isRunning = function(){
	return this.getGameStatus() === "playing" || this.getGameStatus() === "boarding" || this.getGameStatus() === "boarded";
};


/**
 * Ein neuer Spieler ist dem Spiel beigetreten.
 *
 * @method addMitprofil
 * @param {server.Profil} profil
 * @param {boolean} force
 * @return {Boolean}
 */
Game.prototype.addMitprofil = function(profil, force){
	if(this.getGameStatus()!=="boarding" && force !== true){
		return false;
	}

	if(this._mitprofil.length>=this._maxProfil){
		return false;
	}
	
	if(this.hasMitprofil(profil)){
		return false;
	}
	
	profil.setLoggedInGame(this);
	
	this._mitprofil.push(profil);
	
	this._playerColor[profil.getId()] = this.getAvailableColor();
	
	
	if(this._mitprofil.length>=this._maxProfil){
		this.setGameStatus("boarded");
	}
	
	this._broadcastEvent("SpielChange"); 
	
	profil.setChat(this._chat);
	this._chat.write(null, profil.getName()+" has joined the Game.");
	
				
	this.emitToDisplays("SpielSpielerAdd", {
		ProfilID: profil.getId(),
		Name: profil.getName(),
		color: this._playerColor[profil.getId()]
	});
	
	return true;
};

/**
 * Ein Spieler hat das Spiel verlassen.
 *
 * @method removeMitprofil
 * @param {server.Profil} profil
 * @return {Boolean}
 */
Game.prototype.removeMitprofil = function(profil){
	var ersteller = false;
	if(this.getErstellerId() === profil.getId()){
		ersteller = true;
	}
	
	delete this._playerColor[profil.getId()];
	this._mitprofil = Util.delArray(this._mitprofil, profil);
	
	// leite weiter an das konkrete Spiel
	if(this._gameinstance && this._gameinstance.removeMitprofil)
		this._gameinstance.removeMitprofil(profil);
	
	if(this._mitprofil.length<this._maxProfil){
		if(this.getGameStatus()==="boarded")
			this.setGameStatus("boarding");
	}
	
	profil.setLoggedInGame(null);
	this._broadcastEvent("SpielChange"); 
	
	if(this._mitprofil.length===0){
		if(this.getGameStatus()!=="playing" && this.getGameStatus()!=="ended"){
			this.setGameStatus("aborted");
			this.abortGame();
			this._broadcastEvent("SpielNoPlayers"); // für den Server, entferne das Spiel.. doof gelöst..
		}else{
			this.setGameStatus("ended");
		}
	}
	
	profil.unsetChat();
	this._chat.write(null, profil.getName()+" has left the Game.");
	
	this.emitToDisplays("SpielSpielerRemove", profil.getEmitData());
				
	return ersteller;
};

/**
 * Überprüft, ob profil in dem Spiel mitspielt.
 *
 * @method hasMitprofil
 * @param {server.Profil} profil
 * @return {Boolean}
 */
Game.prototype.hasMitprofil = function(profil){
	var i;
	for(i in this._mitprofil){
		if(profil === this._mitprofil[i]){
			return true;
		}
	}
	return false;
};

/**
 * Gibt die Liste der, im Spiel befindlichen, Profile zurück.
 *
 * @method getMitprofil
 * @return {server.Profil}
 */
Game.prototype.getMitprofil = function(){
	return this._mitprofil;
};

/**
 * Setzt den Ersteller des Spiels
 *
 * @method setErsteller
 * @param {server.Profil} profil
 */
Game.prototype.setErsteller = function(profil){
	this._ersteller = profil;
	this._broadcastEvent("SpielChange");
	return this; 
};

/**
 * Gibt den Ersteller zurück.
 *
 * @method getErsteller
 * @return {server.Profil}
 */
Game.prototype.getErsteller = function(){
	return this._ersteller;
};

/**
 * Gibt den Names des Erstellers zurück
 *
 * @method getErstellerName
 * @return {String}
 */
Game.prototype.getErstellerName = function(){
	if(this._ersteller === null){ return null; }
	return this._ersteller.getName();
};

/**
 * Gibt die ID des Erstellers zurück
 *
 * @method getErstellerId
 * @return {Number}
 */
Game.prototype.getErstellerId = function(){
	if(this._ersteller === null){ return null; }
	return this._ersteller.getId();
}

/**
 * Gibt die Dauer des Spieles zurück
 *
 * @method getDuration
 * @return {Float} millisecends 
 */
Game.prototype.getDuration = function(){
	var end = this._gameEndTime;
	if(end === null){
		end = new Date();
	}

	return (end - this._gameStartTime);
};

/**
 * Gibt die ID des Spieles zurück
 *
 * @method getId
 * @return {Number}
 */
Game.prototype.getId = function(){
	return this._SpielID;
};

/**
 * Gibt den Spielstatus zurück
 *
 * @method getGameStatus
 * @return {String}
 */
Game.prototype.getGameStatus = function(){
	return this._gameStatus;
};

/**
 * Setzt den Status des Spieles
 *
 * @method setGameStatus
 * @param {String} status
 */
Game.prototype.setGameStatus = function(status){
	switch(status){
		case "waiting":
		case "boarding":
		case "boarded":
		case "countdown":
		case "playing":
		case "ended":
		case "aborted":
			break;
		default:
			throw new Error("invalid status for Game");
	}
	this._gameStatus = status;
	this._broadcastEvent("SpielChange"); 
	return this;
};

/**
 * Setzt den Status des Spieles auf 'boarding'
 *
 * @method startBoarding
 */
Game.prototype.startBoarding = function(){
	this.setGameStatus("boarding");
	this._chat = new Chat(this);
};

/**
 * Gibt die maximale Anzahl von Profilen zurück, die im Spiel sein dürften
 *
 * @method getMaxProfil
 *
 * @return {Number}
 */
Game.prototype.getMaxProfil = function(){
	return this._maxProfil;
};

/**
 * @method setMaxProfil
 * @param {Number} n
 */
Game.prototype.setMaxProfil = function(n){
	if(n > CONFIG.maxProfil){
		throw new Error("n > CONFIG.maxProfil");
	}
	this._maxProfil = n;
	this._broadcastEvent("SpielChange"); 
	return this;
};

/**
 * @method emitToControllers
 * @param {String} eventName
 * @param {JSON} obj
 */
Game.prototype.emitToControllers = function(eventName, obj){
	var profil, controller, i;
	for(i in this._mitprofil){
		profil = this._mitprofil[i];
		if(profil.hasController()){
			controller = profil.getController();
			controller.emitToController(eventName, obj);
		}
	}
};

/**
 * @method emitToDisplays
 * @param {String} eventName
 * @param {JSON} obj
 */
Game.prototype.emitToDisplays = function(eventName, obj){
	var display, controller, i;
	for(i in this._displays){
		display = this._displays[i];
		display.emitToDisplay(eventName, obj);
	}
};

/**
 * Gibt die Klasse des SpielTyps zurück
 *
 * @method getSpielTypClass
 * @return {String}
 */
Game.prototype.getSpielTypClass = function(){
	return this.getSpielTyp().getClass();
};

/**
 * Erstellt eine Instanz der SpielTyp Klasse
 *
 * @method createGameInstance
 * @return {server.Games.SpielAufZeit.SpielAufZeit}
 */
Game.prototype.createGameInstance = function(){
	switch(this.getSpielTypClass()){
		case "SpielAufZeit":
			return new SpielAufZeit(this);
		default:
			throw new Error("Ungültige SpielTyp-Klasse.");
	}
};

/**
 * Started das Spiel
 *
 * @method startGame
 * @return {Boolean}
 */
Game.prototype.startGame = function(){
	var i, ok = false, j;
	
	switch(this.getGameStatus()){
		case "waiting":
		case "boarding":
		case "boarded":
			ok = true;
	}
	
	if(!ok) return false;
	
	this._gameinstance = this.createGameInstance();
	
	j = 0;
	for(i in this._mitprofil){
		this._gameinstance.addMitspieler(this._mitprofil[i], this._playerColor[this._mitprofil[i].getId()]);
		
		this._profileAtStart.push(this._mitprofil[i]); // welche Profile waren bei start des Spieles bei?
		
		this._mitprofil[i].addEventListener(this); 
		
		j++;
	}
	
	this._gameinstance.init();
	
	this.setGameStatus("countdown");
	this.emitToControllers("SpielCountdown", CONFIG.gameStartWaitTimer);
	this.emitToDisplays   ("SpielCountdown", CONFIG.gameStartWaitTimer);
	
	setTimeout(function(){
		this.interval = setInterval(function(){
			this.tick();
		}.bind(this), this._tps);
		
		this._gameStartTime = new Date();
		
		this.setGameStatus("playing");
		this.emitToControllers("SpielStarts", this.getEmitData());
		this.emitToDisplays   ("SpielStarts", this.getEmitData());
	}.bind(this), CONFIG.gameStartWaitTimer);
	
	this._chat.write(null, this.getErstellerName()+" starts the Game.");
	
	return true;
};

/**
 * Zum Abgreifen der Event vom Profil (oder anderen).
 *
 * @method receiveEvent
 * @param {String} eventName
 * @param {JSON} obj
 */
Game.prototype.receiveEvent = function(eventName, obj){
	if(eventName === "ProfilButton"){
		if(this._gameStatus === "playing"){
			this._gameinstance.button(obj.type, obj.key, obj.profil);
		}
	}
};

/**
 * Sobald der Ersteller das Spiel verlässt, wird das Spiel abgebrochen.
 *
 * @method abortGame
 */
Game.prototype.abortGame = function(){

	clearInterval(this.interval);
	
	this.setGameStatus("aborted"); 
	this.emitToDisplays("SpielAborted", this.getEmitData());
	this.emitToControllers("SpielAborted", this.getEmitData());
	
	
	for(var i in this._mitprofil){
		this._mitprofil[i].removeEventListener(this);
	}
	
	delete this._gameinstance;
	
	// this.save(); nothing to save
	this._gameinstance = null;
	this.delete();
};

/**
 * Spiel wurde normal zu ende geführt.
 *
 * @method endGame
 */
Game.prototype.endGame = function(){
	
	clearInterval(this.interval);
	
	for(var i in this._mitprofil){
		this._mitprofil[i].removeEventListener(this);
	}
	this._mitprofil = null;
	
	this._gameEndTime = new Date();
	this.setGameStatus("ended"); 
	
	this._statistics = this._gameinstance.getStatistics();
	this._lastEmitData = this._gameinstance.getEmitData();
	this.emitToDisplays("SpielEnds", this._getDataForSpielEnds());
	
	this.save();
	
	delete this._gameinstance;
	this._gameinstance = null;
};

/**
 * Magic
 *
 * @method tick
 */
Game.prototype.tick = function(){
	this._gameinstance.tick();
};

/**
 * @method setSpielTyp
 * @param {String} SpielTyp
 */
Game.prototype.setSpielTyp = function(SpielTyp){
	this._SpielTyp = SpielTyp;
};

/**
 * Gibt den Typ des Spieles zurück
 *
 * @method getSpielTyp
 * @return {String} 
 */
Game.prototype.getSpielTyp = function(){
	return this._SpielTyp;
};

/**
 * @method destruct
 */
Game.prototype.destruct = function(){
	//this.abortGame(); KEIN abort... das macht keinen sinn...
	this._eventListeners = null;
	this._mitprofil = null;
	this._SpielID = null;
};

/**
 * Fügt einen EventListener hinzu
 *
 * @method addEventListener
 * @param {Object} listener
 */
Game.prototype.addEventListener = function(listener){
	this._eventListeners.push(listener);
};

/**
 * Entfernt einen Listener.
 *
 * @method removeEventListener
 * @param {Object} listener zu entfernender Listener.
 * @return {Boolean} Gibt true bei Erfolg wieder.
 */
Game.prototype.removeEventListener = function(listener){
	var oldL = this._eventListeners.length;
	this._eventListeners = Util.delArray(this._eventListeners, listener);
	return (oldL != this._eventListeners.length)
};

/**
 * Stoppt Events
 *
 * @method stopEvents
 */
Game.prototype.stopEvents = function(){
	this._fireEvents = false;
};

/**
 * Startet Events
 *
 * @method startEvents
 * @param {boolean} emitNow
 */
Game.prototype.startEvents = function(emitNow){
	this._fireEvents = true;
	if(emitNow){
		this._broadcastEvent("SpielChange");
	} 
};

/**
 * @method _broadcastEvent
 * @private
 * @param {String} eventName
 * @param {Boolean} force
 */
Game.prototype._broadcastEvent = function(eventName, force){
	if(!this._fireEvents && !force){
		return;
	}
	var i, listener;
	for(i in this._eventListeners){
		listener = this._eventListeners[i];
		listener.receiveEvent(eventName, this);
	}
};

/**
 * Gibt die Eigenschaften des Spieles als JSON Objekt zurück
 *
 * @method getEmitData
 * @return {JSON}
 */
Game.prototype.getEmitData = function(){
	var i;
	var o = {};
	o.SpielID = this.getId();
	o.GameStatus = this.getGameStatus();
	o.MaxProfil = this.getMaxProfil();
	o.ErstellerName = this.getErstellerName();
	o.ErstellerId = this.getErstellerId();
	o.GameStatus = this._gameStatus;
	o.MitProfil = [];
	o.colors = this.getColors();
	
	if(this.getSpielTyp()){
		o.SpielTyp = this.getSpielTyp().getEmitData();
	}else{
		o.SpielTyp = null;
	}
	
	if(this._gameStatus=="ended"){
		for(i in this._profileAtStart){
			o.MitProfil.push({
				ProfilID: this._profileAtStart[i].getId(),
				Name: this._profileAtStart[i].getName(),
				color: [null,null,null]
			});
		}
	}else{
		for(i in this._mitprofil){
			o.MitProfil.push({
				ProfilID: this._mitprofil[i].getId(),
				Name: this._mitprofil[i].getName(),
				color: this._playerColor[this._mitprofil[i].getId()]
			});
		}
	}
	
	if(this._gameinstance !== null){
		o.details = this._gameinstance.getEmitData();
	}
	
	return o;
};

exports.Game = Game;