'use strict';

/**
 * Konsturktor für Controller
 *
 * @module controller
 * @namespace controller
 * @class Controller
 * @param {String} serverAdress
 * @constructor
 */
function Controller(serverAdress){

	/**
	 * @property _elesMap
	 * @type Map
	 * @private
	 */
	this._elesMap = [
		["#rotateLeft",  BUTTON.RotateLeft],
		["#item1",       BUTTON.Item1],
		["#item2",       BUTTON.Item2],
		["#item3",       BUTTON.Item3],
		["#rotateRight", BUTTON.RotateRight],
		["#exit",        BUTTON.Exit],
		["#left",        BUTTON.Left],
		["#down",        BUTTON.Down],
		["#right",       BUTTON.Right]
	];
	
	/**
	 * @property _keyMap
	 * @type Map
	 * @private
	 */
	this._keyMap = [
		["#rotateLeft",  CONFIG.KEYS.RotateLeft],
		["#item1",       CONFIG.KEYS.Item1],
		["#item2",       CONFIG.KEYS.Item2],
		["#item3",       CONFIG.KEYS.Item3],
		["#rotateRight", CONFIG.KEYS.RotateRight],
		["#exit",        CONFIG.KEYS.Exit],
		["#left",        CONFIG.KEYS.Left],
		["#down",        CONFIG.KEYS.Down],
		["#right",       CONFIG.KEYS.Right]
	];
	
	/**
	 * @property _socket
	 * @type Socket
	 * @default null
	 * @private
	 */
	this._socket = null;
	
	/**
	 * @property _touch_deactivated
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._touch_deactivated = false;
	
	/**
	 * @property _id
	 * @type Number
	 * @default null
	 * @private
	 */
	this._id = null;
	
	/**
	 * @property _game_selected
	 * @type Number
	 * @default null
	 * @private
	 */
	this._game_selected = null;
	
	/**
	 * @property _serverAdress
	 * @type String
	 * @private
	 */
	this._serverAdress = serverAdress;
	
	/**
	 * @property _buttonsDown
	 * @type Array
	 * @default []
	 * @private
	 */
	this._buttonsDown = [];
	
	/**
	 * @property _profil_id
	 * @type Number
	 * @default null
	 * @private
	 */
	this._profil_id = null;
	
	/**
	 * @property _profil
	 * @type String
	 * @default null
	 * @private
	 */
	this._profil = null;
	
	/**
	 * @property _active
	 * @type Boolean
	 * @default true
	 * @private
	 */
	this._active = true;
	
	/**
	 * @property _connectionLost
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._connectionLost = false;
	
	/**
	 * @property _color
	 * @type Array
	 * @default [255,255,255]
	 * @private
	 */
	this._color = [255,255,255];
	
	
	/**
	 * @property _auswahl
	 * @type controller.Auswahl
	 * @default null
	 * @private
	 */
	this._auswahl = null;
	
	/**
	 * @property _isTouch
	 * @type Boolean
	 * @private
	 */
	this._isTouch = !!('ontouchstart' in window);
	
	/**
	 * @property _catchKeyboard
	 * @type Boolean
	 * @private
	 */
	this._catchKeyboard = false;
}

/**
 * @method init
 * @param {controller.Auswahl} auswahl
 * @param {Function} callback
 * @async
 */
Controller.prototype.init = function(auswahl, callback){
	this._auswahl = auswahl;
	
	
	document.body.addEventListener('touchmove', function(event) {
		if(this._touch_deactivated){
			event.preventDefault();
		}
	}, false);
	

	$(window).on("resize", function(){
		this._resize();
	}.bind(this));
	
	this._initSocket(callback);
	this._initListeners();
};

/**
 * @method init
 * @param {Function} callback
 * @async
 * @private
 */
Controller.prototype._initSocket = function(callback){
	// start connection
	this._socket = io.connect(this._serverAdress);
	
	this._socket.on('connect', function () {
	
		if(this._connectionLost){
			this._reconnected();
			return;
		}
		
		this.connectControllerToServer(callback);
		this._bindSocketEvents();
		
	}.bind(this)); 
	
	this._socket.on('disconnect', function () {
		this.connectionLost();
	}.bind(this)); 
};

/**
 * @method connectControllerToServer
 * @param {Function} callback
 * @async
 */
Controller.prototype.connectControllerToServer = function(callback){
	// Controller verbindet sich 
	this._socket.emit('connectController', {}, function (data) {
		this._id = data.id;
		
		this._bindSocketEvents();
		callback(data);
	}.bind(this));
};

/**
 * @method _bindSocketEvents
 * @private
 */
Controller.prototype._bindSocketEvents = function(){
	this._socket.on('SpielCountdown', function (data) {
		this.show(data);
	}.bind(this));
	
	this._socket.on(GAME_EVENT.START, function (data) {
		var i;
		for(i in data.details.spieler){
			if(data.details.spieler[i].id == this.getProfilId()){
				this.setColor(data.details.spieler[i].color);
				break;
			}
		}
		this.setActive(true);
		$("#profil_infos").html("P.ID: "+this._profil.id+", "+this._profil.name+"");
		$("#spiel_infos").html("S.ID: "+data.SpielID);
		this.show();
	}.bind(this));
	
	this._socket.on(GAME_EVENT.PUNKTE, function (data, fn) {
		//console.log("SpielPunkte:" + data);
	}.bind(this));
	
	this._socket.on(GAME_EVENT.NEXT_BLOCK, function (data, fn) {
		//console.log("SpielNextBlock:" + data);
	}.bind(this));
	
	this._socket.on(GAME_EVENT.SPIELER_AUSGESCHIEDEN, function (data, fn) {
		this.setActive(false);
	}.bind(this));
	
	this._socket.on(GAME_EVENT.ENDE, function (data) {
		this.setActive(false);
	}.bind(this));
};

/**
 * @method _initListeners
 * @private
 */
Controller.prototype._initListeners = function(){
	var e, that = this;
	if(this._isTouch){
		// Bedienung per Touch
		for(e in this._elesMap){
			$("#controller").delegate(this._elesMap[e][0], "touchstart", function(id){
				var t = that._elesMap[e][1];
				return function(){
					that.buttonDown(t);
					event.preventDefault();	
				}.bind(this);
			}.bind(this)(this._elesMap[e][0]));
			
			$("#controller").delegate(this._elesMap[e][0], "touchend", function(id){
				var t = that._elesMap[e][1];
				return function(){
					that.buttonUp(t);
					event.preventDefault();	
				}.bind(this);
			}.bind(this)(this._elesMap[e][0]));
		}
	}else{  
		// mit der Maus spielbar machen
		for(e in this._elesMap){
			$(this._elesMap[e][0]).data("map_index", e);
			
			$("#controller").delegate(this._elesMap[e][0], "mousedown", function(event){
				var index = $(this).data("map_index");
				that.buttonDown(that._elesMap[index][1]);
				event.preventDefault();		
			}); 
			$("#controller").delegate(this._elesMap[e][0], "mouseup", function(event){
				var index = $(this).data("map_index");
				that.buttonUp(that._elesMap[index][1]);
				event.preventDefault();					
			});
		}
	}
	
	
	// auch per Tastatur (wer spiel schon mit Maus) ;)
	$("body").keydown(function(event) {	
		if(!that._catchKeyboard) return;
		var i;
		for(i in that._keyMap){
			if(event.which === that._keyMap[i][1]){
				$(that._keyMap[i][0]).mousedown();
				event.preventDefault();						
			}
		}
	});
	
	$("body").keyup(function(event) {
		if(!that._catchKeyboard) return;
		var i;
		for(i in that._keyMap){
			if(event.which === that._keyMap[i][1]){
				$(that._keyMap[i][0]).mouseup();
				event.preventDefault();						
			}
		}
	});
};

/**
  * @method deselectSpiel
  */
Controller.prototype.deselectSpiel = function(){
	if(this._game_selected !== null){
		
		$("#game_"+this._game_selected+".element").addClass("button");
		this._game_selected = null;
	}
};

/**
  * @method disselectProfil
  * @param {Function} [callback]
  * @async
  */
Controller.prototype.disselectProfil = function(callback){
	this._socket.emit('disselectPlayer', {}, function (result) {
		this.setProfil(null);
		this.setProfilId(null);
		document.title = "Controller";
		if(callback) callback(result);
	}.bind(this));
};

/**
  * @method selectProfil
  *
  * @param {Number} profilId
  * @param {Function} [callback]
  * @async
  */
Controller.prototype.selectProfil = function(profilId, callback){
	this._socket.emit('selectPlayer', {profil_id: profilId}, function (result) {
		if(result.ok === true){
			this.setProfilId(profilId);
			this.setProfil(result.data);
			document.title = result.data.name+" | Controller";
			if(callback) callback(result);
		}else{
			console.log("ERRRRRROR");
		}
	}.bind(this));
};

/**
  * @method selectGame
  *
  * @param {Number} spielId
  * @param {Function} [callback]
  * @async
  */
Controller.prototype.selectGame = function(spielId, callback){
	this._socket.emit('selectGame', {SpielID: spielId}, function (result) {
		if(callback) callback(result);	
	}.bind(this));
};

/**
  * @method leaveGame
  *
  * @param {Number} spielId
  * @param {Function} [callback]
  * @async
  */
Controller.prototype.leaveGame = function(spielId, callback){
	this._socket.emit('leaveGame', {}, function (result) {
		if(callback) callback(result);
	}.bind(this));
};

/**
  * @method startGame
  *
  * @param {Number} spiel_id
  * @param {Function} [callback]
  * @async
  */
Controller.prototype.startGame = function(spiel_id, callback){
	this._socket.emit('startGame', {SpielID: spiel_id}, function (result) {
		callback(result);
	}.bind(this));
};

/**
  * @method setColor
  *
  * @param {Array} color
  */
Controller.prototype.setColor = function(color){
	this._color = color;
	$("#controller .playerColor span").css({"background":"rgba("+color[0]+","+color[1]+","+color[2]+",1)"});
	
};

/**
  * @method getProfilId
  *
  * @return {Number}
  */
Controller.prototype.getProfilId = function(){
	return this._profil_id;
};

/**
  * @method getProfil
  *
  * @return {JSON}
  */
Controller.prototype.getProfil = function(){
	return this._profil;
};

/**
  * @method setProfilId
  *
  * @param {Number} id
  */
Controller.prototype.setProfilId = function(id){
	this._profil_id = id;
};

/**
  * @method setProfil
  *
  * @param {String} profil
  */
Controller.prototype.setProfil = function(profil){
	this._profil = profil;
};

/**
  * @method getGameSelected
  *
  * @return {Number}
  */
Controller.prototype.getGameSelected = function(){
	return this._game_selected;
};

/**
  * Gibt die (server-interne) id des Controllers wieder.
  *
  * @method getId
  *
  * @return {Number} die Controller-ID
  */
Controller.prototype.getId = function(){
	return this._id;
};

/**
  * @method isActive
  *
  * @return {Boolean}
  */
Controller.prototype.isActive = function(){
	return this._active;
};

/**
  * @method setActive
  *
  * @param {Boolean} b
  */
Controller.prototype.setActive = function(b){
	this._active = b;
	
	if(this._active === false){
		$("#controller button").prop('disabled', true);
		$("#controller button#exit").prop('disabled', false);
	}else{
		$("#controller button").prop('disabled', false);
	}
};

/**
  * @method getSocket
  *
  * @return {Socket}
  */
Controller.prototype.getSocket = function(){
	return this._socket;
};	

/**
  * @method _reconnected
  * @private
  */
Controller.prototype._reconnected = function(){	
	$("#connection_lost").html("Connection found. Reload in <span>"+CONFIG.reconnectReloadTime+"</span>ms...");
	setTimeout("window.location.href=window.location.href;", CONFIG.reconnectReloadTime);
	$("#connection_lost span").prop('number', CONFIG.reconnectReloadTime);
	$("#connection_lost span").animateNumber({ number: 0, easing: 'linear' }, CONFIG.reconnectReloadTime);
};


/**
  * @method connectionLost
  */
Controller.prototype.connectionLost = function(){
	$("#connection_lost").html("Connection Lost.. trying to reconnect..");
	$("#connection_lost").show();
	this._connectionLost = true;
};

/**
  * @method _resize
  * @private
  */
Controller.prototype._resize = function(){
	var size = $("#profil_infos").height();
	$("#profil_infos, #spiel_infos, #exit").css("font-size",(size-20)+"px");
	$("#profil_infos, #spiel_infos, #exit").css("line-height",size+"px");
};

/**
  * @method buttonDown
  *
  * @param {global.BUTTON} button
  */
Controller.prototype.buttonDown = function(button){
	if(button === BUTTON.Exit){
		return;
	}

	if(!Util.inArray(this._buttonsDown, button)){
		this._buttonsDown.unshift(button);
		this._socket.emit('button', {"type": BUTTONTYPE.Down, "key": button});
	}
};

/**
  * @method buttonUp
  *
  * @param {global.BUTTON} button
  */
Controller.prototype.buttonUp = function(button){
	if(button === BUTTON.Exit){
		this.leaveGame();
		this._auswahl.showLevelauswahl();
		this._auswahl.flash();
		return;
	}
	
	this._buttonsDown = Util.delArray(this._buttonsDown, button);
	this._socket.emit('button', {"type": BUTTONTYPE.Up, "key": button});
};

/**
  * @method show
  *
  * @param {Number} time
  */
Controller.prototype.show = function(time){
	this._auswahl.hide();
	$("#controller").show();
	
	this._touch_deactivated = true;
	this._catchKeyboard = true;
	
	if(time !== undefined){
		$("#countdown").css("opacity",1);
		$("#countdown span").prop('number', time)
		$("#countdown span").animateNumber({ number: 0, easing: 'linear' }, time, function(){
			$("#countdown").stop().animate({"opacity":0}, 250);
			$("#countdown").hide();
		});
		$("#countdown").show();
	}
	
	this._resize();
};

/**
  * @method hide
  */
Controller.prototype.hide = function(){
	$("#controller").hide();
	this._touch_deactivated = false;
	this._catchKeyboard = false;
};