'use strict';

/**
 * Konsturktor für den Chat.
 *
 * @module controller
 * @namespace controller
 * @class Chat
 * @param {Socket} socket
 * @constructor
 */
function Chat(socket){
	/**
	 * @property _socket
	 * @type Socket
	 * @default null
	 * @private
	 */
	this._socket = socket;
	
	/**
	 * @property _rootID
	 * @type Number
	 * @private
	 */
	this._rootId = "chat";
	
	/**
	 * @property _name
	 * @type String
	 * @private
	 */
	this._name = null;
	
	this._bindSocketEvents();
}

/**
 * @method _bindSocketEvents
 * @private
 */
Chat.prototype._bindSocketEvents = function(){
	this._socket.on('ChatAdd', function (data) {
		this.add(data.profil.Name, data.nachricht);
	}.bind(this));
};

/**
 * @method write
 * @param {String} text
 */
Chat.prototype.write = function(text){
	if(text!== ""){
		this._socket.emit("ChatWrite", {
			"chatText": text
		});
	}
};

/**
 * @method add
 * @param {String} von
 * @param {String} text
 */
Chat.prototype.add = function(von, text){

	// die neueste art zu escapen
	von = $("<span>").text(von).html();
	text = $("<span>").text(text).html();
	
	$("#"+this._rootId+" #chat_inner").append("<p><strong>"+von+"</strong>"+text+"</p>");
	$("#"+this._rootId+" #chat_inner").stop().animate({scrollTop: "1000000px"}, 1);
};

/**
 * @method setName
 * @param {String} name
 */
Chat.prototype.setName = function(name){
	this._name = name;
}

/**
 * @method delegate
 */
Chat.prototype.delegate = function(){
	$("#gameselect").delegate("#chat_form", "submit", function(event){
		this.write($("#chat_input").val());
		$("#chat_input").val("");
		return false;
	}.bind(this));	
}

/**
 * @method getRootHtml
 * @return {String}
 */
Chat.prototype.getRootHtml = function(){
	return "<div id='chat'><div id='chat_inner'></div><form id='chat_form' class='styledForm' action='' mehtod='post'><input autocomplete='off' type='text' id='chat_input' /><button id='chat_button' type='submit'>Senden</button></form></div>";
}

/**
 * @method getRootId
 * @return {String}
 */
Chat.prototype.getRootId = function(){
	return this._rootId;
}

/**
 * @method setRootId
 * @param {String} rootId
 */
Chat.prototype.setRootId = function(rootId){
	this._rootId = rootId;
}

/**
 * @method clear
 */
Chat.prototype.clear = function(){
	$("#"+this._rootId+" #chat_inner").html("");
};