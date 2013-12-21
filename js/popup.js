// Initialisierung  der fixen Parameter //
var width		    = "150";		// 100-300 Pixel ist angenehm (Anz.d.Zeilen richtet sich nach Textl&auml;nge)
var border		    = "2";			// Rahmendicke 1-5 Pixel sind annehmbar
var offsetx		    = 10;			// Abstand popup Fenster neben der Maus; 3 - 12 sind annehmbar
var offsety		    = 10;			// Abstand popup Fenster unterhalb der Maus; 3 - 10 Pixel sind annehmbar
// Initialisierung  der Arbeitsvariablen //
var x			    = 0;
var y			    = 0;
var sx			    = 0;
var sy			    = 0;
var sichtbar	    = false;
var dir			    = 1;
var popup_layer		= '';
var additional_move = false;
var additional_par  = '';
// Ende der Initialisierung

if      (ie)  document.onmousemove = mouseMove;
else if	(nsc) document.captureEvents(Event.MOUSEMOVE);
else if	(dom) document.addEventListener("mousemove", mouseMove, true);
else          alert("Um Probleme mit dem Event-Handler zu umgehen, installieren Sie bitte die jeweils aktuelle Version eines der folgenden Browser-Programme:\n- Microsoft Internet Explorer 6\n- Netscape 7.1\n- Mozilla 1.6\n- Opera 7");

function popup_init(p_id_name) { // Einen Layer als Popup initialisieren
	popup_layer = layer_get(p_id_name);
//    if      (nsc) popup_layer.setAttribute('className', 'popup', 0);
//    else          popup_layer.className = 'popup';
	popup_hide(p_id_name);
}

// l&ouml;schen popup Hilfefenster
function popup_hide(p_id) {
	if ( (nsc) || (ie) || (dom)) {
		sichtbar = false;
		layer_hide(p_id);
		//layer_position(p_id,1,1);
		window.status = "";
	}
}

// Layer f&uuml;llen und anzeigen
//function popup_show(p_id, breit, titel, text) {
function popup_show(p_id, breit, text) {
	if (breit > 20) width = breit;
	layer_get(p_id).style.width = width;
//	txt='';
//	txt += '<h5>'+titel+'</h5>';
//	txt += '<p>'+text+'</p>'; //+'<br>'+browsertypHTML;
	dir = 0;
	if ((x - 20) < width) dir = 1; 
	if ( (nsc) || (ie) || (dom)) {
		if (dir == 1) layer_position(p_id,x+offsetx,y+offsety);		// Right
		if (dir == 0) layer_position(p_id,x-offsetx-width,y+offsety);	// Left
		if (sichtbar == false) {
//			layer_write_text(p_id,txt);
			layer_write_text(p_id,text);
			layer_show(p_id);
			sichtbar = true;
			//window.status = "--- " + titel + " ---";
		}
	}
}

// Layer positionieren
function mouseMove(e) {
	if (nsc) {
		mouse_x	= e.pageX;
		mouse_y	= e.pageY;
		x	= e.pageX;
		y	= e.pageY;
		zy	= window.pageYOffset + window.innerHeight				/* koo bis BS-Ende */
		zzy	= popup_layer.clip.height;
		if (y+zzy-5 > zy) y-=(zzy + offsety);
	} else 	if (ie) {
		mouse_x	= event.clientX;
		mouse_y	= event.clientY;
		x	= event.clientX;
		y	= event.clientY;
		sx	= document.body.scrollLeft;
		sy	= document.body.scrollTop;
		zy	= document.body.clientHeight;							// H&ouml;he des Bilschirminhaltes 
		zzy	= popup_layer.clientHeight						// H&ouml;he des Layers     
		if (y+zzy-5 > zy) y -= (zzy + offsety);
      	x = x + sx;
		y = y + sy;
	} else {
		mouse_x	= e.clientX; 
		mouse_y	= e.clientY + window.pageYOffset;
		x	= e.clientX; 
		y	= e.clientY + window.pageYOffset;
		zy	= window.innerHeight + window.pageYOffset;				/* Seitenende */
		zzy	= popup_layer.offsetHeight;		/* Elementh&ouml;he */
		zz	= window.pageYOffset;									/* = scroll H&ouml;he */
		if (y+zzy+offsety > zy) y-=(zzy + offsety);
	} 
	if (sichtbar) {
		if (dir == 1)	layer_position('pointerdiv',x+offsetx,y+offsety);		// rechts der Maus
		if (dir == 0)	layer_position('pointerdiv',x-offsetx-width,y+offsety);	// links der Maus
	}
    if (additional_move) mousemove_additional(additional_par);
}