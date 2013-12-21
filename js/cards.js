<!--
/*---
	Hallo "Quellcode-Detektive"!
	Natürlich gibt es im Internet nicht DEN hundertprozentigen Quellcodes-Schutz für HTML und Javascript,und man weiß 
	ja auch: es gibt kein größeres Kompliment für eine Sache als der Versuch sie zu kopieren.
	Wenn man ganz ehrlich ist: ein klein wenig stolz ist man als Software-Entwickler ja auch und manchmal würde man sogar ganz 
	gerne mit den internen Finessen seiner Werke protzen.
	Dennoch: der Wunsch nach Fairness überwiegt.
	Deshalb: wenn schon kopieren, dann bitte vielleicht einen kleinen Verweis auf den originären Autor - Inline-Kommentar genügt (mir).
	(Mache ich ja auch - bei den Quellcodes, von denen ich mich selbst habe inspirieren lassen)
	Noch besser: fragt einfach beim Betreiber der Domain nach, auf dessen Seite Ihr diesen Quellcode gefunden habt.
	Vielleicht hilft er Euch ja sogar bei der Anpassung an die Bedürfnisse Eurer Websites - man ist ja schließlich (meistens) kollegial.
	Schöne Grüße,
	Rüdiger Keßler, Dipl.-Inform. (FH), http://www.IBeRKa.de [.com|.net|.org]
/*---
	Besonderer Dank an dieser Stelle an Bernd Eickhoff, der dabei half, dieses System nun formvollendet realistisch zu gestalten!
/*---
	Hello "Sourcecode-Investigators"!
	Of course there´s no way to aviod copying sourcecode by hundredpercent for HTML and javascript in internet,
	and it´s wellknown, that there´s no greater compliment for something than beeing copied - or stolen.
	To be honest: as a software-developer you are even a little bit proud of your work and sometimes you would even like 
	to show off with its internal finesse.
	But: the wish for fairness dominates.
	Therefore: WHEN copying, then maybe set a little link to the originate author, please - inline-comment seems enough (for me).
	(I´m doing the same - with the sourcecode i´ve been inspired for myself)
	Even better: just ask the owner of the domain, in which you found this sourcecode.
	Maybe he´s ready to help you customizing it for your own website - as it is (mostly) usual among colleagues.
	Best regards,
	Rüdiger Keßler, Dipl.-Inform. (FH), http://www.IBeRKa.de [.com|.net|.org]
/*---
	Special Thanks to Bernd Eickhoff for his help to make this system appear really realistic!
/*--- */
var status_level           = 0;													//--- Zustand des Legesystems (0 = Ziehen, 1 = Aufdecken)
var status_running         = 0;
var status_ended           = 1;
var z_layer                = new Array( deck_max_cards );						//--- Zustand der ausgebreiteten Layer (verdeckte Karten)
var z_l_hidden             = 0;
var z_l_in_use             = 1;
var z_l_lifted             = 2;
var z_l_picked             = 3;
var shuffled               = new Array( deck_max_cards ); 
var positioned             = new Array( deck_max_cards ); 
var count_repeats          = 0;													//--- Zähler für Wiederholungen
var count_rounds           = 0;													//--- Zähler für Runden
var count_cards            = 0;													//--- Anzahl gezogener Karten insgesamt
var count_cards_round      = 0;													//--- Anzahl gezogener Karten pro Runde
var count_cards_repeat     = 0;													//--- Anzahl gezogener Karten in Wiederholung
var card                   = new Array( spreading_max_cards );					//--- gezogene Karten (0 = QE)
var lift_diff              = -10;												//--- Lageveränderung (y) der Karten beim Berühren mit der Maus
var jetzt                  = new Date();										//--- Aktuelles Datum (Milliseconds wird als Zusatz für den Random verwendet)
var target_spacer          = 4;													//--- Horizontalter Abstand der gezogenen Karten voneinander
var step_move              = 5;													//--- Schrittweite beim Bewegen der (verdeckten) Karten 
var changestep             = 4;													//--- Schrittweite ber Größenänderung der Karten beim Aufdecken
var qe                     = 0;													//--- Wert der Quintessenz
var qe2                    = 0;													//--- Wert der Quersumme aus der Quintessenz (falls möglich)
var cards_msg              = '';												//--- Auszugebende Meldungen
var spreading_width_local  = 0; 
var spreading_spacer_local = 0; 

function random_card() {
	result = Math.random();
	result_check = Math.random();
	if ( result == result_check) result = jetzt.getMilliseconds() / 1000;
	return result;
}

function riesenrechnerei(p_x) {
	var result = 0;
	switch (spreading) {
		case 'Parabel T':       result = Math.floor( spreading_height * ( 1 - ( Math.pow((2 * p_x / spreading_width_local) - 1, 2) ) ) );
								break;
		case 'Parabel B':       result = Math.floor( spreading_height * ( Math.pow((2 * p_x / spreading_width_local) - 1, 2) ) );
								break;
		case 'Halbparabel LT':  result = Math.floor( spreading_height * ( 1 - ( Math.pow(p_x / spreading_width_local, 2) ) ) );
								break;
		case 'Halbparabel LB':  result = Math.floor( spreading_height * ( Math.pow(p_x / spreading_width_local, 2) ) );
								break;
		case 'Halbparabel RT':  result = Math.floor( spreading_height * ( 1 - ( Math.pow((p_x / spreading_width_local) - 1, 2) ) ) );
								break;
		case 'Halbparabel RB':  result = Math.floor( spreading_height * ( Math.pow((p_x / spreading_width_local) - 1, 2) ) );
								break;
		case 'Viertelkreis LT': result = Math.floor( spreading_height / spreading_width_local * Math.sqrt( Math.pow(spreading_width_local, 2) - Math.pow(p_x, 2) ) );
								break;
		case 'Viertelkreis LB': result = Math.floor( spreading_height / spreading_width_local * ( spreading_width_local - Math.sqrt( Math.pow(spreading_width_local, 2) - Math.pow(p_x, 2) ) ) );
								break;
		case 'Viertelkreis RT': result = Math.floor( spreading_height / spreading_width_local * Math.sqrt( Math.pow(spreading_width_local, 2) - Math.pow(p_x - spreading_width_local, 2) ) );
								break;
		case 'Viertelkreis RB': result = Math.floor( spreading_height / spreading_width_local * ( spreading_width_local - Math.sqrt( Math.pow(spreading_width_local, 2) - Math.pow(p_x - spreading_width_local, 2) ) ) );
								break;
		case 'Halbkreis T':     result = Math.floor( spreading_height / spreading_width_local * Math.sqrt( Math.pow(spreading_width_local, 2) - Math.pow((p_x * 2) - spreading_width_local, 2) ) );
								break;
		case 'Halbkreis B':     result = Math.floor( spreading_height / spreading_width_local * ( spreading_width_local - Math.sqrt( Math.pow(spreading_width_local, 2) - Math.pow((p_x * 2) - spreading_width_local, 2) ) ) );
								break;
		default:                result = 0;
								break;
	}
	return result;
}

function init_repeats() {
	if ( count_repeats <= spreading_repeats && count_rounds <= spreading_rounds ) {
		for ( raw_layer = 0; raw_layer <= deck_max_cards; raw_layer++ ) {
			// Element [0] ist reserviert für die QE bzw. den dazugehörigen Layer. Ab Element [1] wird mit der laufenden 
			// Nummerierung begonnen, die entweder bei 0 oder eins beginnt (abhängig von firstcard). Also:
			// deck_firstcard=0 => [0]=-1; [1]=0; [2]=1; etc.
			// deck_firstcard=1 => [0]=0;  [1]=1; [2]=2; etc.
			shuffled[raw_layer]= raw_layer - 1 + deck_firstcard;
		}
		init_round(1);
		count_repeats++;
	}
	//--- Meldungstext setzen
	cards_msg = make_msg();
}

function init_round(p_count_rounds) {
	count_cards_round = 0;
	count_rounds      = p_count_rounds;
	if ( count_rounds <= spreading_rounds ) {
		var k = 0;
		for ( raw_layer = deck_max_cards; raw_layer >= 0; raw_layer-- ) {
			if ( raw_layer > 0 && shuffled[raw_layer] <= spreading_to[count_rounds] && shuffled[raw_layer] >= spreading_from[count_rounds] ) {
				// Es werden nur die Elemente ab Element [1] gemischt, deswegen "+ 1"
				var new_layer       = Math.floor( random_card() * (raw_layer - spreading_from[count_rounds]) ) + 1 + spreading_from[count_rounds];
				var temp_layer      = shuffled[raw_layer];
				shuffled[raw_layer] = shuffled[new_layer];
				shuffled[new_layer] = temp_layer;
				z_layer[raw_layer]  = z_l_in_use;
				k++;
				layer_set_zindex('L' + raw_layer, deck_max_cards - raw_layer);
			} else if ( z_layer[raw_layer] != z_l_picked ) {
				z_layer[raw_layer]  = z_l_hidden;
			}
		}
		// Rein mathematisch betrachter müsste es hier heissen: = ((deck_max_cards - 1) * spreading_spacer) + spreading_width_c;
		if ( spreading_width == 0 ) spreading_width = ((deck_max_cards + 1) * spreading_spacer) + spreading_width_c;
		// Rein mathematisch betrachter müsste es hier heissen: = Math.floor( (spreading_width - spreading_width_c) / (k - 1) );
		spreading_spacer_local = Math.floor( (spreading_width - spreading_width_c) / (k + 1) );
		// Rein mathematisch betrachter müsste es hier heissen: = spreading_spacer_local * (k - 1);
		spreading_width_local = spreading_spacer_local * (k + 1);
		// Rein mathematisch betrachter müsste es hier heissen: = 0;
		// ABER: wir "biegen die Kurve ein klein wenig auf", damit die jeweils erste und letzte Karte nicht zu sehr aus der Reihe tanzen
		var k = 1;
		for ( raw_layer = 1; raw_layer <= deck_max_cards; raw_layer++ ) {
			if ( z_layer[raw_layer] == z_l_in_use) {
				positioned[raw_layer] = k++ * spreading_spacer_local;
				layer_position('L' + raw_layer, spreading_offset_x + positioned[raw_layer], spreading_offset_y + riesenrechnerei(positioned[raw_layer]));
				//layer_show('L' + raw_layer)
				layer_display('L' + raw_layer, 'block');
			} else if ( z_layer[raw_layer] != z_l_picked ) {
				//layer_hide('L' + raw_layer);
				layer_display('L' + raw_layer, 'none');
			}
		}
		//--- Meldungstext setzen
		cards_msg = make_msg();
	}
}

function init_common() {
	//popup_init('pointerdiv');
	for (i = 0; i <= spreading_max_cards; i++) {						//--- Initialisierung des Array der gezogenen (bzw. hier: noch zu ziehenden) Karten ---
		card[i]    = new Array(8);										// Für jede Karte die Angaben: 
		card[i][0] = '';												// Layer-ID
		card[i][1] = 0;													// x-Koordinate direkt nach dem Ziehen
		card[i][2] = 0;													// y-Koordinate direkt nach dem Ziehen
		card[i][3] = 0;													// x-Koordinate beim Auslegen
		card[i][4] = 0;													// x-Koordinate beim Auslegen
		card[i][5] = 0;													// Wert (0 - 414) der gezogenen Karte
		card[i][6] = 0;													// Flag, ob sich Karte gerade noch bewegt
		card[i][7] = '';												// Bedeutung/Titel der Position im Legesystem
		card[i][8] = '';												// Nr. (0 - 77) der gezogenen Karte
	}
	cards_msg = txt_intro;
	layer_write_text(layer_tutorial, cards_msg);
/*
	if (tutorial_spread) layer_show(layer_tutorial);
	else                 layer_hide(layer_tutorial);
	if (reload_spread)   layer_show(layer_input);
	else                 layer_hide(layer_input);
*/
	if (tutorial_spread) layer_display(layer_tutorial, 'block');
	else                 layer_display(layer_tutorial, 'none');
	if (reload_spread)   layer_display(layer_input, 'block');
	else                 layer_display(layer_input, 'none');
	init_repeats();
//alert('Debug-Info: im Moment kann es wegen Wartungsarbeiten zu technischen Problemen kommen - wir arbeiten aber bereits daran!');
}

function make_msg() {
	//var result = txt_continue1 + '<b>' + (spreading_cards[count_rounds] - count_cards_round) + '</b>';
	//if ( spreading_rounds > 1 || spreading_repeats > 1 ) result += ' (' + (spreading_max_cards - count_cards) + ') ';
	var result = txt_continue1 + '<b>' + (spreading_max_cards - count_cards) + '</b>';
	result += txt_continue2;
	//if ( (spreading_cards[count_rounds] - count_cards_round) > 1 ) result += txt_plural;
	if ( (spreading_max_cards - count_cards) > 1 ) result += txt_plural;
	else                                           result += txt_singular;
	result += txt_continue3;
	return result;
}

function make_text(p_i, p_id) {
	var tmp_txt = '';
	
	if ( reading_title ) {
		tmp_txt += '<span class="tarot_card_title">' + card[p_i][7] + '</span>';
		tmp_txt += '<br />';
	}
		tmp_txt += '<span class="tarot_card_name">' + titel[card[p_i][8]] + '</span>';
	if ( p_id==0 && qe2 > 0 ) {
		tmp_txt += ' +<br />';
		tmp_txt += '<span class="tarot_card_name">' + titel[qe2] + '</span>';
	}
		tmp_txt += '<p>'+ctext[card[p_i][8]][p_i]+'</p>';
	return tmp_txt;
}

function mousemove_additional(p_id) {
	if (mouse_y < (cards_height + layer_top('L' + p_id) + lift_diff)) {
		additional_move = false;
		additional_par  = '';
		z_layer[p_id] = z_l_lifted;
		layer_position('L' + p_id, layer_left('L' + p_id), layer_top('L' + p_id) + lift_diff)	//--- Karte "anheben"
	}
}

function lift_up(p_id) {																		//--- "Berühren" einer Karte mit dem Mauszeiger ---
	if ( layer_zindex('L' + p_id) < 100 ) {														//--- Karte wurde noch nicht gezogen, liegt verdeckt in der Reihe
		additional_move = true;
		additional_par  = p_id;
	} else  {
		hide_show(p_id);
	}
}

function lift_down(p_id){
	if ( layer_zindex('L' + p_id) < 100 ) {
		additional_move = false;
		additional_par  = '';
		z_layer[p_id] = z_l_in_use;
		layer_position('L' + p_id, layer_left('L' + p_id), spreading_offset_y + riesenrechnerei(positioned[p_id]))
	} else  {
		hide_text(p_id);
	}
}
/*
function pick_card(p_id) {

	//--- es können nur Karten "gepickt" werden, wenn 
	//    - die Ziehung noch nicht zu Ende ist 
	//    - und noch nicht alle Karten gezogen wurden
	//    - und die zu ziehende Karten gerade "angehoben" wird.
	p_id = z_l_lifted = 1;
	if ( status_level == status_running && count_cards < spreading_max_cards && z_layer[p_id] == z_l_lifted ) 
	{
		
		count_cards_round++;
		count_cards++;

		card[count_cards][0] = p_id;																	//--- Div-ID festhalten
		card[count_cards][1] = spreading_target_x + (count_cards * target_spacer - 1);					//--- Zielkoordinaten auf Stapel
		card[count_cards][2] = spreading_target_y + (count_cards * 2 - 1);					 			//--- Zielkoordinaten auf Stapel
		card[count_cards][8] = cardn[p_id];                                                             //shuffled[p_id];	
															                                         	//--- Karten-Nr. (0 - 77) festhalten
		card[count_cards][5] = cardn[p_id];											                 	//--- Karten-Wert (0 - 414) festhalten
	
		if ( export_option ) 
		{
			document.forms[0].elements['card_a_'+count_cards].value = shuffled[p_id];
			document.forms[0].elements['card_b_'+count_cards].value = cardn[card[count_cards][8]];
		}
		
		//--- Layer-Zustand ändern
		z_layer[p_id] = z_l_picked;
		layer_set_zindex('L' + p_id, 100 + count_cards);
		
		//--- Karten "unauffällig tauschen"
		
		layer_position('E' + count_cards, layer_left('L' + p_id), layer_top('L' + p_id) + lift_diff);
		layer_display('E' + count_cards, 'block');
		layer_display('L' + p_id, 'none');
		//--- Karten "anschubsen"
		//move_card('L' + p_id, card[count_cards][1], card[count_cards][2], step_move, status_level);
		move_card('E' + count_cards, card[count_cards][1], card[count_cards][2], step_move, status_level);
		
		//--- Abbruchkriterien prüfen
		if (count_cards == spreading_max_cards) 
		{												//--- Abschlußarbeiten nach dem Ziehen der letzten Karte ---
			status_level = status_ended;														//--- status auf "beendet" setzen 
			popup_init('pointerdiv');
			//for (i = 1; i <= deck_max_cards; i++) if ( z_layer[i] < z_l_picked ) layer_hide('L'+i);
			//for (i = 1; i <= deck_max_cards; i++) if ( z_layer[i] < z_l_picked ) layer_display('L'+i, 'none');
			for (i = 1; i <= deck_max_cards; i++) layer_display('L'+i, 'none');
			var tmp=0;																			//--- Initialisierung für Quersummenberechnung
			qe=0;
			for (i = spreading_max_cards; i > 0; i--) {											//--- Alle gezogenen Karten durchgehen
				//move_card('L' + card[i][0], card[i][3], card[i][4], step_move, status_level);	//--- gezogene Karten auf Position im LS verschieben
				move_card('E' + i, card[i][3], card[i][4], step_move, status_level);			//--- gezogene Karten auf Position im LS verschieben
				//change_card(card[i][0], 1, card[i][5]);										//--- gezogene Karte umdrehen
				change_card(i, 1, card[i][5]);													//--- gezogene Karte umdrehen
				qe = qe + parseInt(cardv[card[i][8]]);											//--- Kartenwerte für Quersummenberechnung addieren
			}
			while ( deck_qe_max > 0 && qe > (deck_qe_max + 1 - deck_firstcard) ) {									//--- Quersummenberechnung, Stufe 1a ---
				qe  = String(qe);																//--- Umwandlung in String
				tmp = 0;																		//--- Temnporäre Variable initialisieren
				for (i=0; i < qe.length; i++) {													//--- QE-String zeichenweise durchgehen
					tmp = tmp + parseInt(qe.substr(i,1));										//--- Temnporäre Variable addieren
				}
				qe = tmp;																		//--- Rück-Umwandlung in Integer
			}
			if ( qe > 9 && deck_qe_double ) {													//--- Quersummenberechnung, Stufe 2 ---
				qe2 = String(qe);																//--- Übernahme als String
				tmp = 0;																		//--- Temnporäre Variable initialisieren
				for (i = 0; i < qe2.length; i++) {												//--- QE(2)-String zeichenweise durchgehen
					tmp = tmp + parseInt(qe2.substr(i,1));										//--- Temnporäre Variable addieren
				}
				qe2 = tmp;																		//--- Rück-Umwandlung in Integer
			}
			if ( qe >= (deck_qe_max + 1 - deck_firstcard) ) qe = 0;								//--- Quersummenberechnung, Stufe 1b ---
			card[0][5] = qe;
			card[0][8] = qe;
			if ( export_option ) {
				document.forms[0].elements['card_a_0'].value = qe;
				document.forms[0].elements['card_b_0'].value = qe;
				//layer_show(layer_export);
				layer_display(layer_export, 'block');
			}
			if ( card[0][3] > 0 || card[0][4] > 0 ) {											//--- QE ggf. präsentieren ---
				//layer_show('L0');																//--- Karte mit QE sichtbar machen 
				layer_display('E0', 'block');													//--- Karte mit QE sichtbar machen 
				move_card('E0', card[0][3], card[0][4], step_move, status_level);				//--- Karte mit QE verschieben
				change_card(0, 1, qe);															//--- Karte mit QE umdrehen
			}
			cards_msg = txt_meaning1;
			if ( txt_meaning2.length > 0 ) {
				if ( spreading_max_cards>1 ) cards_msg += txt_plural;
				else                         cards_msg += txt_singular;
				cards_msg += txt_meaning2;
			}
			if (reading_show=='text') {
				var cards_msg2 = make_text(count_cards, p_id); //+txt_authorlink;
				//var cards_msg2 = make_text(p_id, p_id); //+txt_authorlink;
				layer_write_text(layer_readings, cards_msg2);
				//layer_show(layer_readings);
				layer_display(layer_readings, 'block');
			}

			if (tutorial_reading) layer_display(layer_tutorial, 'block');
			else                  layer_display(layer_tutorial, 'none');
			if (reload_reading)   layer_display(layer_input, 'block');
			else                  layer_display(layer_input, 'none');
		} else if (count_cards_round >= spreading_cards[count_rounds]) {
			if (count_rounds >= spreading_rounds) {
				if (count_repeats < spreading_repeats) {
					init_repeats();
				} 
			} else {
				init_round(++count_rounds);
			}
		} else {
			//--- Meldungstext setzen
			cards_msg = make_msg();
		}
//alert('(pick) Wiederholungen: '+count_repeats+' von '+spreading_repeats+', Runde: '+count_rounds+' von '+spreading_rounds+', Karte: '+count_cards_round+' von '+spreading_cards[count_rounds]+', Karten insgesamt: '+count_cards+' von '+spreading_max_cards);
	}
	layer_write_text(layer_tutorial, cards_msg);
}
*/
function show_text(p_id){
	if( status_level > status_running ) {																//--- Alle Karten wurden gezogen
		for (i=0; i <= count_cards; i++) if ( card[i][0] == p_id ) break;
		var tmp_width = 350;
		//if ( spreading_max_cards == 1  ) tmp_width = 400;
		//if (reading_show=='popup')     popup_show('pointerdiv', tmp_width, make_text(i, p_id));
		if (reading_show=='popup')     popup_show('pointerdiv', tmp_width, make_text(p_id, p_id));
		else if (reading_show=='text') layer_write_text(layer_readings, make_text(p_id, p_id)); //+txt_authorlink);
		//else if (reading_show=='text') layer_write_text(layer_readings, make_text(i, p_id)); //+txt_authorlink);
		layer_set_zindex('E' + p_id, 200 + p_id);
	}
}

function hide_text(p_id){
	if( status_level > status_running ) {
		popup_hide('pointerdiv');
		layer_set_zindex('E' + p_id, 100 + p_id);
	}
}

function move_card(p_id, p_x, p_y, p_delta, p_semaphor) {
	
	var x_x = layer_left(p_id);
	var x_y = layer_top(p_id);
	
	if(p_semaphor >= status_level && (layer_left(p_id) != p_x || layer_top(p_id) != p_y)) {
		if (layer_left(p_id) > p_x)            x_x = layer_left(p_id) - p_delta;
		if (layer_left(p_id) < p_x)            x_x = layer_left(p_id) + p_delta;
		if (layer_top(p_id)  > p_y)            x_y = layer_top(p_id) - p_delta;
		if (layer_top(p_id)  < p_y)            x_y = layer_top(p_id) + p_delta;
		if (get_abs(x_x - p_x) < p_delta)      x_x = p_x; 
		if (get_abs(x_y - p_y) < p_delta)      x_y = p_y;
		layer_position(p_id,x_x,x_y);
		setTimeout("move_card('"+p_id+"',"+Math.floor(p_x)+","+Math.floor(p_y)+","+Math.floor(p_delta)+","+p_semaphor+")", 0.5)
//        } else if (status_level == status_ended && reading_show=='text') {
//            layer_show(layer_readings);
	}
}

function change_card(p_id, p_old, p_img) { //--- Karte "umdrehen" ---
  x_obj = 'emg'+p_id;
  if (p_old==1) {
	if (document.images[x_obj].width > changestep) {
	  //--- Die Breite der "Karte" (img-Objekt) wird sukzessive dekrementiert ... ---
	  document.images[x_obj].width = (document.images[x_obj].width - changestep);
	} else {
	  //--- ... bis sie "0" (Null) erreicht hat. ---
	  document.images[x_obj].width = 0;
	  //--- Dann wird das neue SRC-Attribut vorbereitet ... ---
	  x_img_src = deck_path;
	  if (parseInt(p_img)<100) x_img_src += '0';
	  if (parseInt(p_img)<10)  x_img_src += '0';
	  //--- ...und schließlich gesetzt. ---
	  document.images[x_obj].src = x_img_src+p_img+'.'+deck_ext;
	  //--- Abschließend wird ein Flag gesetzt (korrekter: gelöscht) als Zeichen, 
	  //--- dass von nun an die Breite des IMG wieder inkrementiert werden muss. ---
	  p_old=0;
	}
	//--- Rekursiver Aufruf mit Zeitverzögerung ---
	setTimeout("change_card("+p_id+","+p_old+","+p_img+")", 1)
  } else {
   //--- Solange die Original-Breite des der "Karte" (img-Objekt) noch nicht wieder erreicht ist, ... ---
	if (document.images[x_obj].width < (cards_width - changestep) ) {
	  //--- wird sie sukzessive wieder IN-krementiert. ---
	  document.images[x_obj].width = (document.images[x_obj].width + changestep);
	  //--- Rekursiver Aufruf mit Zeitverzögerung ---
	  setTimeout("change_card("+p_id+","+p_old+","+p_img+")", 50)
	} else {
	  document.images[x_obj].width = cards_width;
	}
  }
}
-->