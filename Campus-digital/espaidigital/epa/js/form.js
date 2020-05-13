$(document).ready(function() {



    // Método adicional validación email
    $.validator.addMethod('emailAddress', function (value) {
        return /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value);
    }, 'El correu electrònic introduït no és vàlid');

    // Mètode adicional validació NIF
    $.validator.addMethod( "nifES",
        function ( value, element ) {
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
        },
        'El NIF introduït no és vàlid');

    $('#formContact').validate({
        rules: {
            'nombre': {required: true, minlength: 2},
            'apellidos': {required: true, minlength: 2},
            'email': {emailAddress: true, required: true},
            'dni': {nifES: true, required: true}
        },
        messages: {
            'nombre': 'Escriu el teu nom.',
            'apellidos': 'Escriu els teus cognoms.',
            'email': 'El correu electrònic introduït no és vàlid.',
            'dni': 'El NIF o NIE introduït no és vàlid.'
        }
    });

});