'use strict';

var CONFIG = require('./../../../global/config.js').CONFIG;
var BUTTON = require('./../../../global/enum_controller_buttons.js').BUTTON;
var BUTTONTYPE = require('./../../../global/enum_controller_buttons.js').BUTTONTYPE;

var AbstractGame = require('../AbstractGame.js').AbstractGame;
var Spieler = require('./Spieler.js').Spieler;
var Block = require('./Block.js').Block;

/**
 * @module server
 * @namespace server.games
 *
 * @class SpielAufZeit
 * @constructor
 * @extends AbstractGame
 *
 * @param {Game} game
 */
function SpielAufZeit(game){
	/**
	 * @property _game
	 * @type server.Game
	 * @private
	 */
	this._game = game;
	
	/**
	 * @property _spieler
	 * @type Array
	 * @default []
	 * @private
	 */
	this._spieler = [];
	
	/**
	 * @property _statistics
	 * @type JSON
	 * @default {...}
	 * @private
	 */
	 this._statistics = {};
	 this._statistics.spieler = {};
	
	/**
	 * @property _w
	 * @type Number
	 * @default CONFIG.Games.SpielAufZeit.W
	 * @private
	 */
	this._w = CONFIG.Games.SpielAufZeit.W;
	
	/**
	 * @property _h
	 * @type Number
	 * @default CONFIG.Games.SpielAufZeit.H
	 * @private
	 */
	this._h = CONFIG.Games.SpielAufZeit.H;
	
	/**
	 * @property _field
	 * @type Array
	 * @default []
	 * @private
	 */
	this._field = [];
	
	/**
	 * @property _deathTicker
	 * @type Number
	 * @default 0
	 * @private
	 */
	this._deathTicker = 0;
} 
SpielAufZeit.prototype = new AbstractGame(null);
SpielAufZeit.prototype.constructor = AbstractGame;

/**
 * @method getH
 *
 * @return {Number}
 */
SpielAufZeit.prototype.getH = function(){
	return this._h;
};

/**
 * @method getW
 *
 * @return {Number}
 */
SpielAufZeit.prototype.getW = function(){
	return this._w;	
};

/**
 * @method addMitspieler
 *
 * @param {server.Profil} profil
 * @param {Array} color
 */
SpielAufZeit.prototype.addMitspieler = function(profil, color){
	var controller = profil.getController();
	var spieler = new Spieler(this, controller);
	
	spieler.setCursor([10, 0]); //TODO richtige werte.. -> in der INIT, hier raus
	spieler.setColor(color);
	this._spieler.push(spieler);
	
	//
	this._statistics.spieler[spieler.getId()] = {}
	this._statistics.spieler[spieler.getId()].punkte = 0;
	this._statistics.spieler[spieler.getId()].buttonAt = {};
	this._statistics.spieler[spieler.getId()].punkteAt = {};
	this._statistics.spieler[spieler.getId()].punkteAt[this._t()] = 0;
};

/**
 * @method _init_t
 * @private
 */
SpielAufZeit.prototype._init_t = function(){
	this._t_start = (new Date()).getTime();
};

/**
 * @method _t
 * @return {Date}
 * @private
 */
SpielAufZeit.prototype._t = function(){
	return (new Date()).getTime()-this._t_start;
};

/**
 * @method init
 */
SpielAufZeit.prototype.init = /*overwride*/ function(){ 
	var x, y, row, table, i;

	// init _field
	table = [];
	for(y = 0; y < this._h; y++){
		row = [];
		for(x = 0; x < this._w; x++){
			row.push(null);
		}
		table.push(row);
	}
	this._field = table;
	
	this._init_t();
	this._statistics.gameStarts = this._t(); // wow, das spiel startet bei 0 ms... respect... such info..
};

/**
  @method tick
  */
SpielAufZeit.prototype.tick = /*overwride*/ function(){
	
	var i, doesThing, j, spieler;
	
	doesThing = false;
	
	// nach dem tod eines Spieler, punkte jeden tack vermindern
	if((++this._deathTicker%60) == 0){
		for(i in this._spieler){
			spieler = this._spieler[i];
			if(!spieler.compute()) continue;
			if(spieler.isDeath()){
				spieler.addPunkte(-1); // -1 Punkt, beim setzten
				this._statistics.spieler[spieler.getId()].punkteAt[this._t()] = spieler.getPunkte();
				spieler.emitToController("SpielPunkte", spieler.getPunkte());
				this.emitToDisplays("SpielSpielerPunkte", spieler.getEmitData()); 
			}
		}
	}
	
	// spielerklotz und alles was damit zusammenhängt
	for(i in this._spieler){
		if(!this._spieler[i].compute()) continue;
		if(this._spieler[i].ticker()){
			this.nextFrame(this._spieler[i]);
			doesThing = true;
		}
	}
	
	if(doesThing){
		this.emitToDisplays("SpielFrame", this.getEmitData());	
	}
};

/**
 * @method calcPlatzierungen
 */
SpielAufZeit.prototype.calcPlatzierungen = function(){
	var i, j, change;
	change = false;
	// re-calc platzierungen
	var p = [];
	for(i in this._spieler){
		p.push(this._spieler[i].getPunkte());
		this._spieler[i].setPlatz(-1);
	}
	
	p.sort(function (a, b) {
		return b - a;
	});
	
	change = true; // TODO prüfen...
	
	var z = 1;
	for(j in p){
		for(i in this._spieler){
			if(this._spieler[i].getPunkte() == p[j] && this._spieler[i].getPlatz() === -1){
				this._spieler[i].setPlatz(z);
				z++;
			}
		}
	}
	
	if(change){
		this.emitToDisplays("SpielPlatzierung", this.getEmitData().spieler);
	}
}

/**
  * @method nextFrame
  *
  * @param {server.Games.SpielAufZeit.Spieler} spieler
  */
SpielAufZeit.prototype.nextFrame = function(spieler){

	spieler.incrementCursorY();
	if(spieler.getCursorY() > this.getH()){
		spieler.setCursorY(0);
	}
	this.computeField();
	
};

/**
  * @method computeField
  */
SpielAufZeit.prototype.computeField = function(){

	// Cursor-Blockelemente entfernen
	var x, y, i, blockelement, ownField, spieler, id, lines, out;
	
	for(y = 0; y < this._h; y++){
		for(x = 0; x < this._w; x++){
			if(this._field[y][x] !== null){
				if(!this._field[y][x].isSolid()){
					this._field[y][x] = null;
				}
			}
		}
	}
	
	// Cursor-Blockelemente neu setzten
	for(i in this._spieler){
		if(!this._spieler[i].compute()) continue;
		spieler = this._spieler[i];
			if(!spieler.isActive()){
			continue;
		}
		out = false;
		
		blockelement = spieler.getBlockelement();
		var calcColission = this.calcColission(spieler, blockelement)
			
		if(calcColission){
		
			// kollision vorhanden -> einen hoch und solid machen
			spieler.decrementCursorY();
			var darwingPositions = this.drawOnField([spieler.getCursorX(), spieler.getCursorY()], spieler, blockelement, 1);			
			
			// wo wurde er erstellt? etwa außerhalb?
			for(i in darwingPositions){
				if(darwingPositions[i][1] == 0){
					out = true;
				}
			}
			
			// prüfe auf linie
			lines = this.checkForLine();
			
			// es gibt Punkte!
			if(lines.count>0){
				spieler.addLines(1);
				
				spieler.emitToController("SpielSpielerLines", spieler.getLines());
				this.emitToDisplays("SpielSpielerLines", spieler.getEmitData());
				
				if((spieler.getLines()%CONFIG.Games.SpielAufZeit.linesForLevel)==0){
					spieler.addLevel(1);
					spieler.emitToController("SpielSpielerLevel", spieler.getLevel());
					this.emitToDisplays("SpielSpielerLevel", spieler.getEmitData());
				}
				
				if(lines.count>=4){
					spieler.addPunkte(lines.count*10*2);
					this._statistics.spieler[spieler.getId()].punkteAt[this._t()] = spieler.getPunkte();
				}else{
					spieler.addPunkte(lines.count*10);
					this._statistics.spieler[spieler.getId()].punkteAt[this._t()] = spieler.getPunkte();
				}
			}
			
			// entferne die überprüften lines
			if(lines.count>0){
				for(i in lines.line){
					this.removeLine(lines.line[i]);
				}
				this.emitToDisplays("SpielEffect", {type: "lineKill", data: lines});
			}
			
			// punktt fürs setzten eines Steines
			spieler.addPunkte(1); // 1 Punkt, beim setzten
			this._statistics.spieler[spieler.getId()].punkteAt[this._t()] = spieler.getPunkte();
			spieler.emitToController("SpielPunkte", spieler.getPunkte());
			this.emitToDisplays("SpielSpielerPunkte", spieler.getEmitData()); 
			this.emitToDisplays("SpielEffect", {type: "blockSolidate", data: null}); 
			
			if(!out){
				// neuer Stein für den Spieler, wenn der Spieler seinen Stein nicht außerhalb gesetzt hat.
				this.resetCursor(spieler);
			}else{
				// der letzte stein wurde außerhalb gesetzt. -> spieler Raus
				spieler.die();
				this._statistics.spieler[spieler.getId()].died = this._t();
				this._statistics.spieler[spieler.getId()].punkte = spieler.getPunkte();
				spieler.emitToController("SpielSpielerRaus", spieler.getId());
				this.emitToDisplays("SpielSpielerRaus", spieler.getId());
				this.emitToDisplays("SpielEffect", {type: "spielerRaus", data: spieler.getId()});
				
				// wenn es keinen aktiven Spieler mehr gibt, ist das Spiel zuende
				if(this.getActiveSpieler().length === 0){
					this.emitToDisplays("SpielEffect", {type: "SpielEnds", data: null});
					this._statistics.gameEnds = this._t();
					
					this._game.endGame();
				}
			}
			
			//
			this.calcPlatzierungen();
			spieler.emitToController("SpielNextBlock", spieler.getNextBlockelement().getType());
		}else{
			this.drawOnField([spieler.getCursorX(), spieler.getCursorY()], spieler, blockelement, 0);
		}
	}

	// vorschau 
	for(i in this._spieler){
		if(!this._spieler[i].compute()) continue;
		spieler = this._spieler[i];
		if(!spieler.isActive()){
			continue;
		}
		blockelement = spieler.getBlockelement();
		
		x = spieler.getCursorX();
		y = spieler.getCursorY();
		
		// lauf soweit runter, bis es mal knallt, dann wieder einen hoch und 
		// vorschau setzten (falls da nichts ist, also der spielerblock selbst)
		while(!this.calcColission([x, y++], blockelement)); 
		this.drawOnField([x, y-2], spieler, blockelement, 2);
	}
};

/**
  * @method highestLine
  *
  * @return {Number|null}
  */
SpielAufZeit.prototype.highestLine = function(){
	var x, y;
	
	for(y = 0; y < this._field.length; y++){
		for(x = 0; x < this._field[y].length; x++){
			if(this._field[y][x] !== null && this._field[y][x].isSolid()){
				return y;
			}
		}
	}
	
	return null;
};


/**
  * @method getActiveSpieler
  *
  * @return {server.Games.SpielAufZeit.Spieler}
  */
SpielAufZeit.prototype.getActiveSpieler = function(){
	var i, spieler;
	var arr = [];
	for(i in this._spieler){
		if(!this._spieler[i].compute()) continue;
		spieler = this._spieler[i];
		if(spieler.isActive()){
			arr.push(spieler);
		}
	}
	return arr;
};

/**
  * @method removeLine
  *
  * @param {Number} yToKill
  */
SpielAufZeit.prototype.removeLine = function(yToKill){
	var x,y;
	
	for(y = yToKill; y > 0; y--){
		for(x = 0; x < this._field[y].length; x++){
			if(y-1 < 0){
				this._field[y][x] = null;
			}else{
				this._field[y][x] = this._field[y-1][x];
			}
		}
	}
};

/**
  * Prüft, welche Lines zerstört werden würden und gibt dessen Zeilennumer wieder, 
  * setzt dessen destroyed-Wert, falls dest auf true steht (optional, sonst ist dest immer true).
  *
  * @method checkForLine
  *
  * @param {Boolean} dest
  *
  * @return {Array} 
  */
SpielAufZeit.prototype.checkForLine = function(dest){
	if(dest === undefined) dest = true;
	var x,y, lines, lineOK;
	
	lines = {};
	lines.count = 0;
	lines.line = [];
	for(y = 0; y < this._field.length; y++){
		lineOK = true;
		for(x = 0; x < this._field[y].length && lineOK; x++){
			if(this._field[y][x]===null){
				lineOK = false;
			}else{
				if(this._field[y][x].isDestroyed()){
					lineOK = false;
				}
			}
		}
		if(lineOK){
			lines.line.push(y);
			lines.count += 1;
			
			for(x = 0; x < this._field[y].length; x++){
				if(dest){
					this._field[y][x].setDestroyed(true);
				}
			}
		}
	}
	
	return lines;
};


/**
  * @method resetCursor
  *
  * @param {server.Games.SpielAufZeit.Spieler} spieler
  */
SpielAufZeit.prototype.resetCursor = function(spieler){
	spieler.setCursorY(0);
	spieler.nextElement();
	var center_x = this.getW()/2;
	
	// wenn der gegen eine wand geraten ist, verschiebe ihn richtung mitte, bis es nicht mehr der fall ist
	 // nur den ersten prüfen.. genügt.
	while(this.calcColission([spieler.getCursorX(),spieler.getCursorY()], spieler.getBlockelement())[0]==2){
		spieler.setCursorX(spieler.getCursorX()+(spieler.getCursorX() < center_x ? 1 : -1));
	};

	this.drawOnField([spieler.getCursorX(),spieler.getCursorY()],spieler, spieler.getBlockelement(), 0);
};

/**
  * @method isXOut
  *
  * @param {Number} x 
  *
  * @return {Boolean}
  */
SpielAufZeit.prototype.isXOut = function(x){
	return (x<0) || (x>=this.getW());
};

/** 
 * @method calcColission
 *
 * @param {server.Games.SpielAufZeit.Spieler|Array} spielerOrPosition
 * @param {server.Games.SpielAufZeit.Blockelement} blockelement
 *
 * @return {false|Number} 1 = gegen ein anderen Block, 2 = außerhalb des Spielfeldes, 3 = unten auf den Boden
 */
SpielAufZeit.prototype.calcColission = function(spielerOrPosition, blockelement){

	var offsetY, offsetX, ownField,x,y,element;
	ownField = blockelement.getOwnField();

	if(spielerOrPosition instanceof Spieler){
		offsetX = spielerOrPosition.getCursorX();
		offsetY = spielerOrPosition.getCursorY();
	}else{
		offsetX = spielerOrPosition[0];
		offsetY = spielerOrPosition[1];
	}
	
	for(y = 0; y < ownField.length; y++){
		for(x = 0; x < ownField[y].length; x++){
			if(ownField[y][x] === 0){continue;}
			
			if(this._field.length <= (y+offsetY)){
				return [3, y+offsetY];  // unten auf den Boden 
			}
			
			if(this.isXOut(x+offsetX)){
				return [2, y+offsetY]; // außerhalb des Spielfeldes
			}
			
			if(y+offsetY < 0){
				return [4, y+offsetY]; // oben
			}
			
			// mit anderen elementen
			element = this._field[y+offsetY][x+offsetX];
			if(element !== null && element.isSolid()){
				return [1, y+offsetY]; // gegen ein anderen Block
			}
		}	
	}
	
	return false;
};

/**
 * 
 * @method drawOnField
 *
 * @param {Array} xy
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 * @param {server.Games.SpielAufZeit.Blockelement} blockelement
 * @param {Number} typ typ=0: spielerblock, typ=1: solid, typ=2: vorschau
 *
 * @return {Array} positionen, inden gezeichnet wurde
 */
SpielAufZeit.prototype.drawOnField = function(xy, spieler, blockelement, typ){
	var offsetY, offsetX,x,y,id, ownField;
	var darwingPositions = [];
	
	id = spieler.getId();

	offsetX = xy[0];
	offsetY = xy[1];
	
	ownField = blockelement.getOwnField();
	
	for(y = 0; y < ownField.length; y++){
		for(x = 0; x < ownField[y].length; x++){
		
			if(ownField[y][x] === 0){continue;}
			
			if((y+offsetY)<0){
				continue;
			}
			if((x+offsetX)<0){
				continue;
			}
			
			if(this._field.length <= (y+offsetY)){ 
				continue; 
			}
			if(this._field[y+offsetY].length <= (x+offsetX)){
				continue;
			}
			
			if(typ===2){
				// vorschau
				if(this._field[y+offsetY][x+offsetX] === null){
					this._field[y+offsetY][x+offsetX] = new Block(spieler);
					this._field[y+offsetY][x+offsetX].setVorschau(true);
				}
			}
			
			if(typ===1){
				 // solid
				this._field[y+offsetY][x+offsetX] = new Block(spieler);
				this._field[y+offsetY][x+offsetX].setSolid(true);			
			}
			
			if(typ===0){
				// spielerblock
				this._field[y+offsetY][x+offsetX] = new Block(spieler);
			}
			
			darwingPositions.push([x+offsetX,y+offsetY]);
		}	
	}
	
	return darwingPositions;
};

/**
 * @method buttonLeftDown
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 */
SpielAufZeit.prototype.buttonLeftDown = function(spieler){
	if(!this.calcColission([spieler.getCursorX()-1,spieler.getCursorY()], spieler.getBlockelement())){
		spieler.decrementCursorX();
		
		if(spieler._goLeftInterval){
			clearInterval(spieler._goLeftInterval);	
		}
		spieler._goLeftIntervalStart = CONFIG.Games.SpielAufZeit.buttonDownWaitIntervals;
		spieler._goLeftInterval = setInterval(function(){
			if(spieler._goLeftIntervalStart>0){
				spieler._goLeftIntervalStart--;
				return;
			}
			
			if(!this.calcColission([spieler.getCursorX()-1,spieler.getCursorY()], spieler.getBlockelement())){
				spieler.decrementCursorX();
				
				this.computeField();
				this.emitToDisplays("SpielFrame", this.getEmitData());
			}
		}.bind(this), CONFIG.Games.SpielAufZeit.buttonDownIntervalTime);
	}
};

/**
 * @method buttonLeftUp
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 */
SpielAufZeit.prototype.buttonLeftUp = function(spieler){
	if(spieler._goLeftInterval){
		clearInterval(spieler._goLeftInterval);	
	}
};

/**
 * @method buttonRightDown
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 */
SpielAufZeit.prototype.buttonRightDown = function(spieler){
	if(!this.calcColission([spieler.getCursorX()+1,spieler.getCursorY()], spieler.getBlockelement())){
		spieler.incrementCursorX();
		
		
		if(spieler._goRightInterval){
			clearInterval(spieler._goRightInterval);	
		}
		spieler._goRightIntervalStart = CONFIG.Games.SpielAufZeit.buttonDownWaitIntervals;
		spieler._goRightInterval = setInterval(function(){
			if(spieler._goRightIntervalStart>0){
				spieler._goRightIntervalStart--;
				return;
			}
			
			if(!this.calcColission([spieler.getCursorX()+1,spieler.getCursorY()], spieler.getBlockelement())){
				spieler.incrementCursorX();
				
				this.computeField();
				this.emitToDisplays("SpielFrame", this.getEmitData());
			}
		}.bind(this), CONFIG.Games.SpielAufZeit.buttonDownIntervalTime);
	}
};

/**
 * @method buttonRightUp
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 */
SpielAufZeit.prototype.buttonRightUp = function(spieler){
	if(spieler._goRightInterval){
		clearInterval(spieler._goRightInterval);	
	}
};

/**
 * @method buttonDownDown
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 */
SpielAufZeit.prototype.buttonDownDown = function(spieler){
	while(!this.calcColission(spieler, spieler.getBlockelement())){
		spieler.incrementCursorY();
	}
	spieler.decrementCursorY();
	this.nextFrame(spieler);
	spieler.ticker(spieler.getTickTime(), true);
};

/**
 * @method buttonRotateLeftDown
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 */
SpielAufZeit.prototype.buttonRotateLeftDown = function(spieler){
	spieler.getBlockelement().rotateLeft();
	var collisionValue = this.calcColission([spieler.getCursorX(),spieler.getCursorY()], spieler.getBlockelement());
	if(collisionValue[0]==2){
		// wenn der gegen eine wand geraten ist, verschiebe ihn richtung mitte, bis es nicht mehr der fall ist
		
		do{
			var center_x = this.getW()/2;
			if(spieler.getCursorX() < center_x){
				spieler.setCursorX(spieler.getCursorX()+1);
			}else{
				spieler.setCursorX(spieler.getCursorX()-1);
			}
			collisionValue = this.calcColission([spieler.getCursorX(),spieler.getCursorY()], spieler.getBlockelement());
		}while(collisionValue[0]==2);
	
		
	}else if(collisionValue){
		spieler.getBlockelement().rotateRight();
	}
	
	this.emitToDisplays("SpielEffect", {type: "blockRotate", data: null});
};

/**
 * @method buttonRotateRightDown
 * @param {server.Games.SpielAufZeit.Spieler} spieler
 */
SpielAufZeit.prototype.buttonRotateRightDown = function(spieler){
	spieler.getBlockelement().rotateRight();
	var collisionValue = this.calcColission([spieler.getCursorX(),spieler.getCursorY()], spieler.getBlockelement());
	if(collisionValue[0]==2){
		// wenn der gegen eine wand geraten ist, verschiebe ihn richtung mitte, bis es nicht mehr der fall ist
		
		do{
			var center_x = this.getW()/2;
			if(spieler.getCursorX() < center_x){
				spieler.setCursorX(spieler.getCursorX()+1);
			}else{
				spieler.setCursorX(spieler.getCursorX()-1);
			}
			collisionValue = this.calcColission([spieler.getCursorX(),spieler.getCursorY()], spieler.getBlockelement());
		}while(collisionValue[0]==2);
	
	
	}else if(collisionValue){
		spieler.getBlockelement().rotateLeft();	
	}
	
	this.emitToDisplays("SpielEffect", {type: "blockRotate", data: null});
};

/**
 * @method button
 *
 * @param {BUTTONTYPE} type
 * @param {BUTTON} key
 * @param {Profil} profil
 */
SpielAufZeit.prototype.button = /*overwride*/ function(type, key, profil){

	var i, spieler = null;
	var recalc = false;
	
	for(i in this._spieler){
		if(!this._spieler[i].compute()) continue;
		if(this._spieler[i].getId() == profil.ProfilID){
			spieler = this._spieler[i];
			break;
		}
	}

	if(spieler === null){
		// do nothing... 
		return;
	}
	
	if(key === BUTTON.Left && type === BUTTONTYPE.Down){
		this.buttonLeftDown(spieler);
		recalc = true;
	}
	
	if(key === BUTTON.Right && type === BUTTONTYPE.Down){
		this.buttonRightDown(spieler);
		recalc = true;
	}
	
	if(key === BUTTON.Left && type === BUTTONTYPE.Up){
		this.buttonLeftUp(spieler);
		recalc = true;
	}
	
	if(key === BUTTON.Right && type === BUTTONTYPE.Up){
		this.buttonRightUp(spieler);
		recalc = true;
	}
	
	if(key === BUTTON.RotateLeft && type === BUTTONTYPE.Down){
		this.buttonRotateLeftDown(spieler);
		recalc = true;
	}
	
	if(key === BUTTON.RotateRight && type === BUTTONTYPE.Down){
		this.buttonRotateRightDown(spieler);
		recalc = true;
	}
	
	if(key === BUTTON.Down && type === BUTTONTYPE.Down){
		this.buttonDownDown(spieler);
		recalc = true;
	}
	
	// nach einer gültigen benutzereingabe immer ein frame schicken
	if(recalc){
		this._statistics.spieler[spieler.getId()].buttonAt[this._t()] = [key,type];
		this.computeField();
		this.emitToDisplays("SpielFrame", this.getEmitData());
	}
};

/**
 * @method getEmitData
 *
 * @return JSON
 */
SpielAufZeit.prototype.getEmitData = function(){
	var r = {}, cursor, spieler, i, x,y,row;
	r.w = this._w;
	r.h = this._h;
	
	r.spieler = [];
	for(i in this._spieler){
		r.spieler.push(this._spieler[i].getEmitData());
	}
	
	r.field = [];
	for(y = 0; y < this._h; y++){
		row = [];
		for(x = 0; x < this._w; x++){
			if(this._field[y][x] === null){
				row.push(null);
			}else{
				row.push(this._field[y][x].getEmitData());
			}
		}
		r.field.push(row);
	}
	
	return r;
};

exports.SpielAufZeit = SpielAufZeit;