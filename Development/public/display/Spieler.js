'use strict';

/**
 * @module display
 * @namespace display
 *
 * @class Spieler
 * @constructor
 *
 * @param {Number} id
 */
function Spieler(id){
	/**
	 * Die Position des Cursors, indem sich die Objekte des Spielers befinden. 
	 * [x,y], wobei x,y element aus N
	 *
	 * @property _cursor
	 * @type Array
	 * @default [0,0]
	 * @private
	 */
	this._cursor = [0,0];
	
	/**
	 * Farbwert des Spielers und dessen Steine. 
	 * [r,g,b] wobei r,g,b element aus N mit n zwischen 0 und 255 inklusive.
	 *
	 * @property _color
	 * @type Array
	 * @default [0,0,0]
	 * @private
	 */
	this._color = [0, 0, 0];
	
	/**
	 * Die ID des Spielers, die auch gleich der Profil-ID ist.
	 *
	 * @property _id
	 * @type Number
	 * @private
	 */
	this._id = id;
	
	/**
	 * 
	 *
	 * @property _name
	 * @type String
	 * @private
	 */
	this._name = null;
	
	/**
	 * 
	 *
	 * @property _punkte
	 * @type Number
	 * @private
	 */
	this._punkte = null;
	
	/**
	 * 
	 *
	 * @property _level
	 * @type Number
	 * @private
	 */
	this._level = null;
	
	/**
	 * 
	 *
	 * @property _lines
	 * @type Number
	 * @private
	 */
	this._lines = null;
	
	/**
	 * 
	 *
	 * @property _platz
	 * @type Number
	 * @private
	 */
	this._platz = null;
	
	/**
	 * 
	 *
	 * @property _raus
	 * @type Boolean
	 * @private
	 */
	this._raus = false;
}

/**
 * @method isRaus
 *
 * @return {Boolean} 
 */
Spieler.prototype.isRaus = function(){
	return !!this._raus;
};

/**
 * @method setRaus
 *
 * @param {Boolean} raus
 */
Spieler.prototype.setRaus = function(raus){
	this._raus = raus;
};

/**
 * @method getPlatz
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
 * @method setName
 *
 * @param {String} name
 */
Spieler.prototype.setName = function(name){
	this._name = name;
};

/**
 * @method setPunkte
 *
 * @param {Number} punkte
 */
Spieler.prototype.setPunkte = function(punkte){
	this._punkte = punkte;	
};

/**
 * @method getName
 *
 * @return {String}
 */
Spieler.prototype.getName = function(){
	return this._name;
};

/**
 * @method getPunkte
 *
 * @return {Number}
 */
Spieler.prototype.getPunkte = function(){
	return this._punkte;	
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
 * @method setLevel
 *
 * @param {Number} level
 */
Spieler.prototype.setLevel = function(level){
	this._level = level;
};

/**
 * @method setLevel
 *
 * @param {Number} level
 */
Spieler.prototype.getLines = function(){
	return this._lines;
};

/**
 * @method setLevel
 *
 * @param {Number} level
 */
Spieler.prototype.setLines = function(lines){
	this._lines = lines;
};

/**
 * @method getId
 *
 * @return {Number}
 */
Spieler.prototype.getId = function(){
	return this._id;
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
 * @method getCursor
 *
 * @return {Array}
 */
Spieler.prototype.getCursor = function(){
	return this._cursor;
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