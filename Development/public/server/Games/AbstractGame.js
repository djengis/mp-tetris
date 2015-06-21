'use strict';

/**
 * @module server
 * @namespace server.games
 *
 * @class AbstractGame
 * @constructor
 *
 * @param {server.Game} game
 */
function AbstractGame(game){
	/**
	 * @property _game
	 * @type server.Game
	 * @private
	 */
	this._game = game;
	
	/**
	 * @property _spieler
	 * @type Array
	 * @default []
	 * @private
	 */
	this._spieler = [];
	
	/**
	 * @property _statistics
	 * @type JSON
	 * @default {...}
	 * @private
	 */
	 this._statistics = {};
	 this._statistics.spieler = {};
}

/**
  * @method init
  */
AbstractGame.prototype.init = /*abstract*/ function(){
	throw new Error("AbstractGame.prototype.init()");
};

/**
  * @method tick
  */	
AbstractGame.prototype.tick = /*abstract*/ function(){
	throw new Error("AbstractGame.prototype.tick()");
};

/**
 * @method button
 *
 * @param {global.BUTTONTYPE} type
 * @param {global.BUTTON} key
 * @param {server.Profil} profil
 */
AbstractGame.prototype.button = /*abstract*/ function(type, key, player){
	throw new Error("AbstractGame.prototype.button()");
};

/**
  * @method getStatistics
  * @return {JSON}
  */
AbstractGame.prototype.getStatistics = function(){
	return this._statistics;
};

/**
 * @method addMitspieler
 *
 * @param {server.Profil} profil
 * @param {Array} color
 */
AbstractGame.prototype.addMitspieler = function(profil, color){
	throw new Error("AbstractGame.prototype.addMitspieler()");
};

/**
 * @method getMitspieler
 * @return {Array} of server.Profil
 */
AbstractGame.prototype.getMitspieler = function(){
	return this._game.getMitprofil();
};

/**
 * @method removeMitprofil
 * @param {server.Profil} profil
 */
AbstractGame.prototype.removeMitprofil = function(profil){
	// NICHT entfernen
	for(var i in this._spieler){
		if((this._spieler[i].getId() == profil.getId())){
			this._spieler[i].del();
			return true;
		}
	}
};

/**
 * @method getAnzahlMitspieler
 * @return {Number}
 */
AbstractGame.prototype.getAnzahlMitspieler = function(){
	return 	this._game.getMitprofil().length;
};

/**
 * @method emitToDisplays
 *
 * @param {String} type
 * @param {JSON} data
 */
AbstractGame.prototype.emitToDisplays = function(type, data){
	this._game.emitToDisplays(type, data);
};

/**
 * @method emitToControllers
 *
 * @param {String} type
 * @param {JSON} data
 */
AbstractGame.prototype.emitToControllers = function(type, data){
	this._game.emitToControllers(type, data);
};


exports.AbstractGame = AbstractGame;