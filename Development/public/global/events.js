'use strict';

/**
 * @module global
 * @namespace global
 *
 * @class GAME_EVENT
 * @static
 * @readOnly
 */
var GAME_EVENT = {
	START: "SpielStarts",
	PUNKTE: "SpielPunkte",
	NEXT_BLOCK: "SpielNextBlock",
	SPIELER_AUSGESCHIEDEN: "SpielSpielerRaus",
	ENDE: "SpielEnds"
};

/**
 * @module global
 * @namespace global
 *
 * @class LIST_EVENT
 * @static
 * @readOnly
 */
var LIST_EVENT = {
	SpielAdded: 'SpielAdded',
	SpielChange: 'SpielChange',
	SpielDeleted: 'SpielDeleted',
	UpdateSpielList: 'updateGamelist',
	
	ProfilAdded: 'ProfilAdded',
	ProfilChange: 'ProfilChange',
	ProfilDeleted: 'ProfilDeleted',
	UpdateProfilList: 'updatePlayerlist'
};

if(typeof exports !== 'undefined'){
	exports.GAME_EVENT = GAME_EVENT;
	exports.LIST_EVENT = LIST_EVENT;
} 