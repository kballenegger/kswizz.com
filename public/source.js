
// constants
var footerPositionBottom = 20;
var headerFadeOutDistance = 200;
var navPositionTop = 20;

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
    if (!$('#header-img-toggle').hasClass('contract'))
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
    var windowHeight = $(window).height();
    var newHeight = windowHeight;
    var newBackgroundPosition = 0;
    if (imageFullSizeHeight < windowHeight) {
        newHeight = imageFullSizeHeight;
    } else {
        newBackgroundPosition = (imageFullSizeHeight - windowHeight) / 2 * -1;
    }
    $('header').animate({'background-position-y': newBackgroundPosition, 'height': newHeight}, function() { headerExpandAnimationIsRunning = false; });
    $('header').css('border-bottom', 'none');
    $('#title, #container').fadeOut();
    $('#header-img-toggle').addClass('contract');
};
toggleHeaderClose = function () {
    headerExpandAnimationIsRunning = true;
    $('header').animate({'background-position-y': $('header').data('original-bg-offset'), 'height': $('header').data('original-height')}, function() { headerExpandAnimationIsRunning = false; });
    $('header').css('border-bottom', $('header').data('original-border-bottom'));
    $('#title, #container').fadeIn();
    $('#header-img-toggle').removeClass('contract');
    positionAll();
};

// setup the magic
$(document).ready(function() {
    
    // footer
    $('footer').before('<div id="footerPositionMarker"></div>');

    // header
    $('header').data('original-height', $('header').height());
    $('header').data('original-bg-offset', $('header').css('background-position-y'));
    $('header').data('original-border-bottom', $('header').css('border-bottom'));
    $('<div>').attr('id', 'header-img-toggle').appendTo('body').toggle(toggleHeaderOpen, toggleHeaderClose);

    $('header').data('original-header-top-position', parseInt($('header').css('background-position-y')));

    // navigation
    $('nav').before('<div id="navPositionMarker"></div>');
    
    // set up for dynamic positioning

    // no need to position nav at start, it actually hurts in some cases
    positionFooter();
    positionHeader();
    $(window).scroll(function() {
        positionAll();
    });
});




$(document).ready(function() {
    $(document).on('click', 'article a', function() {
        var href = $(this).attr('href');
        if (href.match(/\.(png|jpg|tiff)$/i) || href.match(/tumblr\.com\/photo/)) {
            img = new Image();
            img.src = href;
            $('#lightbox').html($('<img>').load(function() {
                var newWidth = img.width;
                var newHeight = img.height;
                var maxWidth = $(window).width() * 0.9;
                var maxHeight = $(window).height() * 0.9;
                if (newWidth > maxWidth) {
                    newHeight = newHeight * maxWidth / newWidth;
                    newWidth = maxWidth;
                }
                if (newHeight > maxHeight) {
                    newWidth = newWidth * maxHeight / newHeight;
                    newHeight = maxHeight;
                }
                $(this).css('width', newWidth);
                $(this).css('height', newHeight);
                console.log('lightbox display for image size: '+newWidth+'px x '+newHeight+'px');
                $('#lightbox').lightbox_me({
                    centered: true,
                    onClose: function() { $('#lightbox').html(''); },
                    overlayCSS: { background: 'black', opacity:.9 },
                    modalCSS: {
                        top: '50%',
                        'margin-top': -1 * (newHeight / 2) + scrollTop, 
                        left: '50%',
                        'margin-left': -1 * (newWidth / 2), 
                        position: 'absolute',
                        width: newWidth,
                        height: newHeight
                    }
                });
            }).attr('src', href));
            
            return false;
        }
    });
});


// kudos button

$(document).ready(function() {
    // TODO: deal with dynamically added items
    $('article .kudos').each(function() {
        postId = $(this).data('post-id');
        console.log('hello world '+postId);
        $.get('http://app.kswizz.com/kudos/count/'+postId, function(data) {
            $('#'+postId+' .kudos-value').html(data.count);
        });
    });
    $('article .kudos').on('click', function() {
        postId = $(this).data('post-id');
        console.log('hello world '+postId);
        $.get('http://app.kswizz.com/kudos/increment/'+postId, function(data) {
            // todo: add neat animation here
            $('#'+postId+' .kudos-value').html(data.count);
        });
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


