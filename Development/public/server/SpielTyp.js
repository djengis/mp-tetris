'use strict';

/**
 * Konsturktor für SpielTyp
 *
 * @module server
 * @namespace server
 * @class SpielTyp
 * @constructor
 * @param {Number} id 
 * @param {String} bezeichnung 
 * @param {String} clas 
 */
function SpielTyp(id, bezeichnung, clas){
	/**
	 * @property _id
	 * @type Number
	 * @private
	 */
	this._id = id;
	
	/**
	 * @property _bezeichnung
	 * @type String
	 * @private
	 */
	this._bezeichnung = bezeichnung;
	
	/**
	 * @property _bezeichnung
	 * @type String
	 * @private
	 */
	this._class = clas;
	
	/**
	 * @property _fireEvents
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._fireEvents = false;
}

/**
 * @method getClass
 *
 * @return {String}
 */
SpielTyp.prototype.getClass = function(){
	return this._class;
};

/**
 * Setter für Bezeichnung
 *
 * @method setBezeichnung
 * @param {String} bezeichnung 
 */
SpielTyp.prototype.setBezeichnung = function(bezeichnung){
	this._bezeichnung = bezeichnung;
	return this;
};

/**
 * Getter für Bezeichnung 
 *
 * @method getBezeichnung
 * @return {String} die Bezeichnung
 */
SpielTyp.prototype.getBezeichnung = function(){
	return this._bezeichnung;
};

/**
 * Getter für ID
 *
 * @method getId
 * @return {Number}
 */
SpielTyp.prototype.getId = function(){
	return this._id;
};

/**
 * @method addEventListener
 * @param {Object} listener 
 */
SpielTyp.prototype.addEventListener = function(listener){
	this._eventListeners.push(listener);
};

/**
 * @method removeEventListener
 */
SpielTyp.prototype.removeEventListener = function(){
	console.err("SpielTyp.prototype.removeEventListener nicht implementiert!");
};

/**
 * @method stopEvents
 */
SpielTyp.prototype.stopEvents = function(){
	this._fireEvents = false;
};

/**
 * @method startEvents
 */
SpielTyp.prototype.startEvents = function(){
	this._fireEvents = true;
};

/**
 * @method broadcastEvent
 *
 * @param {Boolean} force 
 */
SpielTyp.prototype.broadcastEvent = function(force){
	if(!this._fireEvents && !force){
		return;
	}
	var i, listener;
	var eventName = "SpielTypChange";
	for(i in this._eventListeners){
		listener = this._eventListeners[i];
		listener.receiveEvent(eventName, this);
	}
};

/**
 * @method getEmitData
 * @return {Object}  
 */
SpielTyp.prototype.getEmitData = function(){
	var o = {};
	o.bezeichnung = this.getBezeichnung();
	o.id = this.getId();
	o.class = this.getClass();
	return o;
};

exports.SpielTyp = SpielTyp;
