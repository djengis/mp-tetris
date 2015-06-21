'use strict';

/**
 * Konstruktor für Lounge
 *
 * @module display
 * @namespace display
 * @class Lounge
 * @param {display.Display} display
 * @constructor
 */
function Lounge(display){

	/**
	 * Instanz von Displays
	 *
	 * @property _display
	 * @type display.Display
	 * @private
	 */
	this._display = display;
	
	/**
	 * Das Socket
	 *
	 * @property _socket
	 * @type Socket
	 * @default null
	 * @private
	 */
	this._socket = null;
}

/**
 * 
 *
 * @method init
 * @param {Socket} socket
 */
Lounge.prototype.init = function(socket){
	this._socket = socket;
	this._initSocket();
};

/**
 * @method show
 * @param {JSON} data
 */
Lounge.prototype.show = function(data){
	this._display.removeAllMessage();
	var textchen = "<h1>Lounge ("+data.SpielID+")</h1>";
	textchen += "<div id='loungeList'><ul>";
	for(var j = 0; j < data.MaxProfil; j++){
		textchen += "<li class='frei'><i>frei</i></li>";
	}
	textchen += "</ul>";
	textchen += "<div class='clear'></div>";
	textchen += "<h2><span id='countdown_balken'></span><strong id='countdown'>Warte &hellip;</strong></h2>";
	textchen += "</div>";
	
	this._display.showMessage(textchen, false, 615);
	
	for(var i in data.MitProfil){
		this._addPlayer(data.MitProfil[i]);
	}
};

/**
 * @method _addPlayer
 * @param {JSON} data
 * @private
 */
Lounge.prototype._addPlayer = function(data){
	var c = data.color;
	var href = "";
	$("#loungeList li.frei").first().after("<li style='background-color:rgb("+c[0]+","+c[1]+","+c[2]+");' id='loungeProfil_"+data.ProfilID+"'><a href='"+href+"'>"+data.Name+"</a></li>");
	$("#loungeList li.frei").first().remove();
};

/**
 * @method _removePlayer
 * @param {Number} id
 * @private
 */
Lounge.prototype._removePlayer = function(id){
	$("#loungeProfil_"+id).after("<li class='frei'><i>frei</i></li>");
	$("#loungeProfil_"+id).remove();	
};

/**
 * @method _changePlayer
 * @param {JSON} data
 * @private
 */
Lounge.prototype._changePlayer = function(data){
	$("loungeProfil_"+data.ProfilID).css({"background-color":"rgb("+c[0]+","+c[1]+","+c[2]+")"});
	$("loungeProfil_"+data.ProfilID+" a").text(data.Name);
};

/**
 * 
 *
 * @method _showCountdown
 * @param {Number} time
 * @private
 */
Lounge.prototype._showCountdown = function(time){
	$("#loungeList li.frei i").html("closed");

	$("#countdown").prop('number', time);
	$("#countdown").animateNumber({ number: 0, easing: 'linear' }, time, function(){
		this._display.removeAllMessage();
	}.bind(this));
	
	$("#countdown").parent().animate({"background-color":"rgba(255,255,255,0.05)"},500);
	$("#countdown_balken").animate({"width":"100%"}, time, "linear");
};

/**
 * @method _initSocket
 * @private
 */
Lounge.prototype._initSocket = function(){
	/*
	 * Ein Spieler ist in das Spiel eingetreten.
	 */
	this._socket.on('SpielSpielerAdd', function (data) {
		this._addPlayer(data);
	}.bind(this));
	
	/*
	 * Ein Spieler hat Daten von sich verändert.
	 */
	this._socket.on('SpielSpielerChange', function (data) {
		this._changePlayer(data);
	}.bind(this));
	
	/*
	 * Ein Spieler ist aus dem Spiel ausgetreten.
	 */
	this._socket.on('SpielSpielerRemove', function (data) {
		this._removePlayer(data.ProfilID);
	}.bind(this));
		
	/*
	 * Der Countdown des Spiel hat begonnen.
	 */
	this._socket.on('SpielCountdown', function (data) {
		this._showCountdown(parseInt(data));
	}.bind(this));
};