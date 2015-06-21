/**
 * Datenbankverbindungsdaten
 *
 * @module global
 * @namespace global
 * @attribute DB
 * @readOnly
 * @type Map
 */
var DB = {
	
	/**
	 * Datenbankname
	 *
	 * @property name
	 * @type String
	 */
	name: "battle_tetris",
	
	/**
	 * Datenbankhost
	 *
	 * @property host
	 * @type String
	 */
	host: "localhost",
		
	/**
	 * Datenbankbenutzer
	 *
	 * @property user
	 * @type String
	 */
	user: "root",
	
	/**
	 * Passwort
	 *
	 * @property password
	 * @type String
	 */
	password: "",

	/**
	 * Gibt an, ob die Datenbank inkl. Testdaten (neu) erstellt werden soll, oder nicht.
	 *
	 * @attribute DB.create_database
	 * @readOnly
	 * @type Boolean
	 */
	create_database: false
	
};

exports.DB = DB;
