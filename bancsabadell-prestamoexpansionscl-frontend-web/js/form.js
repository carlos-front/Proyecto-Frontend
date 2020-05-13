(function(){
	paramsValues = {
		name: "",
		surname: "",
		email: "",
		phone: "",
		day: "",
		month:"",
		year:"",
		income:"",
		nif: "",
		nie:""

	}
	$(window).on("load", function(){
		if (paramsValues.day) {
			var spanDay = $(".dropdown-date > span")[0];
			$(spanDay).find('.selectboxit-text').html(paramsValues.day);
			$('.dropdown-date').find('select.day').val(paramsValues.day);
		}
		if (paramsValues.month) {
			var spanDay = $(".dropdown-date > span")[1];
			$(spanDay).find('.selectboxit-text').html(paramsValues.month);
			$('.dropdown-date').find('select.month').val(paramsValues.month);
		}
		if (paramsValues.year) {
			var spanDay = $(".dropdown-date > span")[2];
			$(spanDay).find('.selectboxit-text').html(paramsValues.year);
			$('.dropdown-date').find('select.year').val(paramsValues.year);
		}
		if(paramsValues.day && paramsValues.month && paramsValues.year){
			$('.dropdown-date').find('select').trigger("change");
		}


		if (paramsValues.nif) {
			$("#id_by_nif").click();
			$("#id_num").prev().addClass("focusing");
			$("#id_num").val(paramsValues.nif)
		}
		if (paramsValues.nie) {
			$("#id_by_nie").click();
			$("#id_num").prev().addClass("focusing");
			$("#id_num").val(paramsValues.nie)
		}
	});
$(document).ready(function() {

	//read parameters url
		var params = window.location.href.split("?");

		if (params.length>1) {
			var params_array = decodeURI(params[1]).split("&");

			console.log("params_array", params_array);
			for (var i=0;i<params_array.length;i++){
				var p = params_array[i];
				if (/nombre/.test(p)) paramsValues.name = p.split("=")[1];
				else if (/apellidos/.test(p)) paramsValues.surname = p.split("=")[1];
				else if (/email/.test(p)) paramsValues.email = p.split("=")[1];
				else if (/telefono/.test(p)) paramsValues.phone = p.split("=")[1];
				else if (/dia/.test(p)) paramsValues.day = p.split("=")[1];
				else if (/mes/.test(p)) paramsValues.month = p.split("=")[1];
				else if (/año/.test(p)) paramsValues.year = p.split("=")[1];
				else if (/income/.test(p)) paramsValues.income = p.split("=")[1];
				else if (/nif/.test(p)) paramsValues.nif = p.split("=")[1];
				else if (/nie/.test(p)) paramsValues.nie = p.split("=")[1];
			}
		}

		if(paramsValues.name || paramsValues.surname || paramsValues.email || paramsValues.phone || paramsValues.day || paramsValues.month || paramsValues.year || paramsValues.income || paramsValues.nif || paramsValues.nie ){
			$('#form-client').click();
		}

		if (paramsValues.name) {
			$('#name').val(paramsValues.name);
			$("label[for=name]").addClass('focusing');
		}
		if (paramsValues.surname) {
			$('#surname').val(paramsValues.surname);
			$("label[for=surname]").addClass('focusing');
		}
		if (paramsValues.email) {
			$('#email').val(paramsValues.email);
			$("label[for=email]").addClass('focusing');
		}
		if (paramsValues.phone) {
			$('#phone').val(paramsValues.phone);
			$("label[for=phone]").addClass('focusing');
		}
		if (paramsValues.income) {
			$('#income').val(paramsValues.income);
			$("label[for=income]").addClass('focusing');
		}

    lang = ($('html').attr('lang')).indexOf('-') != -1 ? ($('html').attr('lang')).substring(0, 2) : $('html').attr('lang');

    initFormGroupRadiotabs();

    // Dropdown Datepicker
    $('#dob').dateDropdowns({
        submitFormat: 'dd/mm/yyyy',
        daySuffixes: false,
        minAge: 18,
        maxAge: 117,
        wrapperClass: 'dropdown-date',
        language: lang
    });

    // SelectBoxIt
    $('.dropdown-date').find('select').selectBoxIt({
        showFirstOption: false,
        aggressiveChange: true,
        showEffect: 'fadeIn',
        hideEffect: 'fadeOut'
    });

    $('.select-custom').selectBoxIt({
        showFirstOption: false,
        aggressiveChange: true,
        showEffect: 'fadeIn',
        hideEffect: 'fadeOut',
        downArrowIcon: 'arrow-down'
    });

    $('.select-custom.select-trigger-fields').bind({
        'changed': function(event) {
            var triggeredField = $(this).find('option:selected').data('fields');
            var triggeredFieldLabelValue = $(this).find('option:selected').data('label-value');

            if ($(this).closest('.form-group-radiotabs').find('.form-group-radiotab-panel').length) {

                var $tabToShow = $(this).closest('.form-group-radiotabs').find('.form-group-radiotab-panel');

                var conditionalFields = triggeredField !== undefined ? triggeredField.split(' ') : null;

                var labelValue = triggeredFieldLabelValue !== undefined ? triggeredFieldLabelValue : null;

                displayTabConditionalFields($tabToShow, conditionalFields, labelValue);

            }
        }
    });

    // Date of Birth Component - DD Select/MM Select/YYYY Select
    $('.dropdown-date').find('select').on({
        'changed': function(event, element) {

            var dateIsSelected = true;

            $(event.target).parent('.dropdown-date').find('select').each(function() {
                var $dropdownDateSelect = $(this);

                if (!$dropdownDateSelect.val()) {
                    dateIsSelected = false;
                }

            });

            //console.log("val", $('#dob').val());
            if (dateIsSelected){
                window.setTimeout(function(){
                    $("#dob").valid();
                }, 100);
            }

        }
    });

    initDropdownDateMonth();

    // Form Group Radiotabs
    // Logic
    var $valueTypes = $('input[type="radio"]').filter('.radiotab');

    $valueTypes.each(function() {

        var $valueType = $(this);

        // Custom Radiotab Label
        $valueType.after('<span class="radiobutton"></span>');
        var labelText = $valueType.data('placeholder');
        $valueType.next().append(labelText);

        if ($valueType.hasClass('checked')) {
            $valueType.siblings('span.radiobutton').addClass('active');
            var $tabToShow = $valueType.closest('.form-group-radiotabs').find('.form-group-radiotab-panel');
            var conditionalFields = $valueType.attr('data-fields') !== undefined ? $valueType.attr('data-fields').split(' ') : null;
            var labelValue = $valueType.attr('data-label-value') !== undefined ? $valueType.attr('data-label-value') : null;
            displayTabConditionalFields($tabToShow, conditionalFields, labelValue);
        }

        $valueType.on('change', function (event) {
            if ( ($(event.currentTarget).is(':checked')) && (!$(event.currentTarget).hasClass('checked')) ) {

                if ($(event.currentTarget).closest('.form-group-radiotabs').find('.form-group-radiotab-panel').length) {
                    var $tabToShow = $(event.currentTarget).closest('.form-group-radiotabs').find('.form-group-radiotab-panel');

                    var conditionalFields = $(event.currentTarget).attr('data-fields') !== undefined ? $valueType.attr('data-fields').split(' ') : null;

                    var labelValue = $valueType.attr('data-label-value') !== undefined ? $valueType.attr('data-label-value') : null;

                    displayTabConditionalFields($tabToShow, conditionalFields, labelValue);
                }

                var idChecked = $(event.currentTarget).attr('id');

                var $tabsToUncheck = $(event.currentTarget).closest('.form-group-radiotabs-menu').find('input[type="radio"]').filter('.radiotab').not('#'+idChecked);
                $tabsToUncheck.attr('checked', false);
                $tabsToUncheck.removeClass('checked');
                $tabsToUncheck.siblings('span.radiobutton').removeClass('active');

                $(event.currentTarget).attr('checked', true);
                $(event.currentTarget).addClass('checked');
                $(event.currentTarget).siblings('span.radiobutton').addClass('active');

            }

        });

    });

    // Form Accept Checkbox
    $("label.checkbox").each(function() {

        var $checkbox = $(this);

        $checkbox.on('click', function(event) {
            if( $(event.target).is('label') ) {
                if ($(event.currentTarget).hasClass('checked')) {
                    $(event.currentTarget).removeClass('checked');

                } else {
                    $(event.currentTarget).addClass('checked');
                }
            }
        });

    });

    $('input').on('keypress',function(e){
        tecla = (document.all) ? e.keyCode :e.which;
        return (tecla!=13);
    });

});

function initFormGroupRadiotabs() {

    if ($('.form-group-radiotabs').length) {

        $('.form-group-radiotabs').each(function() {

            var globalWrap = $(this);

            var globalWrapWidth = $('.form-group-radiotabs').width();
            var $radiotabsMenu = $(this).find('.form-group-radiotabs-menu').find('.form-group').find('label');
            var radiotabsNum = $radiotabsMenu.length;

            if (isMobile()) {

                if (radiotabsNum <= 6) { // Standard Radiotabs Menu
                    $radiotabsMenu.each(function(index) {
                        if (!globalWrap.hasClass('inline') && !$(this).parent('.wrap-label-rectangle').length) {
                            $(this).wrap(function() {
                                return '<div class="wrap-label-rectangle"></div>';
                            });
                        }
                        $(this).removeClass('first-row').removeClass('first-of-row');
                        if (index < 3) {
                            $(this).addClass('first-row');
                        }
                        $(this).css('width', (100/3)+'%');
                    });
                    $radiotabsMenu.filter(function(index) {
                        return index % 3 === 0;
                    }).addClass('first-of-row');
                } else {
                    if (radiotabsNum % 2 === 0) { // Exception - Multiple of 2 radiotabs
                        $radiotabsMenu.removeClass('first-row').removeClass('last-of-row');
                        $radiotabsMenu.each(function(index) {
                            if (!$(this).parent('.wrap-label-square').length) {
                                $(this).wrap(function() {
                                    return '<div class="wrap-label-square"></div>';
                                });
                            }
                            $(this).css('width', Math.ceil(globalWrapWidth/2) + 'px').css('height', Math.ceil(globalWrapWidth/3) + 'px'); // Rounded width and height values so a decimal value does not break the grid
                        });
                        $radiotabsMenu.filter(function(index) {
                            return index < 2;
                        }).addClass('first-row');
                        $radiotabsMenu.filter(function(index) {
                            return index % 2 === 1;
                        }).addClass('last-of-row');
                        $radiotabsMenu.addClass('label-table');
                    } else { // Radiotabs Menu becomes a Select component
                        //
                    }
                }

            } else { // is Desktop

                if (radiotabsNum <= 6) { // Standard Radiotabs Menu
                    $radiotabsMenu.each(function(index) {
                        if (!globalWrap.hasClass('inline') && !$(this).parent('.wrap-label-rectangle').length) {
                            $(this).wrap(function() {
                                return '<div class="wrap-label-rectangle"></div>';
                            });
                        }
                        $(this).removeClass('first-row').removeClass('first-of-row');
                        $(this).addClass('first-row').css('width', (100/radiotabsNum)+'%');
                    });
                    $radiotabsMenu.filter(function(index) {
                        return index % radiotabsNum === 0;
                    }).addClass('first-of-row');
                } else {
                    if (radiotabsNum % 4 === 0) { // Exception - Multiple of 4 radiotabs
                        $radiotabsMenu.removeClass('first-row').removeClass('last-of-row');
                        $radiotabsMenu.each(function(index) {
                            if (!$(this).parent('.wrap-label-square').length) {
                                $(this).wrap(function() {
                                    return '<div class="wrap-label-square"></div>';
                                });
                            }
                            $(this).css('width', Math.ceil(globalWrapWidth/4) + 'px').css('height', Math.ceil(globalWrapWidth/4) + 'px'); // Rounded width and height values so a decimal value does not break the grid
                        });
                        $radiotabsMenu.filter(function(index) {
                            return index < 4;
                        }).addClass('first-row');
                        $radiotabsMenu.filter(function(index) {
                            return index % 4 === 3;
                        }).addClass('last-of-row');
                        $radiotabsMenu.addClass('label-table');
                    } else { // Radiotabs Menu becomes a Select component
                        //
                    }
                }

            }

        });

    }

}

function initDropdownDateMonth() {

    // Date of Company discharge Component - MM Select/YYYY Select
    if ($('.dropdown-date-mm-yy').length) {
        var $dropdownDateMonthYear = $('.dropdown-date-mm-yy');
        var currentYear = new Date().getFullYear();;

        var language = lang;
        var months, monthsLong = [];

        setInternalVariables(language);

        function setInternalVariables(lang) {
            if (lang == 'en') {
                months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            } else if (lang == 'es') {
                months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                monthsLong = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            } else if (lang == 'ca') {
                months = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des'];
                monthsLong = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];
            }
        }

        var $monthSelect = $('<select name="'+$dropdownDateMonthYear.attr('data-id')+'_month" id="'+$dropdownDateMonthYear.attr('data-id')+'_month"></select>');
        var $yearSelect = $('<select name="'+$dropdownDateMonthYear.attr('data-id')+'_year" id="'+$dropdownDateMonthYear.attr('data-id')+'_year"></select>');

        $dropdownDateMonthYear.addClass('dropdown-date');
        $dropdownDateMonthYear.append($monthSelect);
        $dropdownDateMonthYear.append($yearSelect);

        $.each(months, function(index, value) {
            if (index === 0) {
                $dropdownDateMonthYear.find('select:eq(0)').prepend($('<option />').val('').html('MM'));
            }
            $dropdownDateMonthYear.find('select:eq(0)').append($('<option />').val(index + 1).html(value));
        });

        for (i = currentYear; i > 1949; i--) {
            if (i === currentYear) {
                $dropdownDateMonthYear.find('select:eq(1)').prepend($('<option />').val('').html('YYYY'));
            }
            $dropdownDateMonthYear.find('select:eq(1)').append($('<option />').val(i).html(i));
        }

        // SelectBoxIt
        $dropdownDateMonthYear.find('select').selectBoxIt({
            showFirstOption: false,
            aggressiveChange: true,
            showEffect: 'fadeIn',
            hideEffect: 'fadeOut'
        });

    }

}
}())
