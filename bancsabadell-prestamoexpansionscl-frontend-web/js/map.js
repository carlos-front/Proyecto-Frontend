var OfficesMap =$.extend({ /* OfficesMap */},{

    selected_zoom   : 18,
    zip_zoom        : 14,
    geolocated      : false,
    user_position   : {},
    map_initialised : false,

    //InitMap

    initMap: function()
    {
        this.map = new google.maps.Map(document.getElementById('map'), {
            scrollwheel: false,
            streetViewControl: false,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });

        OfficesMap.map_initialised = true;
    },

    //With new Zip code zoom on map
    newZipCode: function(zipcode) {

        $.ajax({
            method: "GET",
            url: "https://maps.googleapis.com/maps/api/geocode/json?address='zipcode=" + zipcode + "'&components=country:ES&language="+lang,
            dataType: 'JSON',
            success: function (obj) {
                if (obj.status == "OK" && zipcode == obj.results[0].address_components[0].long_name) {

                    // Init Map where we have one correct zip code
                    if(!OfficesMap.map_initialised){
                        OfficesMap.initMap();
                        $('.offices-map #map').removeClass('hide');
                        $('.offices-map .list-container').removeClass('hide');
                    }

                    this.position = {
                        lat: obj.results[0].geometry.location.lat,
                        lng: obj.results[0].geometry.location.lng
                    };

                    OfficesMap.map.setCenter(this.position);
                    OfficesMap.map.setZoom(OfficesMap.zip_zoom);
                    OfficesMap.setOfficesByZipCode(zipcode);
                } else {
                    //console.log('Error on google maps api request');
                }
            }
        });
    },

    // Geolocation
    setOfficesByZipCode: function(zipcode) {

        $.ajax({
            method: "GET",
            url: urlGetOffices + "?term=" + zipcode,
            success: function (marks) {

                this.markers = [];
                this.markerCluster = {};
                $('.offices-list').html('');

                $('.offices-map .num_results').html(marks.length);

                if (marks.length == 0) {
                    if (lang == 'es') {
                        $('.offices-list').html('<div class="no-results"><span>Lo sentimos, no hay ninguna oficina en el código postal que nos indicas.<br/>Por favor, introduce otro.</span></div>');
                    } else if (lang == 'ca') {
                        $('.offices-list').html('<div class="no-results"><span>Ho sentim, no hi ha cap oficina en el codi que ens indiques.<br/>Per favor, introdueix-ne un altre.</span></div>');
                    }
                }

                for (var i = 0; i < marks.length; ++i) {
                    var marker = new google.maps.Marker({
                        position: {
                            lat: parseFloat(marks[i].lat),
                            lng: parseFloat(marks[i].lng)
                        },
                        map: this.map,
                        icon: imgSrc+'icon-map.png'
                    });

                    marker['custom-properties'] = marks[i];
                    marker['rowElement'] = $(this.componentSelector).find('.offices-list .office[data-id=' + marks[i].id + ']');
                    this.markers.push(marker);
                    marker.addListener('click', OfficesMap.markerClickFn);

                    //Calculate distance
                    var distance = '';
                    if (OfficesMap.geolocated) {
                        var p1 = new google.maps.LatLng(OfficesMap.user_position.lat, OfficesMap.user_position.lng);
                        var p2 = new google.maps.LatLng(marks[i].lat, marks[i].lng);

                        distance = (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2) + "Km";
                    }

                    var html_list = '';
                    html_list += '<div class="row office" data-id="' + marks[i].id + '" data-latitude="' + marks[i].lat + '" data-longitude="' + marks[i].lng + '">';

                    if (OfficesMap.geolocated) {
                        html_list += '<div class="col-xs-12 col-md-10">';
                    }
                    else {
                        html_list += '<div class="col-xs-12">';
                    }

                    html_list += '<span class = "office-name">' + marks[i].name + '</span>';
                    html_list += '<span class = "office-direction">' + marks[i].label + '</span>';
                    html_list += '</div>';

                    if (OfficesMap.geolocated) {
                        html_list += '<div class="col-xs-12 col-md-2 distance">';
                        html_list += '<span>' + distance + '</span>';
                        html_list += '</div>';
                    }

                    html_list += '</div>';

                    $('.offices-list').append(html_list);
                }
                $('.offices-list .office').on('click', OfficesMap.listClickFn);


                if (!this.initMarkers) {
                    this.initMarkers = true;
                }

                if ($.isFunction(this.markerCluster.clearMarkers)) {
                    this.markerCluster.clearMarkers();
                }
                this.markerCluster = OfficesMap.newMarkerCluster(this.markers);
                OfficesMap.map['markers'] = this.markers;
                OfficesMap.map['zoomMarkerFn'] = OfficesMap.zoomMarker.bind(this);
                $('.office:first-child').click();
            }
        });
    },

    // Click on Map office
    markerClickFn: function() {
        OfficesMap.map.zoomMarkerFn(this.rowElement.selector);
    },

    // Click on List office
    listClickFn: function() {
        OfficesMap.map.zoomMarkerFn(this);
    },

    //create markerCluster
    newMarkerCluster: function(markers) {
        return new MarkerClusterer(this.map, markers, {
            styles: [{
                fontFamily: 'SourceSansPro',
                textSize: 14,
                fontWeight: 'normal',
                textColor: '#fff',
                url: imgSrc+'icon-map.png',
                height: 34,
                width: 34
            }]
        });
    },


    // Zoom marker
    zoomMarker: function(element) {
        $('.offices-list .office.selected').removeClass('selected');
        $(element).addClass('selected');


        var lat = $(element).attr('data-latitude');
        var lng = $(element).attr('data-longitude');
        var id  = $(element).attr('data-id');

        $('.offices-map .location input#office').val(id);

        OfficesMap.map.setZoom(OfficesMap.selected_zoom);
        OfficesMap.map.panTo(new google.maps.LatLng(lat, lng));
    },

    /*zoomMarkerById: function(markerId) {
     if (markerId) {
     this.dropDown($(this.componentSelector).find('.markers-filters-row[data-id=' + markerId + ']'));
     this.zoomMarker($(this.componentSelector).find('.markers-filters-row[data-id=' + markerId + ']'), false);
     }
     },*/

    // Geolocation
    initGeolocation: function() {

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition((function (position) {
                OfficesMap.geolocated = true;
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;

                OfficesMap.user_position = {
                    lat: lat,
                    lng: lng
                };

                $.ajax({
                    method: "GET",
                    url: "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng ,
                    dataType: 'JSON',
                    success: function (obj) {

                        //Get zip_cod
                        var zip_code = '';
                        obj.results[0].address_components.forEach(function(item) {
                            if(item.types[0] == 'postal_code') zip_code = item.long_name;
                        });

                        $("#zip_code").val(zip_code);
                        OfficesMap.newZipCode(zip_code);
                    }
                });

            }).bind(this));
        }

    },

    updateZipCode: function() {
        $("#zip_code").keyup(function () {
            OfficesMap.newZipCode($(this).val());
			//OfficesMap.zipMirror(this);
        });
        $("#zip_code").change(function () {
            OfficesMap.newZipCode($(this).val());
			//OfficesMap.zipMirror(this);
        });
        $("#cp").keyup(function () {
			OfficesMap.zipMirror(this);
        });
        $("#cp").change(function () {
            OfficesMap.zipMirror(this);
        });
    },

    zipMirror: function(element){
        if(!OfficesMap.map_initialised){
            $("#zip_code").val($(element).val());
            $("#zip_code").html($(element).val());
            OfficesMap.newZipCode($(element).val());
        }
    }
});

$(document).ready(function() {
    OfficesMap.updateZipCode();
    $('.offices-map .geolocation').on('click', OfficesMap.initGeolocation);
});
