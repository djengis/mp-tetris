'use strict';

/**
 * 
 *
 * @module server
 * @namespace server
 * @class Chat
 * @constructor
 * @param {server.Game} game
 */
function Chat(game){

	/**
	 * @property _active
	 * @type {Boolean}
	 * @private
	 */
	this._active = true;

	/**
	 * @property _messages
	 * @type {Array}
	 * @private
	 */
	this._messages = [];

	/**
	 * @property _game
	 * @type {server.Game}
	 * @private
	 */
	this._game = game;
}

/**
 * 
 *
 * @method write
 * @param {server.Profil} profil
 * @param {String} message
 */
Chat.prototype.write = function(profil, message){
	var profilData = {};

	this._messages.push({
		"profil": profil,
		"message": message
	});
	
	if(profil === null){
		profilData.Name = "[system]";
	}else{
		profilData = profil.getEmitData();
	}
	
	this._game.emitToControllers("ChatAdd", {
		"profil": profilData,
		"nachricht": message
	});
};


/**
 * Setzt den Chat aktiv/inaktiv.
 *
 * @method setActive
 * @param {Boolean} active 
 */
Chat.prototype.setActive = function(active){
	this._active = active;
};


/**
 * Gibt zurück, ob der Chat aktiv ist.
 *
 * @method isActive
 * @return {Boolean}
 */
Chat.prototype.isActive = function(){
	return this._active;
};

exports.Chat = Chat;