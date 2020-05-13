/* ======================================================================
  Banc Sabadell - Préstamo Expansión / Préstamo Expansión Hogar
======================================================================== */

$(function() {

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var tin = 8.50; // Tipo de interés nominal (Fijo)
    var comisionApe = 2.0; // Comisión de apertura 2% Total Préstamo o 50 Euros mínimo
    var comisionApeMin = 50.0;
    var comisionFormat = "(" + comisionApe + "%)";
    // Primas PTP para un asegurado de 38 años a 18, 24, 36, 48, 60, 72, 84 y 96 meses y un préstamo de 10.000 Euros
    var primasPTPxPlazo = {"18": 309.24, "24": 316.19, "30": 344.90, "36": 352.54, "42": 382.87, "48": 390.87, "54": 409.52, "60": 418.16, "66": 427.16, "72": 436.53, "78": 446.30, "84": 456.49, "90": 467.12, "96": 478.22};
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var importeIni = 12000; // Valor de importe inicial
    var numMesesIni = 96; // Número de meses inicial

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
        values: [18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96],
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

        // Interés porcentual
        var intPorcMens = (tin / 12) / 100;

        // Cuota mensual
        //var cuota = Math.round(10000 * ( ((capital * intPorcMens) * (Math.pow(1 + intPorcMens, plazo))) / (Math.pow(1 + intPorcMens, plazo) - 1) ) ) / 10000;
        var cuota = Math.ceil(10000 * ( ((capital * intPorcMens) * (Math.pow(1 + intPorcMens, plazo))) / (Math.pow(1 + intPorcMens, plazo) - 1) ) ) / 10000;
        //cuota = (Math.ceil(cuota * 10) / 10).toFixed(2); // Round up & fix 2 decimals
        var cuotaFixed = cuota.toFixed(2);

        $('.resultado').html(deFloatAFormateoComMilesYComas(cuotaFixed));        

        // Comisión de Apertura
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
        var tinFixed = tin.toFixed(2);
        $('.tin').html(deFloatAFormateoComMilesYComas(tinFixed));

        // Prima PTP
        var primaPTPRes;

        $.each(primasPTPxPlazo, function(key, value) {

          if (key == plazo) {
            primaPTPRes = Math.ceil(10000 * ((value * capital) / 10000.0) ) / 10000; 
            primaPTPResFixed = primaPTPRes.toFixed(2);
            $('.prima_ptp').html(deFloatAFormateoComMilesYComas(primaPTPResFixed));
            return false;
          }

        });        
        //console.log('calcular TAE :'+calcularTAE(capital, plazo, tin, comisionApeTotal, primaPTPRes))
        // TAE
        //var tae = Math.floor(10000 * calcularTAE(capital, plazo, tin, comisionApeTotal, primaPTPRes)) / 10000;
        var tae = Math.ceil(10000 * calcularTAE(capital, plazo, tin, comisionApeTotal, primaPTPRes)) / 10000;
        //console.log('capital : '+capital);
        //console.log('plazo : '+plazo);
        //console.log('tin : '+tin);
        //console.log('comisionApeTotal : '+comisionApeTotal);
        //console.log('primaPTPRes : '+primaPTPRes);
        //console.log('TAE : '+tae);
        taeFixed = tae.toFixed(2);
        $('.tae').html(deFloatAFormateoComMilesYComas(taeFixed));

        // Importe solicitado
        $('.capital').html(deFloatAFormateoComMilesYComas(capital));

        // Plazo a devolver el préstamo
        $('.plazo').html(plazo);

        // Importe total Adeudado
        var importeAdeudado = cuota * plazo + comisionApeTotal + primaPTPRes;
        console.log('importeAdeudado Before : '+importeAdeudado);
        importeAdeudadoFixed = importeAdeudado.toFixed(2);
        $('.total_importe').html(deFloatAFormateoComMilesYComas(importeAdeudadoFixed));
        console.log('importeAdeudado After : '+importeAdeudadoFixed);

    }

});

// Financial calculators
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

// Format Values 
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
