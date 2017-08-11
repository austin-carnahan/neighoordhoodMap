var map;


function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13
  });

  // document.getElementById('test').addEventListener('click', function() {
  //           geocodeAddress("2199 California Ave, St. Louis, MO");
  //         });


}

function geocodeAddress(address, i){
  var geocoder = new google.maps.Geocoder();
  var resultlat = null;
  var resultlng = null;
  geocoder.geocode({address: address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      resultlat = results[0].geometry.location.lat();
      resultlng = results[0].geometry.location.lng();
    } else {
      resultlat = -999;
      resultlng = -999;
      alert('Geocode was not successful for the following reason: ' + status);
    }

    console.log("geocode req: " + resultlat + ", " + resultlng);
    setCoord(resultlat, resultlng, i);
  });
}
