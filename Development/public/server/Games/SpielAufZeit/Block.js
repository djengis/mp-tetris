'use strict';

/**
 * @module server
 * @namespace server.games.SpielAufZeit
 *
 * @class Block
 * @constructor
 *
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 */
function Block(spieler){
	/**
	 * @property _spieler
	 * @type server.Games.SpielAufZeit.Spieler
	 * @private
	 */
	this._spieler = spieler;
	
	/**
	 * @property _destroyed
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._destroyed = false;
	
	/**
	 * @property _solid
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._solid = false;
	
	/**
	 * @property _vorschau
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._vorschau = false;
}

/**
 * @method getSpieler
 *
 * @return server.Games.SpielAufZeit.Spieler
 */
Block.prototype.getSpieler = function(){
	return this._spieler;
};

/**
 * @method isDestroyed
 *
 * @return {Boolean} 
 */
Block.prototype.isDestroyed = function(){
	return this._destroyed;
};

/**
 * @method isSolid
 *
 * @return {Boolean} 
 */
Block.prototype.isSolid = function(){
	return this._solid;
};

/**
 * @method isVorschau
 *
 * @return {Boolean} 
 */
Block.prototype.isVorschau = function(){
	return this._vorschau;
};

/**
 * @method setDestroyed
 *
 * @param {Boolean} b
 */
Block.prototype.setDestroyed = function(b){
	this._destroyed = b;
};

/**
 * @method setSolid
 *
 * @param {Boolean} b
 */
Block.prototype.setSolid = function(b){
	this._solid = b;
};

/**
 * @method setVorschau
 *
 * @param {Boolean} b
 */
Block.prototype.setVorschau = function(b){
	this._vorschau = b;
};



/**
 * @method getEmitData
 *
 * @return {JSON}
 */
Block.prototype.getEmitData = function(){
	var block = {};
	block.destroyed = this._destroyed;
	block.solid = this._solid;
	block.spielerId = this._spieler.getId();
	block.vorschau = this._vorschau;
	return block;
}

exports.Block = Block;