'use strict';

/**
 * Konstruktor für Display
 *
 * @module display
 * @namespace display
 * @class Display
 * @constructor
 * @param {String} serverAdress
 */
function Display(serverAdress){
	/**
	 * @property _socket
	 * @type Socket
	 * @default null
	 * @private
	 */
	this._socket = null;
	
	/**
	 * ID des Displays
	 *
	 * @property _id
	 * @type Number
	 * @default null
	 * @private
	 */
	this._id = null;
	
	/**
	 * Adresse des Server
	 *
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
	 * ID des Profil, welches verfolgt werden soll
	 *
	 * @property _spielerId
	 * @type Number
	 * @default null
	 * @private
	 */
	this._spielerId = null;
	
	/**
	 * ID des Spiels, welches verfolgt werden soll
	 *
	 * @property _spielId
	 * @type Number
	 * @default null
	 * @private
	 */
	this._spielId = null;
	
	/**
	 * Breite
	 *
	 * @property _w
	 * @type Number
	 * @default null
	 * @private
	 */
	this._w = null;
	
	/**
	 * Höhe
	 *
	 * @property _h
	 * @type Number
	 * @default null
	 * @private
	 */
	this._h = null;
	
	/**
	 * Breite des Spielfelds
	 *
	 * @property _gamefieldW
	 * @type Number
	 * @default 1920
	 * @private
	 */
	this._gamefieldW = 1920; // intern width
	
	/**
	 * Höhre des Spielfelds
	 *
	 * @property _gamefieldH
	 * @type Number
	 * @default 1080
	 * @private
	 */
	this._gamefieldH = 1080; // intern height
	
	/**
	 * Seitenverhältnis des Spielfelds
	 *
	 * @property _aspectratio
	 * @type Number
	 * @default _w/_h
	 * @private
	 */
	this._aspectratio = this._gamefieldW / this._gamefieldH;
	
	/**
	 * @property _field_w
	 * @type Number
	 * @default null
	 * @private
	 */
	this._field_w = null;
	
	/**
	 * @property _field_h
	 * @type Number
	 * @default null
	 * @private
	 */
	this._field_h = null;
	
	/**
	 * @property _gameEventBuffer
	 * @type Array
	 * @default []
	 * @private
	 */
	this._gameEventBuffer = [];
	
	/**
	 * @property _tickCounter
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._tickCounter = 0;
	
	/**
	 * Inerval-Instance
	 * @property _instance
	 * @type Interval
	 * @default null
	 * @private
	 */
	this._instance = null;
	
	/**
	 * Frame per Second
	 *
	 * @property _fps
	 * @type Number
	 * @default 1000/60
	 * @private
	 */
	this._fps = 1000/60; // 1000/60
	
	/**
	 * Spieler, der verfolgt werden soll
	 *
	 * @property _spieler
	 * @type Object
	 * @default {}
	 * @private
	 */
	this._spieler = {};
			
	/**
	 * @property _connectionLost
	 * @type Boolean
	 * @default false
	 * @private
	 */
	this._connectionLost = false;
	
	/**
	 * @property _audio
	 * @type display.MyAudio
	 * @default new MyAudio()
	 * @private
	 */
	this._audio = new MyAudio();
	
	/**
	 *
	 *
	 * @property _lounge
	 * @type display.Lounge
	 * @default new Lounge(this)
	 * @private
	*/
	this._lounge = new Lounge(this);
	
	
	/**
	 *
	 *
	 * @property _afterGame
	 * @type display.AfterGame
	 * @default new AfterGame()
	 * @private
	*/
	this._afterGame = new AfterGame();
	
	// Lade die Sounds
	this._audio.load("blockRotate", "sounds/N-Tick-Freak61-7778_hifi.mp3");
	this._audio.load("lineKill",    "sounds/idg-bang-intermed-2959_hifi.mp3");
	this._audio.load("startGame",   "sounds/Nice_Not-NEO_Soun-8393_hifi.mp3");
	this._audio.load("blockSolidate", "sounds/cordless-xrikazen-7428_hifi.mp3");
	this._audio.load("spielerRaus", "sounds/idg-bang-intermed-2937_hifi.mp3");
	//this._audio.load("SpielEnds", "sounds/TODO");
	
}

/**
 * @method showMessage
 *
 * @param {String} text
 * @param {Boolean} [autoHide=false]
 * @param {Number} [width]
 */
Display.prototype.showMessage = function(text, autoHide, width){
	if(autoHide === undefined) autoHide = false;
	if(width === undefined) width = null;
	var style="";
	
	if(width !== null){
		style = "style='width:"+width+"px'";
	}
	
	var html = $("<div class='message' "+style+">"+text+"</div>");
	$("body").append(html);
	var w = html.width()+50;
	var h = html.height()+50;
	html.css({
		marginLeft: "-"+(w/2)+"px",
		marginTop: "-"+(h/2)+"px"
	});
	
	//flash
	var flash = $("<div></div>");
	flash.css({
		position: "absolute",
		left: "-4px",
		top: "-4px",
		bottom: "-4px",
		right: "-4px",
		backgroundColor: "white"
	}).animate({
		opacity: 0
	}, 250, function(){
		$(this).remove();
	});
	html.append(flash);
	
	if(autoHide){
		setTimeout(function(html){
			return function(){
				html.animate({
					opacity: 0
				}, 500, function(){
					$(this).remove();
				});
			}
		}(html), autoHide);
	}
};

/**
 *
 *
 * @method removeAllMessage
 * @param {Boolean} [fast=false] 
 */
Display.prototype.removeAllMessage = function(fast){
	if(fast === undefined) fast = false;
	
	if(fast){
		$(".message").remove();
	}else{
		$(".message").animate({
			opacity: 0
		}, 500, function(){
			$(this).remove();
		});
	}
};

/**
 * Passt die Größe des Displays an die Fenstergröße an.
 *
 * @method resize
 */
Display.prototype.resize = function(){
	var winW = $(window).width();
	var winH = $(window).height();
	var scaleFactor = 1;
	
	if(winW/winH > this._aspectratio){
		this._h = winH;
		this._w = this._aspectratio * this._h;
	}else{
		this._w = winW;
		this._h = this._w/this._aspectratio;
	}
	scaleFactor = (this._h/this._gamefieldH);
	
	// magic css3 <3 -> http://www.html5rocks.com/en/tutorials/speed/high-performance-animations/
	$("#gamefield").css({
		"-webkit-transform": "scale("+scaleFactor+")",
		"-moz-transform": "scale("+scaleFactor+")",
		"-ms-transform": "scale("+scaleFactor+")",
		"-o-transform": "scale("+scaleFactor+")",
		"transform": "scale("+scaleFactor+")",
	});
};

/**
 * @method showConnect
 */
Display.prototype.showConnect = function(){
	$("#AuswahlSpielSpieler").show();
};

/**
 * Gibt die ID des Displays zurück.
 *
 * @method getId
 *
 * @return {Number}
 */
Display.prototype.getId = function(){
	return this._id;
};

/**
 * Gibt die Höhe eines einzelnen Blockes zurück
 *
 * @method getBlockHeight
 *
 * @return {Number}
 */
Display.prototype.getBlockHeight = function(){
	return $("#blockfield").height() / this._field_h;
};

/**
 * Gibt die Breite eines einzelnen Blockes zurück
 *
 * @method getBlockWidth
 *
 * @return {Number}
 */
Display.prototype.getBlockWidth = function(){
	return this.getBlockHeight();	
};

/**
 * Erstellt eine Liste von Blöcken, welche dem Spielfeld angehängt werden.
 *
 * @method createBlockfield
 */
Display.prototype.createBlockfield = function(){
	var y, x, element,id,block_w,block_h;
	var elements = [];
	
	for(y = 0; y < this._field_h; y++){
		for(x = 0; x < this._field_w; x++){
			id = "block_"+x+"_"+y;
			element = this.createBlock(x, y, id);
			elements.push(element);
		}
	}
	$("#blockfield").append(elements);
};

/**
 * Erstellt ein Block an der Stelle x,y
 *
 * @method createBlock
 * @param {Number} x
 * @param {Number} y
 * @param {Number} id
 */
Display.prototype.createBlock = function(x, y, id){
	var block_w = this.getBlockWidth();
	var block_h = this.getBlockHeight();
	
	if(id !== undefined){
		id = " id='"+id+"'";
	}
	
	var element = $("<div class='block'"+id+"></div>");
	element.css({
		left: (x*block_w)+"px",
		top: (y*block_h)+"px",
		width: block_w+"px",
		height: block_h+"px"
	});
	return element;
};

/**
 * Erstellt ein Spielstein für das Profil spieler.
 *
 * @method createPlayerElement
 * @param {display.Spieler} spieler
 */
Display.prototype.createPlayerElement = function(spieler){
	var element, id, c;
	id = "cursor_"+spieler.getId();
	c = spieler.getColor();
	element = $("<div class='cursor' id='"+id+"'></div>");
	$("#blockfield").append(element);
	$("#"+id).css("width",this.getBlockWidth()+"px");
	$("#"+id).css("background-color", "rgb("+c[0]+","+c[1]+","+c[2]+")");	
};



/**
 * Zeigt den Namen und Punkte von spieler an.
 *
 * @method createPlayerInfos
 * @param {display.Spieler} spieler
 */
Display.prototype.createPlayerInfos = function(spieler){
	var id = "playerInfo_"+spieler.getId();
	var html = "<li id='"+id+"'>";
	html += "<span class='playerPlatz'>"+spieler.getPlatz()+"</span>";
	html += "<span class='playerColor' style='background-color:rgb("+spieler.getColor()+")'></span>";
	html += "<strong>"+spieler.getName()+"</strong>";
	html += "<span class='playerPunkte'>"+spieler.getPunkte()+"</span><span>&nbsp;Punkte</span>";
	
	html += "<span class='playerLevel'>"+spieler.getLevel()+"</span><span>&nbsp;Level</span>";
	html += "<span class='playerLines'>"+spieler.getLines()+"</span><span>&nbsp;Lines</span>";
	
	html += "</li>"
	$("#gameInfos ul").append(html);
	
	if(spieler.isRaus()){
		$("#"+id).addClass("out");
	}
}

/**
 * Initalisiert das Spiel
 *
 * @method initGame
 * @param {JSON} data 
 */
Display.prototype.initGame = function(data){
	var i, id, color, cursor,html;
	$("#display").html('<div id="gamefield"><div id="gameInfos"></div><div id="blockfield"></div><div id="effektfield"></div></div>');
	html = "";
	html += "<h2>"+data.SpielTyp.bezeichnung+" <span id='spielZeit'></span></h2><ul id='spieler_platzierungen'></ul>";
	html += "<h2>Spielinfos</h2>";
	html += "<p><span>SpielID</span><span>&nbsp;"+data.SpielID+"</span></p>";
	$("#gameInfos").html(html);
	$(window).resize();
	this.showGame();
	this._field_w = data.details.w;
	this._field_h = data.details.h;
	this.createBlockfield();
	for(i in data.details.spieler){
		id = data.details.spieler[i].id;
		color = data.details.spieler[i].color;
		cursor = data.details.spieler[i].cursor;
		this._spieler[id] = new Spieler(id);
		this._spieler[id].setColor(color);
		this._spieler[id].setCursor(cursor);
		this._spieler[id].setName(data.details.spieler[i].name);
		this._spieler[id].setPunkte(data.details.spieler[i].punkte);
		this._spieler[id].setPlatz(data.details.spieler[i].platz);
		this._spieler[id].setRaus(!data.details.spieler[i].active);
		
		this._spieler[id].setLines(data.details.spieler[i].lines);
		this._spieler[id].setLevel(data.details.spieler[i].level);
		
		this.createPlayerElement(this._spieler[id]);
		this.createPlayerInfos(this._spieler[id]);
	}
};

/**
 * @method tick
 */
Display.prototype.tick = function(){
	var i, spieler, x, y, id;
	
	for(i in this._spieler){
		spieler = this._spieler[i];
		if(!(spieler instanceof Spieler)) continue;
		
		id = "cursor_"+spieler.getId();
		x = spieler.getCursor()[0] * this.getBlockWidth();
		y = spieler.getCursor()[1] * this.getBlockHeight();
		$("#"+id).css("left",x+"px");
		
	}
};

/**
 * @method startGame
 */
Display.prototype.startGame = function(){
	this.removeAllMessage();
	this._instance = setInterval((function(){ this.tick() }.bind(this)), this._fps);
	this._audio.play("startGame");
};

/**
 * @method abortGame
 */
Display.prototype.abortGame = function(){
	clearInterval(this._instance);
};

/**
 * @method init
 */
Display.prototype.init = function(){
	
	$(window).on("resize", function(){
		this.resize();
	}.bind(this));
	
	// start connection
	this._socket = io.connect(this._serverAdress);
	
	this._afterGame.init();
	
	this._socket.on('connect', function () {
		this._lounge.init(this._socket);
	
		/*
		 * Zeigt Verbindungsverlust und wiederconnect an -> neu laden
		 */
		if(this._connectionLost){
			$("#connection_lost").html("Connection found. Reload in <span>"+CONFIG.reconnectReloadTime+"</span>ms...");
			setTimeout("window.location.reload();", CONFIG.reconnectReloadTime);
			$("#connection_lost span").prop('number', CONFIG.reconnectReloadTime);
			$("#connection_lost span").animateNumber({ number: 0, easing: 'linear' }, CONFIG.reconnectReloadTime);
			return;
		}
	
		/*
		 * Display verbindet sich
		 */
		this._socket.emit('connectDisplay', {}, function (data) {
			this._id = data;
		});
		
		/*
		 * Spiel wurde gestartet
		 */
		this._socket.on('SpielStarts', function (data) {
			this.initGame(data);
			this.startGame();
			this.removeAllMessage();
			this._afterGame.hide();
		}.bind(this));
		
		/*
		 * Bei jeder eingabe oder Tackt.
		 */
		this._socket.on('SpielFrame', function (data) {
			this.computeSpielFrame(data);
		}.bind(this));
		
		/*
		 * Effekte die Angezeigt werden sollen.
		 */
		this._socket.on('SpielEffect', function (effect) {
			this.computeSpielEffect(effect);
		}.bind(this));
		
		/*
		 * Spiel wurde abgebrochen.
		 */
		this._socket.on('SpielAborted', function (data) {
			// .. void
		}.bind(this));
		
		/*
		 * Ein Spieler ist aus dem Spiel ausgeschieden.
		 */
		this._socket.on('SpielSpielerRaus', function (data) {
			var id = "playerInfo_"+data;
			$("#"+id).addClass("out");
		}.bind(this));
		
		/*
		 * Das Spiel Endet.
		 */
		this._socket.on('SpielEnds', function (data) {
			this._afterGame.show(data);
		}.bind(this));
		
		/*
		 * Das Profil, welches verfolgt wird, hat sich in ein Spiel eingelogt.
		 */
		this._socket.on('ProfilLoggedInGame', function (data) {
			this._afterGame.hide();
			if(data.isLoggedInGame){
				this.connectToSpiel(data.SpielID);
			}else{
				$("#profil_status").text("");
				this.disconnectFromSpiel();
			}
		}.bind(this));
		
		/*
		 * Die Punkte eines Spieler hat sich während des Spiels verändert.
		 */
		this._socket.on('SpielSpielerPunkte', function (dataSpieler) {
		 	var spieler = this._spieler[dataSpieler.id];
		
			var id = "playerInfo_"+spieler.getId();
			 
			if(dataSpieler.punkte != spieler.getPunkte()){
				spieler.setPunkte(dataSpieler.punkte);
				
				$("#"+id+" .playerPunkte").text(dataSpieler.punkte);
				
				$("#"+id+" .playerPunkte").stop().css({color:"#ffffff"}).animate({
					color: "#838d97"
				}, 500);
			}
		}.bind(this));
		
		/*
		 * Das Level eines Spieler hat sich während des Spiels verändert.
		 */
		this._socket.on('SpielSpielerLevel', function (dataSpieler) {
		 	var spieler = this._spieler[dataSpieler.id];
			var id = "playerInfo_"+spieler.getId();
			
			spieler.setLevel(dataSpieler.level);
			
			$("#"+id+" .playerLevel").text(spieler.getLevel());
							
			$("#"+id+" .playerLevel").stop().css({color:"#ffffff"}).animate({
				color: "#838d97"
			}, 500);
		}.bind(this));
		
		/*
		 * Das Level eines Spieler hat sich während des Spiels verändert.
		 */
		this._socket.on('SpielSpielerLines', function (dataSpieler) {
		 	var spieler = this._spieler[dataSpieler.id];
			var id = "playerInfo_"+spieler.getId();
			
			spieler.setLines(dataSpieler.lines);
			
			$("#"+id+" .playerLines").text(spieler.getLines());			
				
			$("#"+id+" .playerLines").stop().css({color:"#ffffff"}).animate({
				color: "#838d97"
			}, 500);
		}.bind(this));
		
		/*
		 * Die Platzierung eines Spieler hat sich während des Spiels verändert.
		 */
		this._socket.on('SpielPlatzierung', function (dataSpielerListe) {
			var spieler, i, dataSpieler, id, platzierungChange, j;
			var platzierungArray = {};
			var lastPlatz = 0;
			for(i in dataSpielerListe){
				dataSpieler = dataSpielerListe[i];
				spieler = this._spieler[dataSpieler.id];
				id = "playerInfo_"+spieler.getId();
				
				platzierungArray[dataSpieler.platz+""] = dataSpieler.id;
				
				if(lastPlatz<dataSpieler.platz){
					lastPlatz = dataSpieler.platz;
				}
				
				if(dataSpieler.platz != spieler.getPlatz()){
					spieler.setPlatz(dataSpieler.platz);
					$("#"+id+" .playerPlatz").text(dataSpieler.platz);
					
					$("#"+id+" .playerPlatz").stop().css({color:"#ffffff"}).animate({
						color: "#838d97"
					}, 500);
					
					platzierungChange = true;
				}
			}
			
			for(i in platzierungArray){
				id = "playerInfo_"+platzierungArray[i];
				
				var html = $("#"+id);
				$("#"+id).remove();
				$("#spieler_platzierungen").append(html);
				
			}
			
		}.bind(this));
		
	}.bind(this)); 
	
	// Verbindung verloren
	this._socket.on('disconnect', function() {
		$("#connection_lost").html("Connection Lost.. trying to reconnect..");
		$("#connection_lost").show();
		this._connectionLost = true;
	}.bind(this)); 
	
	this.bindConnect();
	
	/* muss man nicht verstehen, wieso das 2 mal ausgeführt werden muss, damit es auch funktioniert.. */
	$(window).resize();
	$(window).resize();
};

/**
 *
 *
 * @method computeSpielFrame
 * @param {JSON} data 
 */
Display.prototype.computeSpielFrame = function(data){
	var x, y, id, value, spieler, dataSpieler, i, cursor, color, platzierungChange;
	
	platzierungChange = false;

	// Setzte Spielerdaten
	for(i in data.spieler){
		dataSpieler = data.spieler[i];
		spieler = this._spieler[dataSpieler.id];
		spieler.setCursor([dataSpieler.cursor[0], dataSpieler.cursor[1]]);
	}
	
	// Setzte Spielfeld
	if(data.field !== null){
		try{
			for(y = 0; y < this._field_h; y++){
				for(x = 0; x < this._field_w; x++){
					id = "#block_"+x+"_"+y;
					value = data.field[y][x];
					
					if(value !== null){
						
						if(value.vorschau){		
							color = this._spieler[value.spielerId].getColor();
							color = "rgb(80,80,80)";			
						}else{
							color = this._spieler[value.spielerId].getColor();
							color = "rgb("+color[0]+","+color[1]+","+color[2]+")";
						}
						
						$(id).css({"background-color": color});	
					}else{
						// resette
						$(id).css({"background-color": ""});
					}
				}
			}
		}catch(err){
			alert("BOOOM");
		}
	}
	
};

/**
 * @method computeSpielEffect
 * @param {String} effect
 */
Display.prototype.computeSpielEffect = function(effect){
	var data, y, element, i, x;

	switch(effect.type){
		case "spielerRaus":
			this._audio.play("spielerRaus");
		break;
		case "blockSolidate":
			this._audio.play("blockSolidate");
		break;
		case "blockRotate":
			this._audio.play("blockRotate");
		break;
		case "SpielEnds":
			this._audio.play("SpielEnds");
		break;
		case "lineKill":
			this._audio.play("lineKill");
	
			data = effect.data;
			for(i in data.line){
				y  = data.line[i];
				
				for(x = 0; x < this._field_w; x++){
					element = this.createBlock(x,y);
					element.css({
						backgroundColor: "rgba(255,255,255,1)"
					}).animate({
						backgroundColor: "rgba(255,255,255,0)",
						top: (parseInt($(element).css("top"))+this.getBlockHeight())+"px"
					},250, function(){
						$(this).remove();
					});
					$("#effektfield").append(element);
				}
			}
		break;
		default:
			alert("Effekt unbekannnt: "+ effect.type);
	}
};

/**
 * Display wird von Spiel getrennt
 *
 * @method disconnectFromSpiel
 *
 * @async
 */
Display.prototype.disconnectFromSpiel = function(){
	this.showMessage("Spiel disconnecten...");
	var id = this._spielId;
	this._socket.emit('disconnectFromSpiel', {SpielID: id}, function (data) {
		this._spielId = null;
		this.hideGame();
		this.removeAllMessage();
		
		if(this._spieler){
			this.showMessage("<h1>Verbunden</h1> <p>Sie verfolgen das Profil von "+this._spieler.Name+".</p><p id='profil_status'></p>");
		}
	}.bind(this));
};

/**
 * Display verfolgt ein Spiel, anhand der übergebene ID
 *
 * @method connectToSpiel
 * @param {Number} id
 * @async
 */
Display.prototype.connectToSpiel = function(id){
	if(this.lastHash && this.lastHash.indexOf("#profil/")===0){
		/* void */
	}else{
		this.lastHash = "#spiel/"+id;
		window.location.hash = "#spiel/"+id;
	}
	
	this._socket.emit('connectToSpiel', {SpielID: id}, function (data) {
		if(data.ok === true){
			$("#AuswahlSpielSpieler").stop().animate({
				"opacity":1
			}, 250, function(){
				$("#AuswahlSpielSpieler").hide();
				$("#AuswahlSpielSpieler").stop().css("opacity", 1);
			});
			if(data.data.GameStatus === "boarding"){
				this._afterGame.hide();
				this._lounge.show(data.data);
			}
		}else{
			$("#AuswahlSpielSpieler_info").html(data.message);
			$("#AuswahlSpielSpieler_info").show();
			$("#AuswahlSpielSpieler_info").stop().animate({"z-index":0}, 5000,
			function(){
				$("#AuswahlSpielSpieler_info").stop().hide();
			});
			this.resetConnectForm();
		}
	}.bind(this));
	
	$("#spiel_erID").val("Verbinde...");
	
	$("#AuswahlSpielSpieler #spiel_erID").prop("disabled", true);
	$("#AuswahlSpielSpieler button").prop("disabled", true);
	$("#spiel_erID").prop("readonly", true);
	$("#AuswahlSpielSpieler span").css("text-indent","-10000px");	
};

/**
 * Display verfolgt ein Profil, anhand des übergebenden Namens
 *
 * @method connectToProfilByName
 * @param {String} name
 */
Display.prototype.connectToProfilByName = function(name){
	$.getJSON( "/api/profil/byname/"+encodeURIComponent(name), function(data) {
		var id = data ? data.ProfilID : null; 		
		this.connectToProfil(id);
	}.bind(this));
};

/**
 * Display verfolgt ein Profil, anhand der übergebende ID
 * 
 * @method connectToProfil
 * @param {Number} id
 */
Display.prototype.connectToProfil = function(id){
	this.lastHash = "#profil/"+id;
	window.location.hash = "#profil/"+id;
	
	this._socket.emit('connectToProfil', {ProfilID: id}, function (data) {
		if(data.ok === true){
			$("#AuswahlSpielSpieler").stop().animate({
				"opacity":1
			}, 250, function(){
				$("#AuswahlSpielSpieler").hide();
				$("#AuswahlSpielSpieler").stop().css("opacity", 1);
			});
			
			this._spieler = data.data;
			if(this._spieler.isLoggedInGame){
				this.connectToSpiel(this._spieler.SpielID);
			}else{
				this.showMessage("<h1>Verbunden</h1> <p>Sie verfolgen das Profil von "+data.data.Name+".</p><p id='profil_status'></p>");
			}	
		}else{
			$("#AuswahlSpielSpieler_info").html(data.message);
			$("#AuswahlSpielSpieler_info").show();
			$("#AuswahlSpielSpieler_info").stop().animate(
				{ "z-index": 0 }, 
				5000,
				function(){
					$("#AuswahlSpielSpieler_info").stop().hide();
				}
			);
			this.resetConnectForm();
		}
	}.bind(this));
	
	$("#spiel_erID").val("Verbinde...");
	
	$("#AuswahlSpielSpieler #spiel_erID").prop("disabled", true);
	$("#AuswahlSpielSpieler button").prop("disabled", true);
	$("#spiel_erID").prop("readonly", true);
	$("#AuswahlSpielSpieler span").css("text-indent","-10000px");
};

/**
 * Bindet Verbindung
 *
 * @method bindConnect
 */
Display.prototype.bindConnect = function(){
		
	$("#AuswahlSpielSpieler #verbinden_spiel").on("click", function(event){
		if($("#spiel_erID").val() == ""){$("#spiel_erID").focus();return;}
		
		this.connectToSpiel(parseInt($("#spiel_erID").val()));
	}.bind(this));
	
	$("#AuswahlSpielSpieler #verbinden_spieler").on("click", function(event){
		if($("#spiel_erID").val() == ""){$("#spiel_erID").focus();return;} 
		
		this.connectToProfilByName($("#spiel_erID").val());
	}.bind(this));
	
	$("#AuswahlSpielSpieler").on("submit", function(event){
		var value = $("#spiel_erID").val();
		if($.isNumeric(value)){
			$("#AuswahlSpielSpieler #verbinden_spiel").click();
		}else{
			$("#AuswahlSpielSpieler #verbinden_spieler").click();
		}
	});
};

/**
 * Setzt das Verbindung Formular zurück
 *
 * @method resetConnectForm
 */
Display.prototype.resetConnectForm = function(){
	$("#spiel_erID").val("");
	$("#AuswahlSpielSpieler button").prop("disabled", false);
	$("#AuswahlSpielSpieler #spiel_erID").prop("disabled", false);
	$("#spiel_erID").prop("readonly", false); 
	$("#AuswahlSpielSpieler span").css("text-indent","0px");
	$("#spiel_erID").focus();
};

/**
 * @method showGame
 */
Display.prototype.showGame = function(){
	$("#display").show();
	this._afterGame.hide();
	$("#AuswahlSpielSpieler").hide();
};

/**
 * @method hideAll
 */
Display.prototype.hideAll = function(){
	$("#display").hide();
	$("#AuswahlSpielSpieler").hide();
	this._afterGame.hide();
};

/**
 * @method hideGame
 */
Display.prototype.hideGame = function(){
	$("#display").hide();
};
