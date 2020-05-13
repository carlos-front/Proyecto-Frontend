$(document).ready(function() {

    // Forms Validation
    function validateNifNie(value, typeDocument) {

        var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
        var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
        var nieRexp = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
        var str = value.toString().toUpperCase();

        if (!nifRexp.test(str) && !nieRexp.test(str)) return false;

        if (typeDocument === 'nif' && nifRexp.test(str)) {
            var letter = str.substr(str.length-1, 1);
            var charIndex = parseInt(str.substr(0, 8)) % 23;

            if (validChars.charAt(charIndex) === letter) return true;
        } else if (typeDocument === 'nie' && nieRexp.test(str)) {
            var nie = str
                .replace(/^[X]/, '0')
                .replace(/^[Y]/, '1')
                .replace(/^[Z]/, '2');

            var letter = str.substr(str.length-1, 1);
            var charIndex = parseInt(nie.substr(0, 8)) % 23;

            if (validChars.charAt(charIndex) === letter) return true;
        }

        return false;
    }

    jQuery.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Solo se permiten caracteres");

    jQuery.validator.addMethod('incomeRange', function(value, element) {
        var income = value;
        return this.optional(element) || income >= 1000;
    }, 'Los ingresos anuales deben ser de un mínimo de 1.000 Euros');

    jQuery.validator.addMethod("customEmail", function(value, element) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return this.optional(element) || regex.test(value);
    }, 'Introduce un correo electrónico válido');

    jQuery.validator.addMethod('projectTotalRange', function(value, element) {
        var projectTotal = value;
        var totalRange = $('input[name="datos_simulador[capital]"]').val()/100;
        return this.optional(element) || projectTotal >= totalRange;
    }, 'El valor total del proyecto debe ser de un mínimo de '+(deFloatAFormateoComMilesYComas($('input[name="datos_simulador[capital]"]').val()/100))+' Euros');

    jQuery.validator.addMethod("nifnie", function (value, element) {
        var typeDocument = $('input[name="id"]:checked').val();
        return this.optional(element) || validateNifNie(value, typeDocument);
    }, 'Introduce un DNI o un NIE válido');

    jQuery.validator.addMethod('dateFormat', function(value, element) {
        return this.optional(element) || validaFechaDDMMAAAA(value);
        return false;
    }, 'La fecha de alta en la empresa debe ser una fecha válida');

    jQuery.validator.addMethod('phoneNumber', function(value, element) {
        var phone_number = value.replace(/\s+/g, "");
        return this.optional(element) || phone_number.match(/^[6-9]\d{8,}$/);
    }, 'El telefono debe ser válido'); // Phone Number starting with the digits 6,7,8 or 9 (Spain)

    jQuery.validator.addMethod('isAdult', function(value, element) {        
        return minAge(value);
    }, 'Debes ser mayor de edad');

    // Form cliente
    if ($('#call-to').length) {

        if ($('html').hasClass('lt-ie9')) {

            $('#call-to').find('input[type="submit"]').on('click', function (event) {

                event.preventDefault();

                var form = validateIECall();

                if (!form) {
                    return false;
                } else {
                    submit_CTC_Final();
                    displayCallmeRequestSent();
                }

            });

        } else {

            // call me back validation
            $('#call-to').validate({
                ignore: false,
                rules: {
                    'phone-call': {
                        required: true,
                        digits: true,
                        minlength: 9,
                        maxlength: 9,
                        phoneNumber: true
                    },
                    'accept-call': {
                        required: true
                    }
                },                
                messages: {
                    'phone-call': {
                        required: 'Campo obligatorio',
                        digits: 'El teléfono debe ser válido',
                        minlength: 'El teléfono debe ser válido',
                        maxlength: 'El teléfono debe ser válido',
                        phoneNumber: 'El teléfono debe ser válido'
                    },
                    'accept-call': {
                        required: 'Debes aceptar el régimen de protección de datos'
                    }
                },
                errorPlacement: function (error, element) {
                    if (element.attr('name') === 'accept-call') {
                        error.insertAfter((element).next('p.accept'));
                    } else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function(form) {                    
                    $.get('#None', {phone: $(form).find('#phone-call').val()})
                    .done(function() {
                        submit_CTC_Final();
                        displayCallmeRequestSent();
                    });
                }
            });
        }
    }

    function validateIECall() {
        var errorMsg = '';
        var numErrors = 0;
        var $listErrorsHeading = $('#validation-errors-ie8').find('.header');
        var $listErrors = $('#validation-errors-ie8').find('ul.list-errors');

        $listErrorsHeading.html('');
        $listErrors.find('li').remove();

        var regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        var regexPhoneNumber = /^[6-9]\d{8,}$/;
        var regexIncome = /^[0-9]+$/;

        // Validate Phone number
        if( $('#phone-call').val() == 'Teléfono' || $('#phone-call').val().length != 9 || !regexPhoneNumber.test($('#phone-call').val()) ) {
            numErrors++;
            $('#phone-call').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor correcto para Teléfono.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#phone-call').hasClass('error') ) {
                $('#phone-call').removeClass('error').css('border','1px solid #000000');
            }
        }

        // Validate Accept terms & conditions
        if( !$('#accept-call').hasClass('checked') ) {
            numErrors++;
            $('#accept-call').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe aceptar el régimen de protección de datos.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#accept-call').hasClass('error') ) {
                $('#accept-call').removeClass('error').css('border','none');
            }
        }

        if( numErrors > 0) {
            $listErrorsHeading.html('<h4>'+numErrors+' incidencias</strong> que impiden continuar con su solicitud.</h4>');

            return false;
        }

        return true;
    }

    // Form cliente
    if ($('#envio-solicitud-cliente').length) {

        if ($('html').hasClass('lt-ie9')) {

            $('#envio-solicitud-cliente').find('input[type="submit"]').on('click', function(event) {

                event.preventDefault();

                var form = validateIEClient();

                if (!form) {
                    return false;
                } else {
                    $('#loading').css('display', 'block');
                    submitFinal();
                }

            });

        } else {

            $('#envio-solicitud-cliente').validate({
                ignore: false,
                rules: {
                    'name': {
                        required: true,
                        minlength: 2
                    },
                    'surname': {
                        required: true,
                        minlength: 2
                    },
                    'email': {
                        required: true,
                        customEmail: true
                    },
                    'phone': {
                        required: true,
                        digits: true,
                        minlength: 9,
                        maxlength: 9,
                        phoneNumber: true
                    },
                    'dob': {
                        required: true,
                        isAdult: true
                    },
                    'income': {
                        required: true,
                        digits: true,
                        incomeRange: true
                    },
                    'id': {
                        required: true
                    },
                    'id_num': {
                        required: true,
                        nifnie: true
                    },
                    'accept': {
                        required: true
                    }
                },
                messages: {
                    'name': {
                        required: 'Campo obligatorio',
                        minlength: 'El nombre debe ser válido'
                    },
                    'surname': {
                        required: 'Campo obligatorio',
                        minlength: 'Los apellidos deben ser válidos'
                    },
                    'email': {
                        required: 'Campo obligatorio'
                    },
                    'phone': {
                        required: 'Campo obligatorio',
                        digits: 'El teléfono debe ser válido',
                        minlength: 'El teléfono debe ser válido',
                        maxlength: 'El teléfono debe ser válido',
                        phoneNumber: 'El teléfono debe ser válido'
                    },
                    'dob': {
                        required: 'Campo obligatorio',
                        isAdult: 'Debes ser mayor de edad'
                    },
                    'income': {
                        required: 'Campo obligatorio',
                        digits: 'Los ingresos anuales deben ser un valor numérico',
                        incomeRange: 'Los ingresos anuales deben ser de un mínimo de 1.000 Euros'
                    },
                    'id': {
                        required: 'Campo obligatorio'
                    },
                    'id_num': {
                        required: 'Campo obligatorio',
                        nifnie: 'Número de documento no válido'
                    },
                    'accept': {
                        required: 'Debes aceptar las condiciones y términos'
                    }
                },
                errorPlacement: function (error, element) {
                    if (element.attr('name') === 'dob') {
                        error.insertAfter((element).closest('.dropdown-date'));
                    } else {
                        error.insertAfter(element);
                    }
                },
                submitHandler: function(form) {
                    $('#loading').css('display', 'block');
                    submitFinal();
                }
            });

        }

    }

    function validateIEClient() {
        var errorMsg = '';
        var numErrors = 0;
        var $listErrorsHeading = $('#validation-errors-ie8').find('.header');
        var $listErrors = $('#validation-errors-ie8').find('ul.list-errors');

        $listErrorsHeading.html('');
        $listErrors.find('li').remove();

        var regexEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        var regexPhoneNumber = /^[6-9]\d{8,}$/;
        var regexIncome = /^[0-9]+$/;
        var regexAlphabet = /^[a-zA-Z]*$/;

        // Validate Name
        if( $('#name').val() == 'Nombre' || $('#name').val().length < 2 ) {
            numErrors++;
            $('#name').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor para Nombre (mínimo 2 caracteres).';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#name').hasClass('error') ) {
                $('#name').removeClass('error').css('border','1px solid #000000');
            }
        }

        // Validate Surname
        if( $('#surname').val() == 'Apellidos' || $('#surname').val().length < 2 ) {
            numErrors++;
            $('#surname').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor para Apellidos (mínimo 2 caracteres)';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#surname').hasClass('error') ) {
                $('#surname').removeClass('error').css('border','1px solid #000000');
            }
        }

        // Validate Email
        if( $('#email').val() == 'Correo electrónico' || !$('#email').val() || !regexEmail.test($('#email').val()) ) {
            numErrors++;
            $('#email').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor correcto para Correo electrónico.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#email').hasClass('error') ) {
                $('#email').removeClass('error').css('border','1px solid #000000');
            }
        }

        // Validate Phone number
        if( $('#phone').val() == 'Teléfono' || $('#phone').val().length != 9 || !regexPhoneNumber.test($('#phone').val()) ) {
            numErrors++;
            $('#phone').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor correcto para Teléfono.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#phone').hasClass('error') ) {
                $('#phone').removeClass('error').css('border','1px solid #000000');
            }
        }

        // Validate Date of birth
        if( $('#dob').val().length == 0) {

            numErrors++;
            $('#dob').addClass('error');
            $('#dob').closest('.dropdown-date').find('span.selectboxit-container').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor correcto para Fecha de nacimiento.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if (!minAge($('#dob').val())) {
                numErrors++;
                $('#dob').addClass('error');
                $('#dob').closest('.dropdown-date').find('span.selectboxit-container').css('border','1px solid #FF0000');
                errorMsg = 'Debe introducir un valor correcto para Fecha de nacimiento.';
                $listErrors.append('<li>'+errorMsg+'</li>');

            } else {


                if( $('#dob').hasClass('error') ) {
                    $('#dob').closest('.dropdown-date').find('span.selectboxit-container').css('border','none');
                }
            }
        }

        // Validate Income
        if( $('#income').val() == 'Ingresos anuales' || !$('#income').val() || !regexIncome.test($('#income').val()) || $('#income').val() < 1000 ) {
            numErrors++;
            $('#income').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor para Ingresos anuales superior a 1000 euros.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#income').hasClass('error') ) {
                $('#income').removeClass('error').css('border','1px solid #000000');
            }
        }

        // documento de identidad
        if (!$('input[name="id"]:checked').val()) {
            numErrors++;
            $('input[name="id"]').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor para Documento de Identidad.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if ($('input[name="id"]').hasClass('error')) {
                $('input[name="id"]').removeClass('error').css('border', '1px solid #000000');
            }
        }

        // numero de documento
        var typeDocument = $('input[name="id"]:checked').val();
        if( $('#id_num').val() == 'Número documento' || !$('#id_num').val() || !validateNifNie($('#id_num').val(), typeDocument) ) {
            numErrors++;
            $('#id_num').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe introducir un valor correcto para Número documento.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#id_num').hasClass('error') ) {
                $('#id_num').removeClass('error').css('border','1px solid #000000');
            }
        }

        // Validate Accept terms & conditions
        if( !$('label.checkbox').hasClass('checked') ) {
            numErrors++;
            $('label.checkbox').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Debe aceptar las condiciones de contratación y regimen de protección de datos.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('label.checkbox').hasClass('error') ) {
                $('label.checkbox').removeClass('error').css('border','none');
            }
        }

        if( numErrors > 0) {
            $listErrorsHeading.html('<h4>'+numErrors+' incidencias</strong> que impiden continuar con su solicitud.</h4>');

            return false;
        }

        return true;
    }
});
