$(document).ready(function() {

    $('.lang span').on('click', function() {
        $('.lang ul').slideToggle();
    });

    $(window).scroll(function(){
        var posY = ($(this).scrollTop() + 120);
        $('.modal').css('top',posY);
    });

    $('.link-modal').on('click', function(e) {
        e.preventDefault();
        var nameID = $(this).attr('data-type');
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

    $('.overlay').on('click', function() {
        $('html, body').css("overflow-y","auto");
        $('.modal').fadeOut( "fast", function() {
            $('.overlay').fadeOut("fast");
        });
    });

});