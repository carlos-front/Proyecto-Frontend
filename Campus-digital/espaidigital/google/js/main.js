$(document).ready(function() {

    animate_loop_first_car();
    animate_loop_third_car();

    $('#cloud-contacta-1').pan({fps: 30, speed: 0.5, dir: 'right'});
    $('#cloud-contacta-2').pan({fps: 30, speed: 1, dir: 'right'});

    $('#cloud-localiza-1').pan({fps: 30, speed: 0.8, dir: 'right'});
    $('#cloud-localiza-2').pan({fps: 30, speed: 1.5, dir: 'right'});

    $('#cloud-agenda-1').pan({fps: 30, speed: 0.8, dir: 'right'});
    $('#cloud-agenda-2').pan({fps: 30, speed: 1.5, dir: 'right'});

    $('#cloud-comparte-1').pan({fps: 30, speed: 0.5, dir: 'right'});

    $('#cloud-comunica-1').pan({fps: 30, speed: 0.5, dir: 'right'});
    $('#cloud-comunica-2').pan({fps: 30, speed: 1.5, dir: 'right'});

    $('#cloud-traduce-1').pan({fps: 30, speed: 0.6, dir: 'right'});
    $('#cloud-traduce-2').pan({fps: 30, speed: 1.2, dir: 'right'});

    $('#cloud-recuerda-1').pan({fps: 30, speed: 0.8, dir: 'right'});
    $('#cloud-recuerda-2').pan({fps: 30, speed: 1.5, dir: 'right'});

    $('#cloud-imprime-1').pan({fps: 30, speed: 0.5, dir: 'right'});
    $('#cloud-imprime-2').pan({fps: 30, speed: 1, dir: 'right'});


    checkbox();


    $('.link-modal').on('click', function() {
        $('body').css('overflow-y','hidden');
        $('.overlay').fadeIn( "fast", function() {
            $('#modal').fadeIn("fast");
        });
    });

    $('.btn-close-modal').on('click', function() {
        $('body').css('overflow-y','auto');
        $('#modal').fadeOut( "fast", function() {
            $('.overlay').fadeOut("fast");
        });
    });


    $('.lang span').on('click', function() {
        $('.lang ul').slideToggle();
    });

});

animate_loop_first_car = function animate_loop_first_car(){
    $('.first-car').animate({
        left: 276,
        top: 197
    }, 100,function(){
        $('.first-car').animate({
            left: 275,
            top: 196
        },100)
        animate_loop_first_car();
    } );
}

animate_loop_third_car = function animate_loop_third_car(){
    $('.third-car').animate({
        left: 345,
        top: 8129
    }, 100,function(){
        $('.third-car').animate({
            left: 344,
            top: 8128
        },100)
        animate_loop_third_car();
    } );
}

$(window).scroll(function () {

    //Animate Second car
    if ($(this).scrollTop() >= 2500) {
        $('.second-car').animate({
            top: 3444
        }, 5000, 'linear');
    }

    //Animate Truck
    if ($(this).scrollTop() >= 3944) {
        $('.truck').animate({
            top: 5744
        }, 6000, 'linear');
    }

});

/*=============================================== checkbox ===============================================*/
function checkbox() {

    $(".check").each(function(){
        $(this).find("input").after('<span class="checkbox"></span>');
    });


    var element = $(".checkbox");

    $(".check").each(function(i) {
        var self = this;
        var myElement = $('.checkbox').eq(i);

        $(self).click(function() {

            var checkbox = $(self).find(".checkbox");
            var input = $(self).find("input");

            // cambiar clase
            if(input.is(":checked")){

                input.prop("checked", false);
                checkbox.removeClass("active");

            }else{

                input.prop("checked", true);
                checkbox.addClass("active");
                $(self).removeClass("error");

            }

            return false;

        });

    });
}
/*=============================================== end checkbox ===============================================*/

if(navigator.appVersion.indexOf("MSIE 8.")!=-1) {
// To test the @id toggling on password inputs in browsers that don’t support changing an input’s @type dynamically (e.g. Firefox 3.6 or IE), uncomment this:
// $.fn.hide = function() { return this; }
// Then uncomment the last rule in the <style> element (in the <head>).
    $(function () {
        // Invoke the plugin
        $('input, textarea').placeholder({customClass: 'my-placeholder'});
        // That’s it, really.

        var html;

        if ($.fn.placeholder.input && $.fn.placeholder.textarea) {
            html = '<strong>Your current browser natively supports <code>placeholder</code> for <code>input</code> and <code>textarea</code> elements.</strong> The plugin won’t run in this case, since it’s not needed. If you want to test the plugin, use an older browser.';
        } else if ($.fn.placeholder.input) {
            html = '<strong>Your current browser natively supports <code>placeholder</code> for <code>input</code> elements, but not for <code>textarea</code> elements.</strong> The plugin will only do its thang on the <code>textarea</code>s.';
        }

        if (html) {
            $('<p class="note">' + html + '</p>').insertBefore('form');
        }
    });
}

function dninif ( value, element ) {
    "use strict";

    value = value.toUpperCase();

    // Basic format test
    if ( !value.match('((^[A-Z]{1}[0-9]{7}[A-Z0-9]{1}$|^[T]{1}[A-Z0-9]{8}$)|^[0-9]{8}[A-Z]{1}$)') ) {
        return false;
    }

    // Test NIF
    if ( /^[0-9]{8}[A-Z]{1}$/.test( value ) ) {
        return ( "TRWAGMYFPDXBNJZSQVHLCKE".charAt( value.substring( 8, 0 ) % 23 ) === value.charAt( 8 ) );
    }
    // Test specials NIF (starts with K, L or M)
    if ( /^[KLM]{1}/.test( value ) ) {
        return ( value[ 8 ] === String.fromCharCode( 64 ) );
    }
    /* Fin validacion NIF */
    /* Inicio validacion NIE */
    if (/^[T]{1}/.test(value)) {
        return (value[ 8 ] === /^[T]{1}[A-Z0-9]{8}$/.test(value));
    }
    // Con los que empiezan por XYZ
    if (/^[XYZ]{1}/.test(value)) {
        return (
            value[ 8 ] === "TRWAGMYFPDXBNJZSQVHLCKE".charAt(
                value.replace('X', '0')
                    .replace('Y', '1')
                    .replace('Z', '2')
                    .substring(0, 8) % 23
            )
        );
    }
}