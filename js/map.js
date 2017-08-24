var map;
var markers = [];
var infoWindow;

function initMap() {
  // Constructor creates a new map - only center and zoom are required.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.607523, lng: -90.225898},
    zoom: 16
  });



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

// var defaultMarker = makeMarkerIcon('0091ff');
//
// var hilightMarker = makeMarkerIcon('FFFF24');

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
  infoWindow = new google.maps.InfoWindow();
  marker.addListener('click', function(){
    //fill infowindow
    fillWindow(this, infoWindow);
    //show panorama
    showPano(this.position);
    //toggle bounce if selected
    toggleBounce(this);
    //alert list view of selection
    var selectedPlace = viewModel.placeList()[marker.id];
    viewModel.showInfo(selectedPlace);
  });

}


function fillWindow(marker, window) {
  if (window.marker != marker) {
    window.marker = marker;
    window.setContent('<div>' + marker.title + '</div><br><div id="pano"></div>');
    window.open(map, marker);

  }
}

function toggleBounce(marker){
  if(marker.getAnimation() !== null){
    marker.setAnimation(null);
  }else{
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 750);
  }
}

function showPano(position){
  var panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: position,
        pov: {
          heading: 34,
          pitch: 10
        }
      });
  map.setStreetView(panorama);
}
