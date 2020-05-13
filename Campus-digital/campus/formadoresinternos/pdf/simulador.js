/* ======================================================================
  Banc Sabadell Simulator / Préstamo Expansión
======================================================================== */

function valuesSimulator(valuessimulator) {
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var tin = valuessimulator.tin; // Tipo de interés nominal (Fijo) (Variable XML, comprobar formato, avisar que no funcionará el simulador)
    var comisionApe = valuessimulator.comisionape; // Comisión de apertura 2% Total Préstamo o 50 Euros mínimo (Variable XML, comprobar formato, avisar que no funcionará el simulador)
    var comisionApeMin = valuessimulator.comisionapemin; // (Variable XML)
    var comisionFormat = "(" + comisionApe + "%)";
    // Primas PTP para un asegurado de 38 años a 18, 24, 36, 48, 60, 72, 84 y 96 meses y un préstamo de 10.000 Euros
    var primasPTPxPlazo = {"18": 309.24, "24": 316.19, "30": 344.90, "36": 352.54, "42": 382.87, "48": 390.87, "54": 409.52, "60": 418.16, "66": 427.16, "72": 436.53, "78": 446.30, "84": 456.49, "90": 467.12, "96": 478.22}; // Si se quiere cambiar se me han de proporcionar los valores de los intervalos de los meses    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    var importeIni = valuessimulator.importeini; // Valor de importe inicial: 12000 (Variable XML) ¿?
    var numMesesIni = valuessimulator.numnesesini; // Número de meses inicial: 96 (Variable XML) ¿?

    var importe = importeIni;
    var meses = numMesesIni;

    actualizarValores(importe, meses);

    $("#capital").ionRangeSlider({
        min: valuessimulator.importeminimo, //Importe mínimo
        max: valuessimulator.importemaximo, //Importe máximo
        step: valuessimulator.intervaloimporte, //Interval del slider ¿? Preguntar si cambia y quien lo cambia
        prettify_separator: '.',
        from: importeIni //Variable viene dado por XML (el punto inicial de la bolita del slider) ¿?
    });

    $("#plazo").ionRangeSlider({
        min: valuessimulator.mesesminimos, //Meses mínimos del préstamo
        max: valuessimulator.mesesmaximos, //Meses máximos del préstamo
        step: valuessimulator.intervalomeses, //Intervalo slider ¿? Preguntar si cambia y quien lo cambia
        from: numMesesIni //Variable viene dado por XML (el punto inicial de la bolita del slider) ¿?
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
        var intPorcMens = (tin/12) / 100;

        // Cuota mensual
        var cuota = Math.ceil(100 * ( ((capital * intPorcMens) * (Math.pow(1 + intPorcMens, plazo))) / (Math.pow(1 + intPorcMens, plazo) - 1)  ) ) / 100;

        var interesesTablaAmortizacion = calcularTablaAmortizacion(capital, cuota, intPorcMens);

        var intereses = 0;

        for (var i = 0; i < interesesTablaAmortizacion.length; i++) {
            intereses += interesesTablaAmortizacion[i];
            //console.log('intereses : '+intereses);
        };

        $('.resultado').html(deFloatAFormateoComMilesYComas(cuota.toFixed(2)));

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
        $('.tin').html(deFloatAFormateoComMilesYComas(tin));

        // Prima PTP
        var primaPTPRes;

        $.each(primasPTPxPlazo, function(key, value) {

          if (key == plazo) {
            primaPTPRes = (((parseInt(value * 10) / 10) * capital) / 10000.0);
            $('.prima_ptp').html(deFloatAFormateoComMilesYComas(primaPTPRes));
            return false;
          }

        });

        // TAE
        var tae = Math.floor(1000 * calcularTAE(capital, plazo, tin, comisionApeTotal, primaPTPRes)) / 1000;

        $('.tae').html(deFloatAFormateoComMilesYComas(tae.toFixed(2))); //Muestra el valor del TAE

        // Importe solicitado
        $('.capital').html(deFloatAFormateoComMilesYComas(capital));

        // Plazo a devolver el préstamo
        $('.plazo').html(plazo);

        // Importe total Adeudado
        // var total_importe = cuota * plazo + comisionApeTotal + primaPTPRes;
        var total_importe = parseInt(capital) + intereses + comisionApeTotal + primaPTPRes;

        $('.total_importe').html(deFloatAFormateoComMilesYComas(total_importe.toFixed(2)));

    }

}

// Tabla amortización
function calcularTablaAmortizacion(capital, cuota, intPorcMens) {
    var interesesTablaAmortizacion = [];

    var totalAmortizado = capital;

    var mes = 0;

    while (totalAmortizado > 0) {
        var intereses = totalAmortizado * intPorcMens;
        var principal = cuota - intereses;

        if (principal > totalAmortizado) {
            //principal = totalAmortizado;
            //intereses = principal * intPorcMens;
            totalAmortizado = 0.0;
            //console.log('ÚLTIMA CUOTA POR AMORTIZAR: '+totalAmortizado+' con un interés ajustado de : '+intereses+' ==> ('+ Math.round(100 * (intereses)) / 100 +') ');
        } else {
            totalAmortizado -= principal;
            //console.log('TOTAL AMORTIZADO PLAZO '+(mes+1)+':  '+totalAmortizado+' con un interés ajustado de : '+intereses+' ==> ('+ Math.round(100 * (intereses)) / 100 +') ');
        }
        // build table: m + 1, principal, interest, amount
        // interesesTablaAmortizacion.push(Math.round(100 * (intereses)) / 100);
        interesesTablaAmortizacion.push(Math.round(100 * (intereses)) / 100);
        mes++;
    }

    return interesesTablaAmortizacion;
}

// Cálculos financieros
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

// Formateo Resultados
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
