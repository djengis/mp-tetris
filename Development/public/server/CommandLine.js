

/**
 * @module server
 * @namespace server
 *
 * @class CommandLine
 * @constructor
 */
function CommandLine(main){
	/**
	 * @property _main
	 * @private
	 * @type server.Main
	 */
	this._main = main;
}

/**
 * @method init
 */
CommandLine.prototype.init = function(){
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	
	process.stdout.write("> ");
	
	process.stdin.on('data', function (command) {
		this._interpretCommand(command);
	}.bind(this));
};

/**
 * @method _interpretCommand
 * @param {String} command
 * @private
 */
CommandLine.prototype._interpretCommand = function(command){
	
	if(command === 'stop\n'){
		this._main.stop();
	}
	
	if(command === 'restart\n'){
		this._main.restart();
	}
	
	process.stdout.write("> ");
};

exports.CommandLine = CommandLine;