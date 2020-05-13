$(document).ready(function() {



    $('.lang span').on('click', function() {
        $('.lang ul').slideToggle();
    });

});




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