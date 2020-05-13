// Global variables
var $windowObj = $(window);
var lang;
var screenBreakpoint = 768; // 767 is Mobile

$windowObj.on('resize', function(event) {
    initFormGroupRadiotabs();
    injectSimulatorRangeSlider();
});

$windowObj.on('orientationchange', function(event) {
    initFormGroupRadiotabs();
    injectSimulatorRangeSlider();
});

// Utilities
function isMobile() {
    if ($windowObj.width() < screenBreakpoint) { // Mobile
        return true;
    } else {
        return false;
    }
}

function minAge(value) {
    var minAge = 18;
    var today = new Date();
    var birth = value.substr(6,4) + "/" + value.substr(3,2)  + "/" + value.substr(0,2);
    var birthDate = new Date(birth);
    var age = +today.getFullYear() - +birthDate.getFullYear();
    if (age > minAge) {
        return true;
    } else {
        var monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && birthDate.getDate() > today.getDate())) {
            return false;
        } else {
            return true;
        }
    }
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function convertToInteger(value) {
    var money = parseFloat(value.replace('$', '').trim().replace('.', '').replace(',', '.')) * 100;
    return Math.round(money);
}

function addInput(formId, type, value, name) {
    var $form = $('#'+formId);
    $('<input name="'+name+'" type="'+type+'" value="'+value+'" />').appendTo($form);
}

// Toggle Panels
function displayTabPanel($tab) {
    $tab.show(0).addClass('active');
}

function hideTabPanel($tab) {
    $tab.hide(0).removeClass('active');
}

function displayTabConditionalFields($tab, conditionalFields, labelValue) {
    if (conditionalFields == null) {
        hideTabPanel($tab);
    } else {
        displayTabPanel($tab);
        $tab.children('*').hide();
        $.each(conditionalFields, function(index, value) {
            $tab.children('[data-wrap-field="'+value+'"]').children('label.dinamic').text(labelValue);
            $tab.children('[data-wrap-field="'+value+'"]').show();
        });
    }
}


$(document).ready(function() {

    displayMobileNumericKeyboard();

    if (window.location.href.indexOf('cliente') > -1) {
        $('.button-menu').hide();
        $('#envio-solicitud-cliente').removeClass('disabled-overlay');
        $('.input-box-label input').each(function(index, element) {
            $(element).prev().addClass('focusing');
        });
    }

    if($('.input-box-label').length) {

        $('.input-box-label').on('focusin', function(event) {
            setTimeout( (function() {
                $(this).parent().find('label').not('.error').addClass('focusing');
            }).bind(this), 100);
        });
        $('.input-box-label input[type="text"]').blur(function(event) {
            if($(event.target).val() == '') {
                $(event.target).prev().removeClass('focusing');
            }
        });
		$('.input-box-label input[type="number"]').blur(function(event) {
			if($(event.target).val() == '') {
				$(event.target).prev().removeClass('focusing');
			}
		});
    }

    // check if checkbox terms is checked to add class when back browser is pressed
    if ($('#accept').is(':checked')) {
        $('#accept').parent().addClass('checked');
    }

    // check if date of birth terms is full or empty when back browser is pressed
    if ($('#dob').val() != '') {
        $('#dob').val('');
    }

    // prevent mix inputs and labels
    $('.input-box-label input').each(function(index, element) {
        if($(element).val() != ""){
            $(element).prev().addClass('focusing');
        }
    });

    if($('#form-client').length) {
        if (isInViewport($('#form-client'))) {
            $('.request-loan').hide();
        }
    }

    injectSimulatorRangeSlider();

    $('body').on('click', '#form-no-client', function(event) {
        event.preventDefault();

        var $elem = $(this);

        var _formId = Math.floor(Date.now() / 1000);
        var _hiddenForm = '<form id="'+_formId+'" method="POST" action="'+$elem.attr('href')+'" class="hidden"></form>';
        $(_hiddenForm).insertAfter($elem);
        addInput(_formId, 'text', $('#plazo').val(), 'datos_simulador[plazo]');
        addInput(_formId, 'text', convertToInteger($('#capital').val()), 'datos_simulador[capital]');
        addInput(_formId, 'text', convertToInteger($('.total-title .resultado').text()), 'datos_simulador[mensualidad]');
        addInput(_formId, 'text', convertToInteger($('.resume.desk .tin').text()), 'datos_simulador[tin]');
        addInput(_formId, 'text', convertToInteger($('.resume.desk .tae').text()), 'datos_simulador[tae]');
        addInput(_formId, 'text', convertToInteger($('.resume.desk .comisionApe').text()), 'datos_simulador[comisionAp]');
        addInput(_formId, 'text', convertToInteger($('.resume.desk .prima_ptp').text()), 'datos_simulador[primaPtp]');
        addInput(_formId, 'text', convertToInteger($('.resume.desk .total_importe').text()), 'datos_simulador[total]');

        addInput(_formId, 'text', $elem.attr('data-lang'), 'datos_simulador[lang]');
        addInput(_formId, 'text', $elem.attr('data-landing'), 'datos_simulador[landing]');

        $('#'+_formId).submit();
    });

});

$('.lang-menu-trigger').on('mouseover', function() {
    if (!isMobile()) {
        $(this).addClass('active');
        $(this).find('.lang-menu').removeClass('hide');
    }
});

$('.lang-menu-trigger').on('mouseleave', function() {
    if (!isMobile()) {
        $(this).removeClass('active');
        $(this).find('.lang-menu').addClass('hide');
    }
});

$('.lang-menu-trigger').on('click', function() {
    if (isMobile()) {
        $('.callme').addClass('hide');
        $('.phone img').removeClass('hide');
        $('.lang-menu-mobile').toggleClass('hide');
    }
});

$('.phone img').on('click', function() {
	$(this).addClass('hide');
    $('.lang-menu-mobile').addClass('hide');
	$('.callme').removeClass('hide');
    displayMobileNumericKeyboard();
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	}
});

$('.callme').find('.close').on('click', function() {
	$('.phone img').removeClass('hide');
	$('.callme').addClass('hide');
});

$('.callme-request-sent').find('.close').on('click', function() {
    $('.phone img').removeClass('hide');
    $('.callme-request-sent').addClass('hide');
});

function displayCallmeRequestSent() {
    $('.callme').addClass('hide');
    $('.callme-request-sent').removeClass('hide');
}

// Convert HTML5 Input Type Text with numeric pattern into Input Type Number for Mobile Numeric Only Keyboards
function displayMobileNumericKeyboard() {
    if( ($('input[type="text"][pattern="[0-9]*"]').length) && isMobile()) {
        $('input[type="text"][pattern="[0-9]*"]').each(function() {
            $(this).attr('type', 'number');
        });
    }
}

// Request Meeting Date Scroll for Mobile
$('.request-loan').find('a').on('click', function(event) {
    event.preventDefault();
    $('.request-loan').fadeOut('fast', function() {
        $('html, body').animate({scrollTop : $('#solicitar').offset().top}, 800);
    });
});

// Client/No client Button Menu
$('.menu-btn').not('.inactive').on('click', function() {
    $(this).removeClass('highlighted').addClass('active');
});

$('#form-client').on('click', function() {
    $('#envio-solicitud-cliente').removeClass('disabled-overlay');
    if (isMobile()) {
        $('html, body').animate({scrollTop : ($('#solicitar').offset().top)}, 800);
    }
});

// Check if element is visible within viewport
function isInViewport($el) {
  var winTop = $windowObj.scrollTop();
  var winBottom = winTop + $windowObj.height();
  var elTop = $el.offset().top;
  var elBottom = elTop + $el.height();
  return ((elBottom <= winBottom) && (elTop >= winTop));
}

$windowObj.scroll(function() {
    if($('#form-client').length) {
        if (isInViewport($('#form-client'))) {
            $('.request-loan').fadeOut('slow');
        }
    }
});

// Inject Simulator Range Slider on Desktop or Mobile containers
function injectSimulatorRangeSlider() {
    if ($('.simulator-block-desktop').length && $('.simulator-block-mobile').length) {
        var $rangeSlider = $('.simulator-range-slider');
        if (isMobile()) {
            $rangeSlider.insertAfter($('.simulator-block-mobile').find('.simulator-heading'));
						$('.simulator-range-slider').addClass('hide');
						$('.simulator-heading').find('span.edit').on('click', function(){
							$('.simulator-range-slider').toggleClass('hide');
							if($('span.edit').html() === 'Editar'){
								$(this).html('Cerrar');
							}else{
								$(this).html('Editar')
							}
						})
        } else {
            $rangeSlider.insertAfter($('.simulator-block-desktop').find('.simulator-heading'));
        }
    }
}
