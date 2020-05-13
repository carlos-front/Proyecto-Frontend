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
            'email': {emailAddress: true, required: true},
            'dni': {nifES: true, required: true},
            'tool[]': {required: true, minlength: 1}/*,
            'accept': {required: true}*/
        },
        messages: {
            'nombre': 'Escriu el teu nom i cognoms.',
            'email': 'El correu electrònic introduït no és vàlid.',
            'dni': 'El NIF o NIE introduït no és vàlid.',
            'tool[]': 'Heu de seleccionar almenys una eina.'/*,
            'accept': 'Ha d´acceptar les condicions.'*/
        },
        invalidHandler: function(form) {
            setTimeout(function(){
                $('.form-shadow').css('height',$('.form-home__content').outerHeight());
            }, 10);
        },
        ignore: ":hidden:not(select)"
    });


    // validar formulario en IE8
    if(navigator.appVersion.indexOf("MSIE 8.")!=-1) {
        $(document).on('submit', '#formContact', function (e) {
            e.preventDefault();

            var formContact = document.getElementById('formContact');
            var validFormMsg = '';

            // elementos de formulario a validar:
            // nombre y apellidos
            if (formContact.elements['nombre'].value == 'Escriu el teu nom i cognoms'
                || formContact.elements['nombre'].value.length < 3) {
                validFormMsg = "<p>Escriu el teu nom i cognoms.</p>";
            }


            // dni/nif/nie
            if (formContact.elements['dni'].value == 'Escriu el teu NIF o NIE'
                || formContact.elements['dni'].value.length == 0
                || !dninif(formContact.elements['dni'].value) ) {
                validFormMsg = "<p>El dni introduït no és vàlid.</p>";
            }

            // email
            if (formContact.elements['email'].value == 'Escriu el teu correu electrònic'
                || formContact.elements['email'].value.length == 0
                || !(/(([\w]+)(\.)?)+@(([\w]+)(\.)?)+\.([\w]+){2,}/.test(formContact.elements['email'].value))) {
                validFormMsg = "<p>El correu electrònic introduït no és vàlid.</p>";
            }

            // checkboxs
            var herramientas = true;
            if ($('.require-one:checked').length == 0) {
                herramientas = false;
            }

            if (!herramientas) {
                validFormMsg = "<p>Heu de seleccionar almenys una eina.</p>";
            }

            // acpetar términos
            /*var terms = true;
            if ($('input[name="accept"]:checked').length == 0) {
                terms = false;
            }

            if (!terms) {
                validFormMsg = "<p>Heu d´acceptar les condicions.</p>";
            }*/

            // mensaje para el modal de error
            var titleMsg = '<p><strong>Revisi els següents camps del formulari:</strong>';

            titleMsg += (validFormMsg == '') ? '</p>' : '</p>';

            if (validFormMsg == '') {
                $('#formContact').submit();
            } else {
                // mostrar modal de error en algún campo
                var titleDialog = "Formulari";
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