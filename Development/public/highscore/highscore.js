"use strict";

/**
 * Aktuelle Seite des Pagers
 *
 * @property actPage
 * @type Number
 */
var actPage = 0;

/**
 * Name des Spieltypen, der in der Tabelle angezeigt werden soll
 *
 * @property actType
 * @type String
 * @default ''		zeige alle Highscore Einträge an, unabhängig des Spieltypen
 */
var actType = '';

/**
 * Bestimmt, wie viele Einträge pro Seite in der Tabelle angezeigt werden sollen
 *
 * @property maxEntry
 * @type Number
 */
var maxEntry = CONFIG.Highscore.maxEntry;

/**
 * Bestimmt, nach wie vielen Millisekunden die Tabelle neu geladen werden soll 
 *
 * @property interval
 * @type Number
 */
var interval = CONFIG.Highscore.interval;

/**
 * Bestimmt, wie viele Seiten vor und nach der aktuellen im Pager angezeigt werden sollen
 *
 * @property pages
 * @type Number
 */
var pages = CONFIG.Highscore.pages;

/**
 * Fuellt die ComboBox mit den verschiedene Spieltypen
 *
 * @method fillComboBox
 */
function fillComboBox(){
	$.getJSON('/api/highscore/types', function(data){
		var option = "<option >?</option>";
		var i;
		var t = '';
		for(i = 0; i < data.length; i++){
			t += option.replace('?', data[i].Bezeichnung);
		}
		$('#selectType').append(t)
	});
}

/**
 * Fordert über 'api/highscore' die Eintrage für die Tabelle an und setzt die Daten im erhaltende JSON Array in die Tabelle.  
 *
 * @method getHighscore
 * @param  {Number}	Aktuelle Seite des Pagers 
 */
function getHighscore(act){
	var von = (act*maxEntry)+1;
	var bis = (maxEntry-1) + von;
	$.getJSON('/api/highscore/'+ actType + von + '-' + bis, function(data){
		actPage = act;
		var head = "<tr><th>Platz</th><th>Name</th><th>Punkte</th></tr>";
		var link = '<a href="/profil/??">?</a>'
		$('#scoreTable').html(head);
		var i;
		var tr = '';
		for(i = 0; i < data.length; i++){
			tr += '<tr>';
			tr += replaceString('<td>?</td>', data[i].Platz);
			tr += replaceString('<td>?</td>', replaceArray(link, [data[i].Name, data[i].ProfilID]));
			tr += replaceString('<td>?</td>', data[i].Punkte);
			tr += '</tr>';
		}
		$('#scoreTable').append(tr);	
		getPager();	
	});
}

/**
 * Ersetzt '?' im String link mit dem übergebenden value
 *
 * @method replaceString
 * @param  {String}	beinhaltet '?', dass ersetzt werden soll
 * @param  {String}	wird statt '?' eingefügt
 */
function replaceString(link, value){
	return link.replace('?', value);
}

/**
 * Erstellt den Pager.
 *
 * @method getPager
 */
function getPager(){
	$.getJSON('/api/highscore/length/' + actType, function(data){
		var pagination = Math.ceil(data.count/maxEntry) -1;
		var i, range, text = '';
		var link = '<li ??><a href="javascript:;" onclick="getHighscore(?)">???</a></li>'; 
		if(1 <= pagination){
			i = 1;
			if (actPage != 0){
				i = actPage - pages +1;
				if (i < 1)
					i = 1;
				text += replaceArray(link, [0, '', 'erste Seite']);
				text += replaceArray(link, [actPage-1, '', 'vorherige Seite']);
				if (1 < i)
					text += '<li><p>...</p></li>';	 
			}
			while(i < actPage+1){
				text += replaceArray(link, [i-1, '', i]);
				i += 1;
			}
			text += replaceArray(link, [actPage, 'class="on"', actPage+1]);
			while(i < (actPage + pages +1) && i <= pagination){
				i += 1;
				text += replaceArray(link, [i-1, '', i]);
			}
			if (i <= pagination)
				text += '<li><p>...</p></li>';
			if (actPage < pagination){
				text += replaceArray(link, [actPage+1, '', 'n&auml;chste Seite']);
				text += replaceArray(link, [pagination, '', 'letzte Seite']);
			}
		}
		$('#pager').html(text);
	});
}

/**
 * Ersetzt die Vorkommen von '?' in link den Werten in array
 *
 * @method replaceArray
 * @param  {String}	  beinhaltet mehrere '?', die ersetzt werden sollen
 * @param  {Array}	  die String in value werden für '?' eingefügt
 */
function replaceArray(link, array){
	if (array.length == 3)
		return link.replace('???', array[2]).replace('??', array[1]).replace('?', array[0]);
	else if (array.length == 2)
		return link.replace('??', array[1]).replace('?', array[0]);
}


$(window).ready(function(){
	fillComboBox();
	getHighscore(actPage);
	
	$('#selectType').on("change", function(){
		var selected = $('#selectType option:selected');
		if (0 < selected.length)
		 	actType = selected.val() + '/';
		 else
			actType = '';
		getHighscore(0);
	});
	window.setInterval("getHighscore(actPage)", (interval * 1000));	
});

