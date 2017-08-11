// document.getElementById('test').addEventListener('click', function() {
//           geocodeAddress("2199 California Ave, St. Louis, MO");
//         });

var place = function(name, address){
  this.name = ko.observable(name);
  this.address = ko.observable(address);
  this.latlong = {lat:0.0, lng:0.0};
};

var viewModel = {
  places: [
    new place("Lona's Lil Eats", "2199 California Ave., St. Louis, MO"),
    new place("Fox Park", "2716 Shenandoah Ave., St. Louis, MO"),
    new place("Trader Bob's Tattoo Shop", "2529 Jefferson Avenue, St. Louis, MO"),
    new place("The Purple Martin", "2800 Shenandoah Ave, St. Louis, MO"),
    new place("DeSales Community Garden", "2635 California Ave, St. Louis, MO"),
    new place("Keypers Piano Bar", "2280 Jefferson Avenue, St. Louis, MO"),
    new place("Fritanga","2208 Jefferson Avenue, St. Louis, MO"),
    new place("Southside Early Childhood Center", "2101 S Jefferson Ave, St. Louis, MO"),
    new place("7-Eleven", "2607 Gravois Ave, St. Louis, MO"),
    new place("Dutch Town Auto Brokerage","2737 Gravois Ave, St. Louis, MO"),
    new place("Concrete Ocean Art Gallery", "2257 S Jefferson Ave, St. Louis, MO")
  ]

};

function getCoord(){
  for(i=0; i<viewModel.places.length; i++){
    var address = viewModel.places[i].address();
    geocodeAddress(address, i);
  }
}

function setCoord(resultlat, resultlng, i){
  viewModel.places[i].latlong.lat = resultlat;
  viewModel.places[i].latlong.lng = resultlng;

}

getCoord();

console.log(JSON.stringify(viewModel.places));
ko.applyBindings(viewModel);
