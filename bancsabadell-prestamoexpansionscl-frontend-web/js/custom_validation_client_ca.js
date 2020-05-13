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
    }, 'No es permet utilitzar dígits');

    jQuery.validator.addMethod('incomeRange', function(value, element) {
        var income = value;
        return this.optional(element) || income >= 1000;
    }, 'Els ingressos anuals han de ser d\'un mínim de 1.000 Euros');

    jQuery.validator.addMethod("customEmail", function(value, element) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return this.optional(element) || regex.test(value);
    }, 'Introdueix un correu electrònic vàlid');

    jQuery.validator.addMethod('projectTotalRange', function(value, element) {
        var projectTotal = value;
        var totalRange = $('input[name="datos_simulador[capital]"]').val()/100;
        return this.optional(element) || projectTotal >= totalRange;
    }, 'El valor total del projecte ha de ser d\'un mínim de '+(deFloatAFormateoComMilesYComas($('input[name="datos_simulador[capital]"]').val()/100))+' Euros');

    jQuery.validator.addMethod("nifnie", function (value, element) {
        var typeDocument = $('input[name="id"]:checked').val();
        return this.optional(element) || validateNifNie(value, typeDocument);
    }, 'Introdueix un DNI o un NIE vàlid');

    jQuery.validator.addMethod('dateFormat', function(value, element) {
        return this.optional(element) || validaFechaDDMMAAAA(value);
        return false;
    }, 'La data d\'alta a l\'empresa ha de ser una data correcte');

    jQuery.validator.addMethod('phoneNumber', function(value, element) {
        var phone_number = value.replace(/\s+/g, "");
        return this.optional(element) || phone_number.match(/^[6-9]\d{8,}$/);
    }, 'El telèfon ha de ser vàlid'); // Phone Number starting with the digits 6,7,8 or 9 (Spain)

    jQuery.validator.addMethod('isAdult', function(value, element) {
        return minAge(value);
    }, 'Has de ser major de 18 anys');

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
                        required: 'Camp obligatori',
                        digits: 'El telèfon ha de ser vàlid',
                        minlength: 'El telèfon ha de ser vàlid',
                        maxlength: 'El telèfon ha de ser vàlid',
                        phoneNumber: 'El telèfon ha de ser vàlid'
                    },
                    'accept-call': {
                        required: 'Has d\'acceptar el règim de protecció de dades'
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
            errorMsg = 'Has d\'introduïr un valor correcte per a telèfon.';
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
            errorMsg = 'Has d\'acceptar el règim de protecció de dades.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#accept-call').hasClass('error') ) {
                $('#accept-call').removeClass('error').css('border','none');
            }
        }

        if( numErrors > 0) {
            $listErrorsHeading.html('<h4>'+numErrors+' incidències</strong> que impideixen continuar amb la sol·licitud.</h4>');

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
                        required: 'Camp obligatori',
                        minlength: 'El nom ha de ser vàlid'
                    },
                    'surname': {
                        required: 'Camp obligatori',
                        minlength: 'El cognom ha de ser vàlid'
                    },
                    'email': {
                        required: 'Camp obligatori'
                    },
                    'phone': {
                        required: 'Camp obligatori',
                        digits: 'El telèfon ha de ser vàlid',
                        minlength: 'El telèfon ha de ser vàlid',
                        maxlength: 'El telèfon ha de ser vàlid',
                        phoneNumber: 'El telèfon ha de ser vàlid'
                    },
                    'dob': {
                        required: 'Camp obligatori',
                        isAdult: 'Has de ser major d\'edat'
                    },
                    'income': {
                        required: 'Camp obligatori',
                        digits: 'Els ingressos anuals han de ser un valor numèric',
                        incomeRange: 'Els ingressos anuals han de ser d\'un mínim de 1.000 Euros'
                    },
                    'id': {
                        required: 'Camp obligatori'
                    },
                    'id_num': {
                        required: 'Camp obligatori',
                        nifnie: 'Número de document no vàlid'
                    },
                    'accept': {
                        required: 'Has d\'acceptar les condicions i termes'
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
        if( $('#name').val() == 'Nom' || $('#name').val().length < 2 ) {
            numErrors++;
            $('#name').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Has d\'introduïr un valor correcte per a nom (mínim 2 caràcters).';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#name').hasClass('error') ) {
                $('#name').removeClass('error').css('border','1px solid #000000');
            }
        }

        // Validate Surname
        if( $('#surname').val() == 'Cognoms' || $('#surname').val().length < 2 ) {
            numErrors++;
            $('#surname').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Has d\'introduïr un valor correcte per a cognom (mínim 2 caràcters).';
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
            errorMsg = 'Has d\'introduïr un valor correcte per a correu electrònic.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#email').hasClass('error') ) {
                $('#email').removeClass('error').css('border','1px solid #000000');
            }
        }

        // Validate Phone number
        if( $('#phone').val() == 'Telèfon' || $('#phone').val().length != 9 || !regexPhoneNumber.test($('#phone').val()) ) {
            numErrors++;
            $('#phone').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Has d\'introduïr un valor correcte per a telèfon.';
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
            errorMsg = 'Has d\'introduïr un valor per a data de naixement.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if (!minAge($('#dob').val())) {
                numErrors++;
                $('#dob').addClass('error');
                $('#dob').closest('.dropdown-date').find('span.selectboxit-container').css('border','1px solid #FF0000');
                errorMsg = 'Has d\'introduïr un valor per a data de naixement.';
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
            errorMsg = 'Has d\'introduïr un valor correcte per a ingressos anuals més gran de 1.000 euros.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('#income').hasClass('error') ) {
                $('#income').removeClass('error').css('border','1px solid #000000');
            }
        }

        // documento de identidad
        if (!$('input[name="id"]:checked').val()) {
            numErrors++;
            $('input[name="id_num"]').addClass('error').css('border','1px solid #FF0000');
            errorMsg = 'Has d\'introduïr un valor correcte per a Document d\'Identitat.';
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
            errorMsg = 'Has d\'introduïr un valor correcte per a número de document.';
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
            errorMsg = 'Has d\'acceptar el règim de protecció de dades.';
            $listErrors.append('<li>'+errorMsg+'</li>');
        } else {
            if( $('label.checkbox').hasClass('error') ) {
                $('label.checkbox').removeClass('error').css('border','none');
            }
        }

        if( numErrors > 0) {
            $listErrorsHeading.html('<h4>'+numErrors+' incidències</strong> que impideixen continuar amb la sol·licitud.</h4>');

            return false;
        }

        return true;
    }
});
