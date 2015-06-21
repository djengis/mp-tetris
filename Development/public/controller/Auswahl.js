'use strict';

/**
 * Konsturktor für Auswahl
 *
 * @module controller
 * @namespace controller
 * @class Auswahl
 * @constructor
 */
function Auswahl(){
	/**
	 * @property _socket
	 * @type Socket
	 * @default null
	 * @private
	 */
	this._socket = null;
	
	/**
	 * @property _controller
	 * @type controller.Controller
	 * @default null
	 * @private
	 */
	this._controller = null;
	
	/**
	 * @property _isTouch
	 * @type Boolean
	 * @private
	 */
	this._isTouch = !!('ontouchstart' in window);
	
	/**
	 * @property _chat
	 * @type controller.Chat
	 * @private
	 */
	this._chat = null;
}

/**
  * Initalisiert Auswahl
  *
  * @method init
  * @param {controller.Controller} controller
  */
Auswahl.prototype.init = function(controller){
	this._controller = controller;
	this._socket = this._controller.getSocket();
	this._chat = new Chat(this._socket);
	
	this.updateProfillist();
	this.updateGamelist();
	
	this._initListeners();
	this._bindSocketEvents();
};

/**
  * Erstellt Profil, anhand eines JSON Objekt
  *
  * @method createProfil
  * @async
  * @param {JSON} data
  * @param {Function} callback
  */
Auswahl.prototype.createProfil = function(data, callback){
	this._socket.emit('createPlayer', data, function(data, fn){
		callback(data);
	});
};

/**
  * Erstellt Spiel, anhand eines JSON Objekt
  *
  * @method createGame
  * @async
  * @param {JSON} data
  * @param {Function} callback
  */
Auswahl.prototype.createGame = function(data, callback){
	this._socket.emit('createGame', data, function(data, fn){
		callback(data);
	}.bind(this));
};

/**
  * Zeigt Auswahlansicht für Spiele an
  *
  * @method showLevelauswahl
  */
Auswahl.prototype.showLevelauswahl = function(){
	this._controller.deselectSpiel();
	this._controller.hide();
	$("#gameselect").show();
	$("#auswahl").show();
	$("#playerselect").hide();
	$("#gameselect .element").removeClass("game_lounge"); 
	$("#gameselect .aus_dem_spiel_austreten").hide();
	$("#gameselect .spiel_starten").hide();
	$("#gameselect .spiel_beitreten").show();
	$("#abmelden_button").show();
	$("#gameselect").css("overflow","");
	$("body").scrollLeft(0);
	$("#gameselect .lounge_element, #gameselect .lounge_element_admin").hide();
	$("#"+this._chat.getRootId()).remove();
};

/**
  * Zeigt Auswahlansicht für Profile an
  *
  * @method showProfilauswahl
  */
Auswahl.prototype.showProfilauswahl = function(){
	this._controller.deselectSpiel();
	this._controller.hide();
	$("#gameselect").hide();
	$("#auswahl").show();
	$("#playerselect").show();
	$("#gameselect .element").removeClass("game_lounge");  
	$("#gameselect .aus_dem_spiel_austreten").hide();
	$("#gameselect .spiel_starten").hide();
	$("#gameselect .spiel_beitreten").show();
	$("#gameselect .lounge_element, #gameselect .lounge_element_admin").hide();
	$("body").scrollLeft(0);
	$("#"+this._chat.getRootId()).remove();
};

/**
  * Zeigt die Spiele Lounge an
  *
  * @method showLounge
  * @param {JSON} data
  */
Auswahl.prototype.showLounge = function(data){
	this._controller._game_selected = data.SpielID;
	$("#gameselect").show();
	$("#gameselect").css("overflow","hidden");
	$("#playerselect").hide();
	
	$("#gameselect .element").removeClass("game_lounge"); 
	$("#game_"+data.SpielID+".element").addClass("game_lounge");
	$("#gameselect .aus_dem_spiel_austreten").show();
	$("#gameselect .spiel_starten").show();
	$("#gameselect .spiel_beitreten").hide();
	$("#game_"+data.SpielID+".element").removeClass("button");
	$("#gameselect .lounge_element").show();
	
	$("#gameselect .lounge_element_admin").hide();
	if(this._controller._profil_id === data.ErstellerId){
		$("#gameselect .lounge_element_admin").show();
	}
	$("body").scrollLeft(0);
	
	// CHAT
	$("#"+this._chat.getRootId()).remove();
	this._chat.setName(this._controller.getProfil().name);
	$("#game_"+data.SpielID+".element").append(this._chat.getRootHtml());
};

/**
  * Bindet Socket Events
  *
  * @method _bindSocketEvents
  * @private
  */
Auswahl.prototype._bindSocketEvents = function(){

	/* Spiel */
	
	this._socket.on(LIST_EVENT.SpielAdded, function(data) {
		this.addGameToSelection(data, false);
	}.bind(this));
	
	this._socket.on(LIST_EVENT.SpielChange, function(data) {
		this.changeGameInSelection(data);
	}.bind(this));
	
	this._socket.on(LIST_EVENT.SpielDeleted, function(data) {
		this.deleteGameInSelection(data);
	}.bind(this));
	
	/* Profil */
	
	this._socket.on(LIST_EVENT.ProfilAdded, function(data) {
		this.addProfilToSelection(data, false);
	}.bind(this));
	
	this._socket.on(LIST_EVENT.ProfilChange, function(data) {
		this.changeProfilInSelection(data);
	}.bind(this));
	
	this._socket.on(LIST_EVENT.ProfilDeleted, function(data) {
		this.deleteProfilInSelection(data);
	}.bind(this));
};

/**
  * Aktualisiert die Profil Auswahlliste
  *
  * @method updateProfillist
  * @param {Function} callback
  */
Auswahl.prototype.updateProfillist = function(callback){
	this._socket.emit(LIST_EVENT.UpdateProfilList, {}, function(table) {
		var row;		
		if(table.length){
			for(row in table){
				row = table[row];
				if($("#player_"+row.ProfilID).length){continue;} 
				this.addProfilToSelection(row);
			}
		}else{
			// Keine Profil vorhanden  
		}
	}.bind(this));
};

/**
  * Aktualisiert die Spiele Auswahlliste
  *
  * @method updateGamelist
  * @async
  * @param {Function} callback
  */
Auswahl.prototype.updateGamelist = function(callback){
	this._socket.emit(LIST_EVENT.UpdateSpielList, {}, function(table) {	
		var row;
		if(table.length){
			for(row in table){
				row = table[row];
				if($("#game_"+row.SpielID).length){continue;} 
				this.addGameToSelection(row);
			}
		}else{
			// Keine Spiele vorhanden 
		}
	}.bind(this));
};

/**
  * Fügt das Spiel der Auswahlansicht hinzu.
  *
  * @method addGameToSelection
  * @param {JSON} row Daten
  * @optional {Boolean} statisch=false
  */
Auswahl.prototype.addGameToSelection = function(row, statisch){
	if(statisch === undefined){ statisch = true; }
	
	var html = "";
	var color = ""; 
	var beitraetbar = false;
	
	var text = "%";
	
	var lounge_head = "In der Lounge";
	
	switch(row.GameStatus){
		case "waiting":
			text = "???";
			color = "btn_red";
			break;
		case "ended":
		case "aborted":
		 	text = "Zuende";
			color = "btn_red";
			lounge_head = "Im Spiel waren";
			break;
			
		case "playing":
		case "countdown":
			text = "Läuft";
			color = "btn_green";
			lounge_head = "Im Spiel";
			break;

		case "boarded":
			text = "Voll";
			color = "btn_green";
			break;
			
		case "boarding":
			beitraetbar = true;
			text = "Beitreten";
			color = "";
			break;
	}
	
	var GameStatus = row.GameStatus;
	var ErstellerName = row.ErstellerName;
	var SpielID = row.SpielID;
	var lounge;
	
	if(row.GameStatus == "ended" || row.GameStatus == "playing" || row.GameStatus == "countdown" || row.GameStatus == "aborted"){
		lounge = this._htmlMakeLoungeList(0, row.MitProfil);
	}else{
		lounge = this._htmlMakeLoungeList(row.MaxProfil, row.MitProfil);
	}
	var button1 = this._htmlGetRoundButton(text, "spiel_beitreten");
	var button2 = this._htmlGetRoundButton("austreten", "aus_dem_spiel_austreten lounge_element");
	var button3 = this._htmlGetRoundButton("Spiel starten", "spiel_starten lounge_element_admin");
	
	html += '<div class="element button spiel_eintreten '+color+'" id="game_'+row.SpielID+'">';
	html += "	<p>Identifikationsnummer</p>";
	html += "	<strong class='SpielID'>"+SpielID+"</strong>";
	html += "	<p>Status</p>";
	html += "	<strong class='GameStatus'>"+GameStatus+"</strong>";
	html += "	<p>Erstellt von</p>";
	html += "	<strong class='ErstellerName'>"+ErstellerName+"</strong>";
	html += "	<p class='lounge_head'>"+lounge_head+"</p>";
	html += "	<ul class='lounge'>"+lounge+"</ul>";
	html += "	"+button1;
	html += "	"+button2;
	html += "	"+button3;
	html += '</div>';
	
	var jElement = $(html);
	
	if(statisch){
		// füge vor dem letzten ein
		$("#gameselect > div:last-child()").before(jElement);
	}else{
		// überspringe Neues Spiel und Abmelden und füge danach ein
		$("#gameselect > div:nth-child(2)").after(jElement);
		
		var beeaaaaam = $("<div class='beeaaaaam'></div>");
		$("#gameselect #game_"+row.SpielID).append(beeaaaaam);
		beeaaaaam.animate({opacity:0},200, function(){
			$(this).remove();
		});
	}
	
	// stuffs
	
	$(".aus_dem_spiel_austreten", jElement).hide();
	$(".spiel_starten", jElement).hide();
	
	$(jElement).data("beitraetbar", beitraetbar);
	$(jElement).data("SpielID", row.SpielID);
};

/**
  * Ändert die Darstellung des Spiels in der Auswahlansicht, anhand des Status des Spieles.
  *	
  * * waiting:				Farbe rot, 		Text '???'
  * * ended, aborted:		Farbe rot,		Text 'Zuende'
  * * playing, countdown:	Farbe grün,		Text 'Läuft'
  * * boarded:				Farbe grün,		Text 'Voll'
  * * boarding:				Farbe grün,		Text 'Beitreten'
  *
  * @method changeGameInSelection
  * @param {JSON} data
  */
Auswahl.prototype.changeGameInSelection = function(data){
	var elementId = "#game_"+data.SpielID;

	Util.setIfChanged($(".SpielID", elementId),data.SpielID);
	Util.setIfChanged($(".GameStatus", elementId), data.GameStatus);
	Util.setIfChanged($(".ErstellerName", elementId),data.ErstellerName);
	
	
	if(data.GameStatus == "ended" || data.GameStatus == "playing" || data.GameStatus == "countdown" || data.GameStatus == "aborted"){
		Util.setIfChanged($(".lounge", elementId),this._htmlMakeLoungeList(0, data.MitProfil), true);
	}else{
		Util.setIfChanged($(".lounge", elementId),this._htmlMakeLoungeList(data.MaxProfil, data.MitProfil), true);
	}
	
	
	$(elementId).data("beitraetbar", false);
	
	switch(data.GameStatus){
		case "waiting":
			$(elementId+" .spiel_beitreten .button_text").html("???");
			$(elementId).removeClass("btn_green");
			$(elementId).addClass("btn_red");
			break;
			
		case "ended":
		case "aborted":
			$(elementId+" .spiel_beitreten .button_text").html("Zuende");
			$(elementId).removeClass("btn_green");
			$(elementId).addClass("btn_red");
			$(elementId+" .lounge_head").text("Im Spiel waren");
			break;
			
		case "playing":
		case "countdown":
			$(elementId+" .spiel_beitreten .button_text").html("Läuft");
			$(elementId).addClass("btn_green");
			$(elementId).removeClass("btn_red");
			$(elementId+" .lounge_head").text("Im Spiel");
			break;
			
		case "boarded":
			$(elementId+" .spiel_beitreten .button_text").html("Voll");
			$(elementId).addClass("btn_green");
			$(elementId).removeClass("btn_red");
			break;
			
		case "boarding":
			$(elementId+" .spiel_beitreten .button_text").html("Beitreten");
			$(elementId).removeClass("btn_green");
			$(elementId).removeClass("btn_red");
			$(elementId).data("beitraetbar", true);
			break;
	}
};

/**
  * Spieler befindete sich in einem Spiel, welches der Ersteller entfernt hat.
  *
  * @method deleteGameInSelection
  * @param {JSON} data
  */
Auswahl.prototype.deleteGameInSelection = function(data){
	if(data.SpielID === this._controller.getGameSelected() && data.ErstellerId != this._controller.getProfilId()){
		console.log("BAM, Spiel unter den Füßen entfernt!");
		this._controller.deselectSpiel();
	}
	
	$("#game_"+data.SpielID).remove();
};

/**
  * Fügt das übergebene Profil, mit der Statistik, der Profil-Auswahlansicht hinzu
  *
  * @method addProfilToSelection
  * @param {JSON} row Daten
  * @optional {Boolean} statisch=true
  */
Auswahl.prototype.addProfilToSelection = function(row, statisch){
	if(statisch === undefined){ statisch = true; }
	
	var html = "";
	
	var color = ""; 
	var text = "Profil auswählen";
	
	if(row.isOnline || row.Name === "online"){
		color = "btn_green";
		text = "Profil online";
	}
	
	html += '<div class="element button '+color+'" id="player_'+row.ProfilID+'">';
	html += '	<h2 class="Name">'+row.Name+"</h2>";
	html += "	<p>Angemeldet seit dem</p>";
	html += "	<strong class='AnmeldeDatum'>"+Util.formatTimestamp(row.AnmeldeDatum)+"</strong>";
	html += "	<p>Letzter Login am</p>";
	html += "	<strong class='LetzteAnmeldung'>"+(Util.formatTimestamp(row.LetzteAnmeldung)===null?"Noch nie":Util.formatTimestamp(row.LetzteAnmeldung))+"</strong>";
	html += "	<p>Gespielte Spiele:</p>";
	html += "	<strong class='gespielteSpiele'>"+row.gespielteSpiele+"</strong>";
	html += "	<p>Gesetzte Steine:</p>";
	html += "	<strong class='gesetzteSteine'>"+row.gesetzteSteine+"</strong>";
	html += "	<div class='roundButton selectProfil'><div class='roundButton_top'></div><span class='button_text'>"+text+"</span><div class='roundButton_bottom'></div></div>";
	html += '</div>';
	
	var jElement = $(html);
	
	if(statisch){
		// füge vor dem letzten ein
		$("#playerselect > div:last-child()").before(jElement);
	}else{
		// überspringe Neues Profil und Raus und füge danach ein
		$("#playerselect > div:nth-child(2)").after(jElement);
		
		var beeaaaaam = $("<div class='beeaaaaam'></div>");
		$("#playerselect #player_"+row.ProfilID).append(beeaaaaam);
		beeaaaaam.animate({opacity:0},200, function(){
			$(this).remove();
		});
	}
	
	$(".selectProfil", jElement).data("ProfilID", row.ProfilID);
};

/**
  * Ändert die Darstellung des übergebenen Profil in Auswahlansicht.
  * Profil ist online - Button ist grün und Text lautet 'Profil online'
  * ansonstens - Farbe grau und Text 'Profil auswählen' 
  *
  * @method changeProfilInSelection
  * @param {JSON} data
  */
Auswahl.prototype.changeProfilInSelection = function(data){
	var elementId = "#player_"+data.ProfilID;

	if(data.isOnline){
		$(elementId).addClass("btn_green");
		$(".button_text", elementId).text("Profil online");
	}else{
		$(elementId).removeClass("btn_green");
		$(".button_text", elementId).text("Profil auswählen");
	}
	
	Util.setIfChanged($(".Name", elementId),data.Name);
	Util.setIfChanged($(".AnmeldeDatum", elementId),Util.formatTimestamp(data.AnmeldeDatum));
	Util.setIfChanged($(".LetzteAnmeldung", elementId),Util.formatTimestamp(data.LetzteAnmeldung)===null?"Noch nie":Util.formatTimestamp(data.LetzteAnmeldung));
	Util.setIfChanged($(".gespielteSpiele", elementId),data.gespielteSpiele);
	Util.setIfChanged($(".gesetzteSteine", elementId),data.gesetzteSteine);
};

/**
  * Entfernt Profil von Profil-Auswahlansicht
  *
  * @method deleteProfilInSelection
  * @param {JSON} data
  */
Auswahl.prototype.deleteProfilInSelection = function(data){
	$("#player_"+data.ProfilID).remove();
}

/**
 * Spieler erstellt ein neues Spiel und wird zur Lounge weitergeleitet.
 *
 * @method submitCreateGame
 */
Auswahl.prototype.submitCreateGame = function(){
	this.createGame({MaxProfil: 4, SpielTypID: 1}, function(data){	
		if(data.ok===true){
			$("#new_game_button button[type='reset']").mouseup();
			this.flash();
			this.showLounge(data);
		}else{
			alert(data.message);
		}
	}.bind(this));
};

/**
 * Spieler erstellt ein neues Profil, anschließend wird er zur Spiele-Auswahlansicht weitergeleitet.
 *
 * @method submitCreateProfil
 */
Auswahl.prototype.submitCreateProfil = function(){
	var name = $("#new_name").val();	
	this.createProfil({"name": name}, function(data){	
		if(data.ok===true){
			$("#new_player_button button[type='reset']").mouseup();
			this._controller.selectProfil(data.ProfilID, function(){
				this.showLevelauswahl();
			}.bind(this));
		}else{
			alert(data.message);
		}
	}.bind(this));
};

/**
 * Meldet Profil ab
 *
 * @method abmelden
 */
Auswahl.prototype.abmelden = function(){
	this._controller.disselectProfil();
	this.flash();
	this.showProfilauswahl();
};

/**
 * Leitet zur Startseite zurück.
 *
 * @method backToMain
 */
Auswahl.prototype.backToMain = function(){
	window.location.href = "/";
};

/**
 * Spieler wählt ein Spiel aus. Dabei wird im die Lounge des Spieles angezeigt.
 *
 * @method selectLounge
 * @param {Number} SpielID
 */
Auswahl.prototype.selectLounge = function(SpielID){
	var jElement = $("#game_"+SpielID);
	
	if(!jElement.data("beitraetbar")){
		return;
	}
	
	this._controller.selectGame(SpielID, function(result){
		if(result.ok === true){
			this.showLounge(result.data);
			this.flash();
		}else{
			alert(result.message);
		}
	}.bind(this));
};

/**
 * Spieler verlässt die Lounge und die Spiele-Auswahlansicht erscheint.
 *
 * @method disselectLounge
 * @param {Number} SpielID
 */
Auswahl.prototype.disselectLounge = function(SpielID){
		
	this._controller.leaveGame(SpielID, function(result){
		if(result.ok === true){
			this.showLevelauswahl();
			this.flash();
		}else{
			alert(result.message);
		}
	}.bind(this)); 
	return false;
};

/**
 * Spiel wird gestartet.
 *
 * @method startGameFromLounge
 * @param {Number} SpielID
 */
Auswahl.prototype.startGameFromLounge = function(SpielID){
	this._controller.startGame(SpielID, function(result){
		if(result.ok === true){
			this.flash();
			// ab hier übernimmt der Controller
		}else{
			alert(result.message);
		}
	}.bind(this));
	return false;
};

/**
 * 
 *
 * @method showCreateGame
 */
Auswahl.prototype.showCreateGame = function(){
	$("body").scrollLeft(0);
	// es gibt hier noch nichts -> direkt erstellen
	// leite direkt den click auf den Button ein
	$("#new_game_button form").submit(); 
	$(this).hide();
};

/**
 * Spiel wird gecancelt.
 *
 * @method cancelCreateGame
 */
Auswahl.prototype.cancelCreateGame = function(){
	$("#new_game_button").removeClass("register");
	$("#new_game_button").addClass("button");
	$("#new_game_button input").val("");
	$("#new_game_button .plusButton").show();
	$("#abmelden_button").show();
};

/**
 * Ansicht zur Erstellung eines neuen Profils
 *
 * @method showCreateProfil
 */
Auswahl.prototype.showCreateProfil = function(){
	$("body").scrollLeft(0);
	$("#new_player_button").addClass("register");
	$("#new_player_button").removeClass("button");
	$("#new_player_button").removeClass("on");
	$("#new_player_button .plusButton").hide();
	$("#abmelden_button").hide();
	$("#hauptmenue_button").hide();
	$("#new_player_button").siblings("*").hide();
};

/**
 * Versteckt die Ansicht zur Erstellung eines neuen Profils
 *
 * @method cancelCreateProfil
 */
Auswahl.prototype.cancelCreateProfil = function(){
	$("#new_player_button").removeClass("register");
	$("#new_player_button").addClass("button");
	$("#new_player_button input").val("");
	$("#new_player_button .plusButton").show();
	$("#new_player_button").siblings("*").show();
};

/**
 * Profil wird ausgewählt, dem Spieler wird die Spiele-Auswahlansicht angezeigt
 *
 * @method selectProfil
 * @param {Number} ProfilID
 */
Auswahl.prototype.selectProfil = function(ProfilID){
	if(!$('#player_'+ProfilID).hasClass("btn_green")){
		this._controller.selectProfil(ProfilID, function(data){
			this.showLevelauswahl();
			this.flash();
		}.bind(this));
	}
};

/**
 * Initalisiert Listeners
 *
 * @method _initListeners
 * @private
 */
Auswahl.prototype._initListeners = function(){
	
	this._chat.delegate();
	
	/* Spiel */
	
	// Spiel erstellen anzeigen
	$('#new_game_button .plusButton').on("mouseup", function(event){
		this.showCreateGame();
		event.preventDefault(); 
	}.bind(this));
	
	// Spiel erstellen submit
	$("#new_game_button form").on("submit", function(event){
		this.submitCreateGame();
		event.preventDefault(); 
	}.bind(this));
	
	// Spiel erstellen abbrechen
	$("#new_game_button button[type='reset']").on("mouseup", function(event){
		this.cancelCreateGame();
		event.preventDefault(); 
	}.bind(this));
	
	// Spiel starten
	$("#gameselect").delegate(".spiel_starten", "mouseup", function(event){
		this.startGameFromLounge($(event.currentTarget).parent().data("SpielID"));
		event.preventDefault();
	}.bind(this));	
	
	// Lounge eintreten
	$("#gameselect").delegate(".spiel_beitreten", "mouseup", function(event){
		this.selectLounge($(event.currentTarget).parent().data("SpielID"));
		event.preventDefault();
	}.bind(this));
	
	// Lounge austreten
	$("#gameselect").delegate(".aus_dem_spiel_austreten", "mouseup", function(event){	
		this.disselectLounge($(event.currentTarget).parent().data("SpielID"));
		event.preventDefault();
	}.bind(this));
	
	
	/* Profil */
	
	// Profil erstellen anzeigen
	$('#new_player_button .plusButton').on("mouseup", function(event){
		this.showCreateProfil();
		event.preventDefault(); 
	}.bind(this));
	
	// Profil erstellen abbrechen
	$("#new_player_button button[type='reset']").on("mouseup", function(event){
		this.cancelCreateProfil();
		event.preventDefault(); 
	}.bind(this));
	
	// Profil erstellen submit
	$("#new_player_button form").on("submit", function(event){
		this.submitCreateProfil();
		event.preventDefault(); 
	}.bind(this));
	
	// Profil abmelden
	$("#abmelden_button").on("click", function(){	
		this.abmelden();
		event.preventDefault();
	}.bind(this));
	
	// Profil auswählen
	$("#playerselect").delegate('.selectProfil', "mouseup", function(event){
		this.selectProfil($(event.currentTarget).data("ProfilID"));
		event.preventDefault(); 
	}.bind(this));
	
	// zurück
	$("#hauptmenue_button").on("click", function(){	
		this.backToMain();
		event.preventDefault();
	}.bind(this));
	
	
	/* Weiteres */
	
	// Horizontales scrollen, bei Vertialem scrollen
	if(!this._isTouch){
		$('body').bind('mousewheel', function(event, _trash) {
	        var delta = event.originalEvent.wheelDelta;
	        $("body").scrollLeft($("body").scrollLeft() - (delta/8));
	        event.preventDefault();
	    });
	}
		
	// allg. wenn man auf einen button click oder tippt oder was auch immer.
	$("body").delegate(".roundButton, *[type='button']", "touchstart mousedown", function(event){
		$(this).addClass("on");
	});
	
	$("body").delegate(".roundButton, *[type='button']", "touchend mouseup", function(event){
		$(this).removeClass("on");	
	});
	
};

/**
  * Erstellt Button mit abgerundeten Ecken
  *
  * @method _htmlGetRoundButton
  * @param {String} text
  * @param {String} clas
  * @private
  */
Auswahl.prototype._htmlGetRoundButton = function(text, clas){
	return "<div class='"+clas+" roundButton'><div class='roundButton_top'></div><span class='button_text'>"+text+"</span><div class='roundButton_bottom'></div></div>";
};

/**
  * Erstellt Spielerliste für die Lounge
  *
  * @method _htmlMakeLoungeList
  * @param {Number} MaxProfil
  * @param {Array} ProfilIn
  * @private
  * @example _htmlMakeLoungeList(4, [{...}, {...}]);
  */
Auswahl.prototype._htmlMakeLoungeList = function(MaxProfil, ProfilIn){ // n, array
	var returnString = "";
	var i,c;
	for(i in ProfilIn){
		c = ProfilIn[i].color;
		//display:none;
		returnString += "<li><span class='lounge_element col' style='background-color:rgb("+c[0]+","+c[1]+","+c[2]+");'></span><i>"+(ProfilIn[i].Name)+"</i></li>"; // $.text führt zu einem stackoverflow.. wtf?..
	}
	for(i = ProfilIn.length; i < MaxProfil; i++){
		returnString += "<li><i>frei</i></li>";
	}
	return returnString;
};

/**
  * Animation
  *
  * @method flash
  */
Auswahl.prototype.flash = function(){
	$("body").stop().css({opacity: 0.0}).animate({
		opacity: 1
	}, 150);
};

/**
  * Versteckt Controller und zeigt Auswahl
  *
  * @method show
  */
Auswahl.prototype.show = function(){
	this._controller.hide();
	$("#auswahl").show();
};

/**
  * Versteckt Auswahl
  *
  * @method hide
  */
Auswahl.prototype.hide = function(){
	$("#auswahl").hide();
};
