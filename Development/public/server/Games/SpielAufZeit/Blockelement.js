'use strict';
var Util = require('./../../../global/Util.js').Util;

/**
 * @module server
 * @namespace server.games.SpielAufZeit
 *
 * @class Blockelement
 * @constructor
 *
 * @param {Spieler} spieler 
 * @param {String} type
 */
function Blockelement(spieler, type){	
	/**
	 * @property _spieler
	 * @type server.Games.SpielAufZeit.Spieler
	 * @private
	 */
	this._spieler = spieler;
	
	/**
	 * @property _ownField
	 * @type Array
	 * @default []
	 * @private
	 */
	this._ownField = [];
	
	/**
	 * @property _type
	 * @type String
	 * @private
	 */
	this._type = null;
	this.setType(type);
}


/**
 * @method availableElements
 *
 * @return {String}
 */
Blockelement.availableElements = function(){
	return ["St", "EL", "EL2", "TE", "BO", "ES", "ES2"];
}

/**
 * @method getOwnField
 *
 * @return {Array}
 */
Blockelement.prototype.getOwnField = function(){
	return this._ownField;
}

/**
 * @method getType
 *
 * @return {String}
 */
Blockelement.prototype.getType = function(){
	return this._type;
};

/**
 * @method setType
 *
 * @param {String} type
 */
Blockelement.prototype.setType = function(type){
	switch(type){
		case "St":
			this._ownField = [
				[0,1,0,0],
				[0,1,0,0],
				[0,1,0,0],
				[0,1,0,0]
			];
			this._type = type;
			break;
		case "EL":
			this._ownField = [
				[0,1,0],
				[0,1,0],
				[0,1,1]
			];
			this._type = type;
			break;
		case "EL2":
			this._ownField = [
				[0,1,0],
				[0,1,0],
				[1,1,0]
			];
			this._type = type;
			break;
		case "TE":
			this._ownField = [
				[0,1,0],
				[1,1,1],
				[0,0,0]
			];
			this._type = type;
			break;
		case "BO":
			this._ownField = [
				[1,1],
				[1,1]
			];
			this._type = type;
			break;
		case "ES":
			this._ownField = [
				[0,1,1],
				[1,1,0],
				[0,0,0]
			];
			this._type = type;
			break;
		case "ES2":
			this._ownField = [
				[1,1,0],
				[0,1,1],
				[0,0,0]
			];
			this._type = type;
			break;
	}	
};

/**
 * Rotiert um 90 grad nach Links.
 *
 * @method rotateLeft
 */
Blockelement.prototype.rotateLeft = function(){
	this._ownField = Util.dreheArray(this._ownField);
};

/**
 * Rotiert um 90 grad nach Rechts.
 *
 * @method rotateRight
 */
Blockelement.prototype.rotateRight = function(){
	// wöhööhöh. warum? weil ichs kann! und faul bin ;)
	this.rotateLeft();
	this.rotateLeft();
	this.rotateLeft();
};


exports.Blockelement = Blockelement;