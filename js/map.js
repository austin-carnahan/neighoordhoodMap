var map;
var markers = [];
var infoWindow;

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.607523, lng: -90.225898},
    zoom: 16
  });

  infoWindow = new google.maps.InfoWindow();

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
      //send coordinates to our places array
      setCoord(resultlat, resultlng, i);

      //create a marker
      createMarker(i);

    } else {
      alert('Geocode was not successful: ' + status);
    }
    console.log(address + ": " + resultlat + ", " + resultlng);
  });
}

function createMarker(id){
  //create a marker and push to markers array
  var marker = new google.maps.Marker({
    map: map,
    position: places[id].latlong,
    title: places[id].name,
    animation: google.maps.Animation.DROP,
    id: id
  });

  markers.push(marker);
  markers.sort(function(a, b){return a-b});

  //add an infoWindow to the marker
  marker.addListener('click', function(){
    fillWindow(this, infoWindow);
    //alert list view of selection
    var selectedPlace = viewModel.placeList()[marker.id];
    viewModel.showInfo(selectedPlace);
  });
}

function fillWindow(marker, window) {
  if (window.marker != marker) {
    window.marker = marker;
    window.setContent('<div>' + marker.title + '</div>');
    window.open(map, marker);

  }
}
