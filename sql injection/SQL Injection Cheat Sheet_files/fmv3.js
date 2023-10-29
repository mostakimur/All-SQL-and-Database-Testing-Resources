/*
    Ferruh Mavituna for FMv3
    
    14-04-2008
    First adventure on JQuery, Don't be harsh on the code!
*/

var LOADER_IMAGE = "/mg/loader.gif";
var LOADING_HTML = "<img src='"+LOADER_IMAGE+"' width='16' height='16' alt='Y&#252;kleniyor' />"
var anispeed=1;

$(document).ready(
    function(){
        // Preload AJAX Image
        $.preloadImages(LOADER_IMAGE,"/mg/icons/hide.gif","/mg/icons/show.gif");
        
        // Assign navigation toggle navigation
        $(".jnavigation").toggle(function(){HideNavigation(true)},function(){HideNavigation(false)});
        
        // Remember Navigation
        if($.cookie("navigation")==1)
                $(".jnavigation").trigger("click");
        
                
        hilite(getQueryVariable("q"));
        
        getLiveComments("1");//force to update
        setInterval(getLiveComments,60000);
    })
;

var oldData="";
// Get comments and update the last comments if something changed
function getLiveComments(first){
//    return;
	if(first=="undefined")
            first = "0";
            
    $.get('/ajax/lastcomments/?first='+ first +'&'+ Math.random(),function(data){
    
        if(data!="" && data!=oldData){
               $("#livecomments").html(data);
                    if(first!="1")
                        $("#livecomments").highlightFade();                       
            }
        
        oldData=data;
    });
}

$.fn.image = function(src){
   return this.each(function(){
     $("<img />").appendTo(this).each(function(){
        this.src = src;
        //this.onload = f;
     });
   });
}



/* Hilite supplied keyword */
function hilite(q){
    if(q!=undefined){
        $(document).SearchHighlight({exact:"whole", style_name_suffix:false, debug_referrer: "http://www.google.com?q="+encodeURI(q)});
    }else{
        $(document).SearchHighlight({exact:"whole",style_name_suffix:false});
    }    
}

/* Get Querystring Value from - http://www.idealog.us/2006/06/javascript_to_p.html */
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {return pair[1];}
    } 
    
}

/*      Toggle Navigation       */
function HideNavigation(hide){
    $.cookie("navigation", (hide)?1:0, { expires: 60, path: "/"});
    
    if(!hide)
        $("#content").animate({width:"600px"}, anispeed);
        
        
    $(".jnavigation").html((!hide)?"<img src='/mg/icons/hide.gif' width='17' height='16' class='abs' alt='' /> Men&#252;y&#252; Gizle":"<img src='/mg/icons/show.gif' width='17' height='16' class='abs' alt='' /> Men&#252;y&#252; G&#246;ster");
    
    $("#navigation").slideToggle(anispeed, function(){
        if(hide)//$("#navigation").is(":hidden")
            $("#content").animate({
                width : "900px"
            },anispeed);
            
            anispeed=400;
    } );
      
      
              
}

/**
 * @author Klaus Hartl/klaus.hartl@stilbuero.de / GPL
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/*
    JQuery preload plugin, http://www.mattfarina.com/2007/02/01/preloading_images_with_jquery
*/
jQuery.preloadImages = function()
{
  for(var i = 0; i<arguments.length; i++)
  {
    jQuery("<img>").attr("src", arguments[i]);
  }
}





/**
 *  jQuery Plugin highlightFade (jquery.offput.ca/highlightFade)
 *  (c) 2006 Blair Mitchelmore (offput.ca) blair@offput.ca
*/
jQuery.fn.highlightFade = function(settings) {
	var o = (settings && settings.constructor == String) ? {start: settings} : settings || {};
	var d = jQuery.highlightFade.defaults;
	var i = o['interval'] || d['interval'];
	var a = o['attr'] || d['attr'];
	var ts = {
		'linear': function(s,e,t,c) { return parseInt(s+(c/t)*(e-s)); },
		'sinusoidal': function(s,e,t,c) { return parseInt(s+Math.sin(((c/t)*90)*(Math.PI/180))*(e-s)); },
		'exponential': function(s,e,t,c) { return parseInt(s+(Math.pow(c/t,2))*(e-s)); }
	};
	var t = (o['iterator'] && o['iterator'].constructor == Function) ? o['iterator'] : ts[o['iterator']] || ts[d['iterator']] || ts['linear'];
	if (d['iterator'] && d['iterator'].constructor == Function) t = d['iterator'];
	return this.each(function() {
		if (!this.highlighting) this.highlighting = {};
		var e = (this.highlighting[a]) ? this.highlighting[a].end : jQuery.highlightFade.getBaseValue(this,a) || [255,255,255];
		var c = jQuery.highlightFade.getRGB(o['start'] || o['colour'] || o['color'] || d['start'] || [255,255,128]);
		var s = jQuery.speed(o['speed'] || d['speed']);
		var r = o['final'] || (this.highlighting[a] && this.highlighting[a].orig) ? this.highlighting[a].orig : jQuery.curCSS(this,a);
		if (o['end'] || d['end']) r = jQuery.highlightFade.asRGBString(e = jQuery.highlightFade.getRGB(o['end'] || d['end']));
		if (typeof o['final'] != 'undefined') r = o['final'];
		if (this.highlighting[a] && this.highlighting[a].timer) window.clearInterval(this.highlighting[a].timer);
		this.highlighting[a] = { steps: ((s.duration) / i), interval: i, currentStep: 0, start: c, end: e, orig: r, attr: a };
		jQuery.highlightFade(this,a,o['complete'],t);
	});
};

jQuery.highlightFade = function(e,a,o,t) {
	e.highlighting[a].timer = window.setInterval(function() { 
		var newR = t(e.highlighting[a].start[0],e.highlighting[a].end[0],e.highlighting[a].steps,e.highlighting[a].currentStep);
		var newG = t(e.highlighting[a].start[1],e.highlighting[a].end[1],e.highlighting[a].steps,e.highlighting[a].currentStep);
		var newB = t(e.highlighting[a].start[2],e.highlighting[a].end[2],e.highlighting[a].steps,e.highlighting[a].currentStep);
		jQuery(e).css(a,jQuery.highlightFade.asRGBString([newR,newG,newB]));
		if (e.highlighting[a].currentStep++ >= e.highlighting[a].steps) {
			jQuery(e).css(a,e.highlighting[a].orig || '');
			window.clearInterval(e.highlighting[a].timer);
			e.highlighting[a] = null;
			if (o && o.constructor == Function) o.call(e);
		}
	},e.highlighting[a].interval);
};

jQuery.highlightFade.defaults = {
	start: [255,255,128],
	interval: 50,
	speed: 400,
	attr: 'backgroundColor'
};

jQuery.highlightFade.getRGB = function(c,d) {
	var result;
	if (c && c.constructor == Array && c.length == 3) return c;
	if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c))
		return [parseInt(result[1]),parseInt(result[2]),parseInt(result[3])];
	else if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c))
		return [parseFloat(result[1])*2.55,parseFloat(result[2])*2.55,parseFloat(result[3])*2.55];
	else if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c))
		return [parseInt("0x" + result[1]),parseInt("0x" + result[2]),parseInt("0x" + result[3])];
	else if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c))
		return [parseInt("0x"+ result[1] + result[1]),parseInt("0x" + result[2] + result[2]),parseInt("0x" + result[3] + result[3])];
	else
		return jQuery.highlightFade.checkColorName(c) || d || null;
};

jQuery.highlightFade.asRGBString = function(a) {
	return "rgb(" + a.join(",") + ")";
};

jQuery.highlightFade.getBaseValue = function(e,a,b) {
	var s, t;
	b = b || false;
	t = a = a || jQuery.highlightFade.defaults['attr'];
	do {
		s = jQuery(e).css(t || 'backgroundColor');
		if ((s  != '' && s != 'transparent') || (e.tagName.toLowerCase() == "body") || (!b && e.highlighting && e.highlighting[a] && e.highlighting[a].end)) break; 
		t = false;
	} while (e = e.parentNode);
	if (!b && e.highlighting && e.highlighting[a] && e.highlighting[a].end) s = e.highlighting[a].end;
	if (s == undefined || s == '' || s == 'transparent') s = [255,255,255];
	return jQuery.highlightFade.getRGB(s);
};

jQuery.highlightFade.checkColorName = function(c) {
	if (!c) return null;
	switch(c.replace(/^\s*|\s*$/g,'').toLowerCase()) {
		case 'aqua': return [0,255,255];
		case 'black': return [0,0,0];
		case 'blue': return [0,0,255];
		case 'fuchsia': return [255,0,255];
		case 'gray': return [128,128,128];
		case 'green': return [0,128,0];
		case 'lime': return [0,255,0];
		case 'maroon': return [128,0,0];
		case 'navy': return [0,0,128];
		case 'olive': return [128,128,0];
		case 'purple': return [128,0,128];
		case 'red': return [255,0,0];
		case 'silver': return [192,192,192];
		case 'teal': return [0,128,128];
		case 'white': return [255,255,255];
		case 'yellow': return [255,255,0];
	}
};
