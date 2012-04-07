
// constants
var footerPositionBottom = 20;
var headerFadeOutDistance = 200;
var navPositionTop = 100;

var imageFullSizeHeight = 1333;

// state

var headerExpandAnimationIsRunning = false;
var scrollTop = 0;

// position functions

positionFooter = function() {
    if (scrollTop > ($('#footerPositionMarker').offset().top + $('footer').outerHeight() + footerPositionBottom) - $(window).height()) {
        $('footer').addClass('fixed');
    } else {
        $('footer').removeClass('fixed');
    }
};

positionNav = function() {
    if (scrollTop > $('#navPositionMarker').offset().top - navPositionTop) {
        $('nav').addClass('fixed');
    } else {
        $('nav').removeClass('fixed');
    }
};

positionHeader = function() {
    if (headerExpandAnimationIsRunning) return;
    if (scrollTop == 0) {
        $('#title').removeClass('hidden')
            .css('opacity', 1)
            .css('margin-top', 0);
    } else if (scrollTop > headerFadeOutDistance) {
        $('#title').addClass('hidden')
            .css('opacity', 0);
    } else {
        $('#title').removeClass('hidden')
            .css('opacity', 1 - (scrollTop * 1.0 / headerFadeOutDistance))
            .css('margin-top', -1 * (scrollTop / 3));
    }
    $('header').css('background-position-y', $('header').data('original-header-top-position') + (-1 * scrollTop / 4));
};

positionAll = function() {
    scrollTop = $(window).scrollTop();
    positionFooter();
    positionHeader();
    positionNav();
};

toggleHeaderOpen = function () {
    headerExpandAnimationIsRunning = true;
    $('header').animate({'background-position-y': 0, 'height': imageFullSizeHeight}, function() { headerExpandAnimationIsRunning = false; });
    $('#title, #container').fadeOut();
};
toggleHeaderClose = function () {
    headerExpandAnimationIsRunning = true;
    $('header').animate({'background-position-y': originalBgOffset, 'height': originalHeight}, function() { headerExpandAnimationIsRunning = false; });
    $('#title, #container').fadeIn();
    positionAll();
};

// setup the magic
$(document).ready(function() {
    
    // footer
    $('footer').before('<div id="footerPositionMarker"></div>');

    // header
    var originalHeight = $('header').height();
    var originalBgOffset = $('header').css('background-position-y');
    $('<div>').attr('id', 'header-img-toggle').appendTo('body').toggle(toggleHeaderOpen, toggleHeaderClose);

    $('header').data('original-header-top-position', parseInt($('header').css('background-position-y')));

    // navigation
    $('nav').before('<div id="navPositionMarker"></div>');
    
    // set up for dynamic positioning
    positionAll();
    $(window).scroll(function() {
        positionAll();
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


