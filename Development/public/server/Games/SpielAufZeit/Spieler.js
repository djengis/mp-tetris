'use strict';

var BUTTON = require('./../../../global/enum_controller_buttons.js').BUTTON;
var BUTTONTYPE = require('./../../../global/enum_controller_buttons.js').BUTTONTYPE;
var Util = require('./../../../global/Util.js').Util;
var CONFIG = require('./../../../global/config.js').CONFIG;
var Profil = require('../../Profil.js').Profil;
var Block = require('./Block.js').Block;
var Blockelement = require('./Blockelement.js').Blockelement;

/**
 * @module server
 * @namespace server.games.SpielAufZeit
 *
 * @class Spieler
 * @constructor
 *
 * @param {server.Games.Spielaufzeit.SpielAufZeit} gameinstance
 * @param {server.Controller} controller
 */
function Spieler(gameinstance, controller){
	
	/**
	 * @property _gameinstance
	 * @type server.Games.Spielaufzeit.SpielAufZeit
	 * @private
	 */
	this._gameinstance = gameinstance;
	
	/**
	 * @property _controller
	 * @type server.Controller
	 * @private
	 */
	this._controller = controller;
	
	/**
	 * @property _controller
	 * @type server.Controller
	 * @private
	 */
	this._profil = controller.getProfil();
	
	/**
	 * @property _cursor
	 * @type Array
	 * @default [0, 0]
	 * @private
	 */
	this._cursor = [0, 0];
	
	/**
	 * @property _color
	 * @type Array
	 * @default [0, 0, 0]
	 * @private
	 */
	this._color = [0, 0, 0];
	
	/**
	 * @property _active
	 * @type Boolean
	 * @default true
	 * @private
	 */
	this._active = true;
	
	/**
	 * @property _punkte
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._punkte = 0;
	
	/**
	 * @property _level
	 * @type Number
	 * @default 1
	 * @private
	 */
	this._level = 1;
	
	/**
	 * @property _lines
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._lines = 0;
	
	/**
	 * @property _platz
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._platz = 0;
	
	/**
	 * @property _elementNow
	 * @type server.Games.SpielAufZeit.Blockelement
	 * @private
	 */
	this._elementNow = null;
	
	/**
	 * @property _elementNext
	 * @type server.games.SpielAufZeit.Blockelement
	 * @private
	 */
	this._elementNext = null;
	
	/**
	 * @property _tick
	 * @type Number
	 * @default CONFIG.Games.SpielAufZeit.startTick
	 * @private
	 */
	this._tickTime = CONFIG.Games.SpielAufZeit.levelTicks[0];
	
	/**
	 * @property _tick
	 * @type Number
	 * @default this._tickTime
	 * @private
	 */
	this._tick = this._tickTime;
	
	/**
	 * @property _out
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._out = false;
		
	/**
	 * @property _out
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._dieTime = null;
		
	/**
	 * @property _deleted
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._deleted = false;
		
	/*
	 */
	this._init();
}

/**
 * @method compute
 * @return {boolean}
 */
Spieler.prototype.compute = function(){
	return !this._deleted;
};

/**
 * @method del
 */
Spieler.prototype.del = function(){
	this._deleted = true;
};

/**
 * @method _init
 * @private
 */
Spieler.prototype._init = function(){
	this.nextElement();
	this.nextElement();
};

/**
 * @method setPlatz
 *
 * @return {Number} platz
 */
Spieler.prototype.setPlatz = function(platz){
	this._platz = platz;
};

/**
 * @method getPlatz
 *
 * @return {Number}
 */
Spieler.prototype.getPlatz = function(){
	return this._platz;
};

/**
 * @method getTickTime
 *
 * @return {Number} 
 */
Spieler.prototype.getTickTime = function(){
	return this._tickTime;
};

/**
 * @method setTickTime
 *
 * @param {Number} n
 */
Spieler.prototype.setTickTime = function(n){
	this._tickTime = n;
};

/**
 * @method emitToController
 *
 * @param {String} event
 * @param {JSON} obj
 */
Spieler.prototype.emitToController = function(event, obj){
	this.getController().emitToController(event, obj);
};

/**
 * @method ticker
 *
 * @param {Number} [c=this.getTickTime()]
 * @param {Boolean} [force=false]
 */
Spieler.prototype.ticker = function(c, force){
	if(c === undefined) c = this.getTickTime();
	if(force===undefined) force = false;
	this._tick--;
	if(this._tick<=0 || force){
		this._tick = c;
		return true;
	}
	return false;
};

/**
 * @method getController
 *
 * @return {server.Controller}
 */
Spieler.prototype.getController = function(){
	return this._controller;
};

/**
 * @method getProfil
 *
 * @return {server.Profil}
 */
Spieler.prototype.getProfil = function(){
	return this._profil;
};

/**
 * @method nextElement
 */
Spieler.prototype.nextElement = function(){
	var es = Util.arraySchuffle(Blockelement.availableElements());
	this._elementNow = this._elementNext;
	this._elementNext = new Blockelement(this, es[0]);
};

/**
 * @method getBlockelement
 *
 * @return {server.Games.SpielAufZeit.Blockelement}
 */
Spieler.prototype.getBlockelement = function(){
	return this._elementNow;
};

/**
 * @method getNextBlockelement
 *
 * @return {server.Games.SpielAufZeit.Blockelement}
 */
Spieler.prototype.getNextBlockelement = function(){
	return this._elementNext;
};

/**
 * @method setPunkte
 *
 * @param {Number} p
 */
Spieler.prototype.setPunkte = function(p){
	this._punkte = p;
};

/**
 * @method addPunkte
 *
 * @param {Number} p
 */
Spieler.prototype.addPunkte = function(p){
	this._punkte += p;
	if(this._punkte<0){
		this._punkte=0;
	}
};

/**
 * @method addLines
 *
 * @param {Number} n
 */
Spieler.prototype.addLines = function(n){
	this._lines += n;
};

/**
 * @method setLines
 *
 * @param {Number} n
 */
Spieler.prototype.setLines = function(n){
	this._lines = n;
};

/**
 * @method getLines
 *
 * @return {Number}
 */
Spieler.prototype.getLines = function(){
	return this._lines;
};

/**
 * @method addLevel
 *
 * @param {Number} n
 */
Spieler.prototype.addLevel = function(n){
	this.setLevel(this.getLevel()+n);
};


/**
 * @method setLevel
 *
 * @param {Number} n
 */
Spieler.prototype.setLevel = function(n){
	this._level = n;
	
	var i = 1;
	
	if(n < CONFIG.Games.SpielAufZeit.levelTicks.length){
		i = CONFIG.Games.SpielAufZeit.levelTicks[n];
	}
	
	this.setTickTime(i);
};

/**
 * @method getLevel
 *
 * @return {Number}
 */
Spieler.prototype.getLevel = function(){
	return this._level;
};

/**
 * @method getPunkte
 *
 * @return {Number}
 *
 */
Spieler.prototype.getPunkte = function(){
	return this._punkte;
};

/**
 * Gibt die id, WELCHE GLEICH DER PROFIL-ID IST, wieder.
 *
 * @method getId 
 *
 * @return {Number}
 */
Spieler.prototype.getId = function(){
	if(this._controller === null) return null;
	if(this._controller.getProfil() === null) return null;
	
	return this._controller.getProfil().getId();
};

/**
 * @method setColor
 *
 * @param {Array} color
 */
Spieler.prototype.setColor = function(color){
	this._color = color;
};

/**
 * @method getColor 
 *
 * @return {Array}
 */
Spieler.prototype.getColor = function(){
	return this._color;
};

/**
 * @method isActive
 *
 * @return {Boolean}
 */
Spieler.prototype.isActive = function(){
	return this._active;
};

/**
 * @method isDeath
 * @return {Boolean}
 */
Spieler.prototype.isDeath = function(){
	return !this.isActive();
};

/**
 * @method setActive
 *
 * @param {Boolean} b
 */
Spieler.prototype.setActive = function(b){
	this._active = b;
};

/**
 * @method setCursor
 * 
 * @param {Array} xy
 */
Spieler.prototype.setCursor = function(xy){
	this._cursor = xy;
};

/**
 * @method die
 */
Spieler.prototype.die = function(){
	this.setActive(false);
	this._dieTime = new Date();
};

/**
 * @method setCursorX
 *
 * @param {Number} x
 */
Spieler.prototype.setCursorX = function(x){
	this._cursor[0] = x;
};

/**
 * @method setCursorY
 *
 * @param {Number} y
 */
Spieler.prototype.setCursorY = function(y){
	this._cursor[1] = y;
};

/**
 * @method getCursor
 *
 * @return {Array}
 */
Spieler.prototype.getCursor = function(){
	return this._cursor;
};

/**
 * @method getCursorX
 *
 * @return {Number}
 */
Spieler.prototype.getCursorX = function(){
	return this._cursor[0];
};

/**
 * @method getCursorY
 *
 * @return {Number}
 */
Spieler.prototype.getCursorY = function(){
	return this._cursor[1];
};

/**
 * @method decrementCursorX
 *
 * @return {Number}
 */
Spieler.prototype.decrementCursorX = function(){
	return this._cursor[0]--;
};

/**
 * @method decrementCursorY
 *
 * @return {Number}
 */
Spieler.prototype.decrementCursorY = function(){
	return this._cursor[1]--;
};

/**
 * @method incrementCursorX
 *
 * @return {Number}
 */
Spieler.prototype.incrementCursorX = function(){
	return this._cursor[0]++;
};

/**
 * @method incrementCursorY
 *
 * @return {Number}
 */
Spieler.prototype.incrementCursorY = function(){
	return this._cursor[1]++;
};

/**
 * @method getEmitData
 *
 * @return {JSON}
 */
Spieler.prototype.getEmitData = function(){
	var spieler = {};
	spieler.cursor = this.getCursor();
	spieler.id = this.getId();
	spieler.color = this.getColor();
	spieler.element = this._elementNow.getType();
	spieler.punkte = this.getPunkte();
	spieler.name = this.getProfil().getName();
	spieler.active = this._active;
	spieler.platz = this._platz;
	spieler.level = this.getLevel();
	spieler.lines = this.getLines();
	
	return spieler;
};

exports.Spieler = Spieler;