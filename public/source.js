
// constants
var footerPositionBottom = 20;
var headerCrownPositionTop = 10;
var headerFixedBackgroundHeight = 65;
var headerTextFadeDistance = 50;
var headerTextFadeStartOffset = 25;
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
    // crown
    if ($(window).scrollTop() > $('#crown').data('offset') - headerCrownPositionTop) {
        if (!$('#crown').hasClass('fixed')) {
            $('#crown').addClass('fixed');
        }
    } else {
        if ($('#crown').hasClass('fixed'))
            $('#crown').removeClass('fixed');
    }
    // background
    if ($(window).scrollTop() > $('header').data('original-height') - headerFixedBackgroundHeight) {
        if (!$('header').hasClass('fixed')) {
            $('header').addClass('fixed');
            $('#headerPlaceholder').addClass('fixed');
        }
    } else {
        if ($('header').hasClass('fixed')) {
            $('header').removeClass('fixed');
            $('#headerPlaceholder').removeClass('fixed');
        }
    }
    // text
    if ($(window).scrollTop() <= ($('#titleH1PositionMarker').offset().top - headerTextFadeStartOffset) - headerTextFadeDistance) {
        $('#title > h1').css('opacity', 1);
    } else if ($(window).scrollTop() > ($('#titleH1PositionMarker').offset().top - headerTextFadeStartOffset)) {
        $('#title > h1').css('opacity', 0);
    } else {
        $('#title > h1').css('opacity', ($(window).scrollTop() - ($('#titleH1PositionMarker').offset().top - headerTextFadeStartOffset)) * -1 / headerTextFadeDistance);
    }
    if ($(window).scrollTop() <= ($('#titlePPositionMarker').offset().top - headerTextFadeStartOffset) - headerTextFadeDistance) {
        $('#title > p').css('opacity', 1);
    } else if ($(window).scrollTop() > ($('#titlePPositionMarker').offset().top - headerTextFadeStartOffset)) {
        $('#title > p').css('opacity', 0);
    } else {
        $('#title > p').css('opacity', ($(window).scrollTop() - ($('#titlePPositionMarker').offset().top - headerTextFadeStartOffset)) * -1 / headerTextFadeDistance);
    }
}

// setup the magic
$(document).ready(function() {
    
    $('footer').before('<div id="footerPositionMarker"></div>');
    positionFooter();

    var crownHeight = $('#crown').height();
    var crownOffset = $('#crown').offset().top;
    $('#crown').attr('id', '').height(crownHeight)
        .prepend($('<div>').attr('id', 'crown').data('offset', crownOffset));
    $('header').data('original-height', $('header').height());
    $('header').before('<div id="headerPlaceholder"></div>');
    $('#title > h1').before('<div id="titleH1PositionMarker"></div>');
    $('#title > p').before('<div id="titlePPositionMarker"></div>');
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


