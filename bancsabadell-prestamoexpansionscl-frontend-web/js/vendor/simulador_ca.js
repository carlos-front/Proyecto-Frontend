/* ======================================================================
  Banc Sabadell Simularor / Prèstec Expansió / Reforma Llar
======================================================================== */

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var tin = 8.50; // Tipus interès nominal (Fixe)
var comisionApe = 2.0; // Comissió obertura 2% Total Prèstec o 50 Euros mínim
var comisionApeMin = 50.0;
var comisionFormat = "(" + comisionApe + "%)";
// Primes PTP per a un assegurat de 38 anys a 18, 24, 36, 48, 60, 72, 84 y 96 mesos i un prèstec de 10.000 Euros
var primasPTPxPlazo = {"18": 309.24, "24": 316.19, "30": 344.90, "36": 352.54, "42": 382.87, "48": 390.87, "54": 409.52, "60": 418.16, "66": 427.16, "72": 436.53, "78": 446.30, "84": 456.49, "90": 467.12, "96": 478.22};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(function() {

	//read parameters url
	var params = window.location.href.split("?");
	var importeIni=12000 , numMesesIni = 96;//valores por defecto

	if (params.length>1) {
		var params_array = params[1].split("&");

		console.log("params_array", params_array);
		for (var i=0;i<params_array.length;i++){
			var p = params_array[i];
			if (/itss/.test(p)) importeIni = p.split("=")[1];
			else if (/plazo/.test(p)) numMesesIni = p.split("=")[1];
		}

	}

    // var importeIni = 12000; // Valor import inicial
    // var numMesesIni = 96; // Nombre de mesos inicial

    var importe = importeIni;
    var meses = numMesesIni;

    actualizarValores(importe, meses);

    $("#capital").ionRangeSlider({
        min: 3000,
        max: 60000,
        step: 500,
        prettify_separator: '.',
        from: importeIni,
    });

    $("#plazo").ionRangeSlider({
		// values: [18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96],
		min: 18,
        max: 96,
        step: 6,
        from: numMesesIni,
    });

    $("#capital").on("change", function() {
        var $this = $(this);

        importe = $this.prop("value");

        actualizarValores(importe, meses);
    });

    $("#plazo").on("change", function() {
        var $this = $(this);

        meses = $this.prop("value");

        actualizarValores(importe, meses);
    });

    function actualizarValores(capital, plazo) {

        // Interès porcentual
        var intPorcMens = (tin/12) / 100;

        // Quota mensual
        var cuota = Math.round(100 * ( ((capital * intPorcMens) * (Math.pow(1 + intPorcMens, plazo))) / (Math.pow(1 + intPorcMens, plazo) - 1)  ) ) / 100;

        $('.resultado').html(deFloatAFormateoComMilesYComas(cuota.toFixed(2)));

        // Comissió obertura
        var comisionApeTotal;

        comisionApeTotal =  capital * (comisionApe / 100.0);

        if (comisionApeTotal < comisionApeMin) {
            comisionApeTotal = comisionApeMin;
            comisionFormat = "";
        }
        else {
            comisionFormat = "(" + comisionApe + "%)";
        }

        $('.comisionApe').html(deFloatAFormateoComMilesYComas(comisionApeTotal) + " €");
        $('.comisionForm').html(comisionFormat);

        // TIN
        $('.tin').html(deFloatAFormateoComMilesYComas(tin));

        // Prima PTP
        var primaPTPRes;

        $.each(primasPTPxPlazo, function(key, value) {

          if (key == plazo) {
            primaPTPRes = ((value * capital) / 10000.0);
            $('.prima_ptp').html(deFloatAFormateoComMilesYComas(primaPTPRes));
            return false;
          }

        });

        // TAE
        var tae = Math.floor(1000 * calcularTAE(capital, plazo, tin, comisionApeTotal, primaPTPRes)) / 1000;

        $('.tae').html(deFloatAFormateoComMilesYComas(tae.toFixed(2)));

        // Import sol·licitat
        $('.capital').html(deFloatAFormateoComMilesYComas(capital));

        // Termini per retornar el prèstec
        $('.plazo').html(plazo);

        // Import total Degut
        var total_importe = cuota * plazo + comisionApeTotal + primaPTPRes;

        $('.total_importe').html(deFloatAFormateoComMilesYComas(total_importe.toFixed(2)));

    }

});


// Càlculs financers
function calcularTAE(capIni, plazo, interes, comisionApertura, primaPTP) {
        var temp_numCuotas = plazo,
            temp_cuota = 0.0,
            temp_tae = 0.0,
            temp_intMes = interes / 1200,
            comisionApertura = comisionApertura,
            temp_capitalNeto = capIni - comisionApertura - primaPTP;

        var ajusteTAE = 0.0;
        if (capIni == 0) {
            return '0';
        }
        if (plazo % 6 != 0) {
                if (capIni < 32000) {
                        if (plazo == 25 || plazo == 26 || plazo == 27 || plazo == 32 || plazo == 33 || plazo == 34 || plazo == 35 || plazo == 38 || plazo == 39) {
                                ajusteTAE = (-0.06).toFixed(4);
                        }
                        if (plazo == 28 || plazo == 29) {
                                ajusteTAE = (-0.01).toFixed(4);
                        }
                        ajusteTAE = parseFloat(ajusteTAE);
                }
        } else {
                ajusteTAE = (0.12).toFixed(4);
                ajusteTAE = parseFloat(ajusteTAE);
        }
        temp_cuota = capIni / calcFactorValorInicial(temp_numCuotas, temp_intMes);
        var temp_intReal = calcInteresPeriodo(temp_capitalNeto / temp_cuota, temp_numCuotas);
        temp_tae = 100.0 * convPerATae(temp_intReal, 12.0);
        return temp_tae;
}

function calcInteresPeriodo(factorValorInicial, numPeriodos) {
        var temp_interes = 0.0,
            temp_difValor = 1.0;
        do {
                var temp_valor = calcFactorValorInicial(numPeriodos, temp_interes);
                var temp_derivada = rufDerivadaFactorValorInicialPorInteres(numPeriodos, temp_interes);
                temp_difValor = temp_valor - factorValorInicial;
                var temp_delta = temp_difValor / temp_derivada;
                temp_interes -= temp_delta;
        } while ((Math.abs(temp_difValor / factorValorInicial) > 1E-8));
        return temp_interes;
}

function calcFactorValorInicial(numPeriodos, interesPeriodo) {
        if (interesPeriodo == 0.0) {
                return numPeriodos;
        } else {
                var temp_factorFinal = Math.pow(1 + interesPeriodo, numPeriodos);
                return (temp_factorFinal - 1) / (interesPeriodo * temp_factorFinal);
        }
}

function rufDerivadaFactorValorInicialPorInteres(numPeriodos, interesPeriodo) {
        if (interesPeriodo == 0.0) {
                return -numPeriodos * (numPeriodos + 1) / 2.0;
        } else {
                var temp_1masR = 1.0 + interesPeriodo;
                var temp_1masR_exp_Nmas1 = Math.pow(temp_1masR, numPeriodos + 1);
                var l_resultado = (temp_1masR + (numPeriodos * interesPeriodo) - temp_1masR_exp_Nmas1) /
                        (interesPeriodo * interesPeriodo * temp_1masR_exp_Nmas1);
                return l_resultado;
        }
}

function convPerATae(a_interesTae, a_periodosPorAnyo) {
        return Math.pow(1.0 + a_interesTae, a_periodosPorAnyo) - 1.0;
}

// Formateig Resultats
function deFloatAFormateoComMilesYComas(cuota) {

        cuota = String(cuota);
        var negativo = cuota.indexOf("-");
        if (negativo != -1) {
                cuota = cuota.substring(1, cuota.length);
        }

        var pos = cuota.indexOf(".");
        if (pos == -1) {
                decimal = 0;
                coma = "";
        } else {
                decimal = cuota.substr(pos, 3);
                coma = "," + decimal.substr(1, 2);
        };
        if (pos == -1) {
                entero = cuota;
        } else {
                entero = cuota.substring(0, pos);
        };

        contador = 1
        for (pos = (entero.length - 1); pos > 0; pos--) {
                contador++
                if (contador > 3) {
                        entero = entero.substring(0, pos) + "." + entero.substr(pos)
                        contador = 1
                }
        }


        cuota = entero;
        if (negativo != -1) {
                if (entero !== 0 || decimal !== 0) {
                        cuota = "-" + cuota;
                } else {
                        if (entero == 0 && decimal == 0) {} else {
                                cuota = "-" + cuota;
                        }
                }
        }

        cuota = cuota + coma;
        return (cuota);
}
