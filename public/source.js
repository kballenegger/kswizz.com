
// constants
var footerPositionBottom = 20;
var headerFadeOutDistance = 200;
var navPositionTop = 100;

// position functions

positionFooter = function() {
    if ($(window).scrollTop() > ($('#footerPositionMarker').offset().top + $('footer').outerHeight() + footerPositionBottom) - $(window).height()) {
        if (!$('footer').hasClass('fixed')) {
            $('footer').addClass('fixed');
        }
    } else {
        if ($('footer').hasClass('fixed'))
            $('footer').removeClass('fixed');
    }
}

positionNav = function() {
    if ($(window).scrollTop() > $('#navPositionMarker').offset().top - navPositionTop) {
        if (!$('nav').hasClass('fixed')) {
            $('nav').addClass('fixed');
        }
    } else {
        if ($('nav').hasClass('fixed'))
            $('nav').removeClass('fixed');
    }
}

positionHeader = function() {
    // title
    if ($(window).scrollTop() == 0) {
        $('#title').removeClass('hidden');
        $('#title').css('opacity', 1);
        $('#title').css('margin-top', 0);
    } else if ($(window).scrollTop() > headerFadeOutDistance) {
        console.log('hidden');
        $('#title').addClass('hidden');
        $('#title').css('opacity', 0);
    } else {
        $('#title').removeClass('hidden');
        $('#title').css('opacity', 1 - ($(window).scrollTop() * 1.0 / headerFadeOutDistance));
        $('#title').css('margin-top', -1 * ($(window).scrollTop() / 3));
    }
}

// setup the magic
$(document).ready(function() {
    
    $('footer').before('<div id="footerPositionMarker"></div>');
    positionFooter();
    
    positionHeader();

    $('nav').before('<div id="navPositionMarker"></div>');
    positionNav();
    
    $(window).scroll(function() {
        positionFooter();
        positionHeader();
        positionNav();
    });
});






// endless navigation, modified from Jake Paul's solstice


$(document).ready(function() {
    
	var start_page = $("#endless-data .startpage").text();
	var next_page = parseInt(start_page) + 1;
	var total_pages = $("#endless-data .totalpages").text();	
	var loading_next_page = false;
	var new_posts = "";
	var path = (window.location.pathname.match(/^\/(tagged|search)\//)) ? window.location.pathname : "";
	
	if ((navigator.userAgent.toLowerCase().match(/iPhone/i) != "iphone" ) && 
		(navigator.userAgent.toLowerCase().match(/iPod/i) != "ipod" ) )	{
			$("#classic").hide();
			$("#endless").show();
			$("#endless #more").bind("click", function(){newPosts();});
	}		
	
	function newPosts(){
		if ( (next_page <= total_pages) && (! loading_next_page) ){
			loading_next_page = true;
			$("#endless #more .label").hide();
			$("#endless #more .spinner").show();

			$.get(path + "/page/" + next_page + "?cb=" + Math.random(), function(data){
				new_posts = data.split('<!-- posts-start -->')[1].split('<!-- posts-end -->')[0];
				next_page++;
				loading_next_page = false;
				$("#endless #more .spinner").hide();
				$("#endless #more .label").show();
				if (next_page > total_pages) { $("#endless").hide(); };  // Hide the button if we run out of pages 
				$("article:last").after(new_posts);
		  	});
		}	
	}

});


