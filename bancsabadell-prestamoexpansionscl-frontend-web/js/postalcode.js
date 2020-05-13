/**
 * @author: Lledó Torres
 * @description: validate postalcode and retrieve city and province
 */
$(function() {
    $("#cp").keyup(function() {
        var zip_in = $(this);
        if (zip_in.val().length == 5) {
            $.ajax({
                method: "GET",
                url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + zip_in.val() + "&components=country:ES&language=es",
                dataType: 'JSON',
                success: function (obj){;
                    var arrAddress = obj.results[0].address_components;
                    if( arrAddress.length>1 ){
                        $( "#errorZip" ).html();
                        $.each(arrAddress, function () {
                            for(var i=0; i<arrAddress.length; i++){
                                if (arrAddress[i].types[0] == "locality") {
                                    $('input[name="city"]').val(arrAddress[i].long_name);
                                }
                                if(arrAddress[i].types[0] == 'administrative_area_level_2'){
                                    $('input[name="province"]').val(arrAddress[i].long_name);
                                }
                            }
                            return false; // break the loop
                        });
                    } else {
                        $( "#errorZip" ).html("Código postal no encontrado");
                        $( "#errorZip" ).css('display', 'block');
                    }
                }
            });
						//Focusin province && City
						$('.input-box-label input#province').prev().addClass('focusing');
						$('.input-box-label input#city').prev().addClass('focusing');
        } else {
            $('input[name="city"]').val("");
            $('input[name="province"]').val("");
            $( "#errorZip" ).empty();
        }
    });
});