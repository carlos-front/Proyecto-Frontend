$(document).ready(function() {


    // Método adicional validación url
    /*$.validator.addMethod('urldirection', function (value) {
        return /^https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/.test(value);
    }, 'El correu electrònic introduït no és vàlid');*/


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
        'El NIF o NIE introduït no és vàlid');


    $('#formContact').validate({
        rules: {
            'nombre': {required: true, minlength: 2},
            'apellidos': {required: true, minlength: 2},
            'email': {emailAddress: true, required: true},
            'dni': {nifES: true, required: true},
            'url': {required: true, minlength: 2},
            //'url': {url: true, required: true},
            'accept': {required: true}
        },
        messages: {
            'nombre': 'Escriu el teu nom.',
            'apellidos': 'Escriu els teus cognoms.',
            'email': 'El correu electrònic introduït no és vàlid.',
            'dni': 'El NIF o NIE introduït no és vàlid.',
            'url': 'L´adreça introduïda no és vàlida.',
            'accept': 'Has d´acceptar els termes i condicions.'
        }
    });


    // validar formulario en IE8
    if(navigator.appVersion.indexOf("MSIE 8.")!=-1) {
        $(document).on('submit', '#formContact', function (e) {
            e.preventDefault();

            var formContact = document.getElementById('formContact');
            var validFormMsg = '';

            // elementos de formulario a validar:
            // nombre
            if (formContact.elements['nombre'].value == 'Escriu el teu nom'
                || formContact.elements['nombre'].value.length < 3) {
                validFormMsg = "<p>El camp nom és requerit</p>";
            }


            // apellidos
            if (formContact.elements['apellidos'].value == 'Escriu els teus cognoms'
                || formContact.elements['apellidos'].value.length < 3) {
                validFormMsg = "<p>El camp cognoms és requerit</p>";
            }

            // dni/nif/nie
            if (formContact.elements['dni'].value == 'Escriu el teu NIF o NIE'
                || formContact.elements['dni'].value.length == 0
                || !dninif(formContact.elements['dni'].value) ) {
                validFormMsg = "<p>El dni es requerit.</p>";
            }

            // email
            if (formContact.elements['email'].value == 'Escriu el teu correu electrònico'
                || formContact.elements['email'].value.length == 0
                || !(/(([\w]+)(\.)?)+@(([\w]+)(\.)?)+\.([\w]+){2,}/.test(formContact.elements['email'].value))) {
                validFormMsg = "<p>L'email és requerit.</p>";
            }


            // mensaje para el modal de error
            var titleMsg = '<p><strong>Revisi els següents camps del formulari:</strong>';

            titleMsg += (validFormMsg == '') ? '</p>' : '</p>';

            if (validFormMsg == '') {
                $('#formContact').submit();
            } else {
                // mostrar modal de error en algún campo
                var titleDialog = "Formulario";
                $("#error-general").html(titleMsg + validFormMsg + '</p>');

                $("#error-general").dialog({
                    modal: true,
                    draggable: false,
                    title: titleDialog
                });
            }

        });
    }

});