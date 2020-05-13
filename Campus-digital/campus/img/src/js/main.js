/*$(window).load(function() {

    console.info(localStorage.getItem('bssession'));

    if ( localStorage.getItem('bssession') === null) {
        $('.overlay.escuela').fadeIn( "fast", function() {
            $('html, body').css("overflow-y","hidden");
            $('#onload').fadeIn("fast");
            localStorage.setItem('bssession', 'activa');
        });
    }

});*/


$(document).ready(function() {

    $('.lang span').on('click', function() {
        $('.lang ul').slideToggle();
    });


    $(window).scroll(function(){
        var posY = ($(this).scrollTop() + 20);
        $('.modal').css('top',posY);
    });

    $('.link-modal').on('click', function(e) {
        e.preventDefault(); // no page reload
        var nameID = $(this).attr('data-type');
        console.log(nameID);
        $('html, body').css("overflow-y","hidden");
        $('.overlay').fadeIn( "fast", function() {
            $('#'+nameID).fadeIn("fast");
        });
    });

    $('.btn-close-modal').on('click', function() {
        $('html, body').css("overflow-y","auto");
        $('.modal').fadeOut( "fast", function() {
            $('.overlay').fadeOut("fast");
        });
    });

    $('.blocks__link-close-modal').on('click', function() {
        $('html, body').css("overflow-y","auto");
        $('.modal').fadeOut( "fast", function() {
            $('.overlay').fadeOut("fast");
        });
    });

    $('.overlay').on('click', function() {
        $('html, body').css("overflow-y","auto");
        $('.modal').fadeOut( "fast", function() {
            $('.overlay').fadeOut("fast");
        });
    });


    $(".tabs-menu a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".tab-content").not(tab).css("display", "none");
        $(tab).fadeIn();
        if ($('.blocks__item').length) {
            $('.blocks__item').matchHeight();
        }
    });

    $(".tabs-menu-accordion a").click(function(event) {
        event.preventDefault();
        $(this).parent().addClass("current");
        $(this).parent().siblings().removeClass("current");
        var tab = $(this).attr("href");
        $(".tab-content-accordion").not(tab).css("display", "none");
        $(tab).fadeIn();
    });

    if ($('.blocks__item').length) {
        $('.blocks__item').matchHeight();
    }


    if ($('#groups').length) {
        var groups = $('#groupsId').val();
        $.getJSON('http://des.intradep.bancsabadell.com/AD_Services/api/user/current/groups/containsAny?groupnames=' + groups)
            .done(function (data) {
                if (data == true) {
                    $('#groups').css("display","block");
                }
            })
    }

    //Accordeon
    $('.accordion__btn').on('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('opened').next('.accordion__drop').slideToggle();
    });

    $('.owl-carousel').owlCarousel({
        loop: true,
        dots: true,
        nav: true,
        items: 1,
        mouseDrag: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        navText: [
            "",
            ""
        ]
    })

});