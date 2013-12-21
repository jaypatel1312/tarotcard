function pick_card(p_id)
{
	var left = $("#L"+p_id).css("left");
	var top = $("#L"+p_id).css("top");
	$("#E1").css({"left":left,"top":top});
	$("#tarot_layerframe>div,.content_main").not("#E1,#E2").hide();
	$("#E1 img").attr("src","images/"+p_id+".gif");
	$("#E0").html(ctext[p_id][1]);
	$("#H0").html(titel[p_id]);
	$("#E1").show();
	
	$("#E1").animate({
		opacity:1,
		width: '232px',
 	    height: '292px',
		left:'450px',
		top:'100px'
    });	
	
	$("#H0").css({"font-weight":"bold"});
	$("#E0,#H0").fadeIn();	
	
}