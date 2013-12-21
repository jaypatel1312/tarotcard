function get_abs(p) { 
//--Liefert den absoluten Betrag einer INTEGER-ZAHL zurck
    if (p<0) return p * -1
    else     return p
}

function extlinks(){
	for ( var i = 0; i < document.links.length; i++ ){
		if (document.links[i].href.substring(0,4) == "http"){
			document.links[i].target = "_blank";
			document.links[i].style.cursor = 'move';
		}
	}
}
function layer_get(p_id){    
//---Liefert einen Layer als Objekt zurck, dessen ID/Name als STRING bergeben wird
    if      (ie)  return document.getElementById(p_id); //document.all[p_id];
    else if (dom) return document.getElementById(p_id);
    else if (nsc) return document.layers[p_id];
    else          alert("Um Probleme auf dieser zu umgehen, installieren Sie bitte die jeweils aktuelle Version eines der folgenden Browser-Programme:\n- Microsoft Internet Explorer 6\n- Netscape 7.1\n- Mozilla 1.6\n- Opera 7");
    return false;
}

function layer_dimension(o) {
	// Thanks to http://javascript.jstruebig.de/
    var r = { top:0, left:0, width:0, height:0 };

    if(!o) return r;
    else if(typeof o == 'string' ) o = document.getElementById(o);
    
    if( typeof o != 'object' ) return r;

    if(typeof o.offsetTop != 'undefined') {
         r.height = o.offsetHeight;
         r.width = o.offsetWidth;
         r.left = r.top = 0;
         while (o && o.tagName != 'BODY') {
              r.top  += parseInt( o.offsetTop );
              r.left += parseInt( o.offsetLeft );
              o = o.offsetParent;
         }
    }
    return r;
}

function layer_top(p_id) { 
//---Liefert die Left-Position eines Layers zurck, der als OBJEKT bergeben wurde
    x_obj=layer_get(p_id);
    if (nsc) return parseInt(x_obj.top);
    else     return parseInt(x_obj.style.top);
}

function layer_left(p_id) { 
//---Liefert die Left-Position eines Layers zurck, der als OBJEKT bergeben wurde
    x_obj=layer_get(p_id);
	if (nsc) return parseInt(x_obj.left + 100);
    else     return parseInt(x_obj.style.left + 200);
}

function layer_height(p_id) { 
//---Liefert die Left-Position eines Layers zurck, der als OBJEKT bergeben wurde
    x_obj=layer_get(p_id);
    if (nsc) return parseInt(x_obj.height);
    else     return parseInt(x_obj.style.height);
}

function layer_zindex(p_id) { 
//---Liefert den Z-Index eines Layers zurck, der als OBJEKT bergeben wurde
    x_obj=layer_get(p_id);
    if (nsc) return parseInt(x_obj.zIndex);
    else     return parseInt(x_obj.style.zIndex);
}

function layer_display(p_id, p_display) { 
//---Setzt einen Layer, der als OBJEKT bergeben wird, auf unsichtbar
    x_obj=layer_get(p_id);
    if (nsc) {
        x_obj.display = p_display;
    } else {
        x_obj.style.display = p_display;
    }
}

function layer_hide(p_id) { 
//---Setzt einen Layer, der als OBJEKT bergeben wird, auf unsichtbar
    x_obj=layer_get(p_id);
    if (nsc) {
        x_obj.visibility = "hide";
    } else {
//        x_obj.style.innerHTML = "";
        x_obj.style.visibility = "hidden";
    }
}

function layer_show(p_id) { 
//---Setzt einen Layer, der als OBJEKT bergeben wird, auf sichtbar
    x_obj=layer_get(p_id);
    if (nsc) x_obj.visibility = "show"
    else     x_obj.style.visibility = "visible"
}

function layer_position(p_id, p_x, p_y) { 
//---ndert die Position eines Layers, der als OBJEKT bergeben wird.
    x_obj=layer_get(p_id);
    if (p_x < 1) p_x = 0;
    if (nsc) {
        x_obj.left = p_x;
        x_obj.top = p_y;
    } else if (ie)  {
        x_obj.style.left = p_x;
        x_obj.style.top = p_y;
    } else {
        x_obj.style.left = p_x + 'px';
        x_obj.style.top = p_y + 'px';
    }
}

function layer_move(p_id,p_x,p_y,p_delta) {
    var x_x = layer_left(p_id);
    var x_y = layer_top(p_id);
    if (x_x != p_x || x_y != p_y) {
        if (x_x > p_x)                    x_x = x_x - p_delta;
        if (x_x < p_x)                    x_x = x_x + p_delta;
        if (x_y  > p_y)                   x_y = x_y - p_delta;
        if (x_y  < p_y)                   x_y = x_y + p_delta;
        if (get_abs(x_x - p_x) < p_delta) x_x = p_x; 
        if (get_abs(x_y - p_y) < p_delta) x_y = p_y;
        layer_position(p_id,x_x,x_y);
//      alert("layer_move('"+p_id+"',"+p_x+","+p_y+","+p_delta);
        setTimeout("layer_move('"+p_id+"',"+p_x+","+p_y+","+p_delta+")",1)
    }
}

function layer_write_text(p_id,txt) { 
//---Schreibt einen, Text, der als STRING bergeben wird in einen Layer, der als OBJEKT bergeben wird
    x_obj=layer_get(p_id);
    if (nsc) {
        var lyr = x_obj.document;
        lyr.write(txt);
        lyr.close();
    } else if (ie) {
        x_obj.innerHTML = txt;
    } else {
        x_obj.innerHTML = txt;
    }
}

function layer_set_zindex(p_id,p_idx) { 
//---ndert den Z-Index eines Layers zurck, der als OBJEKT bergeben wurde
    x_obj=layer_get(p_id);
    if (nsc) x_obj.zIndex = p_idx;
    else     x_obj.style.zIndex = p_idx;
}