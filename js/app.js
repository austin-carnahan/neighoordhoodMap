//**************************** Data Model ************************************
var place = function(name, address){
  this.name = name;
  this.address = address;
  this.latlong = {lat:0.0, lng:0.0};``
  this.id = 0;
  this.info = ko.observable("You have not clicked me...");
  this.showInfo = false;
};

var places = [
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
];

//**************************Geocode Places ************************************
getCoord = function(){
  for(i=0; i<places.length; i++){
    var address = places[i].address;
    geocodeAddress(address, i);
  }
};

setCoord = function(resultlat, resultlng, i){
  places[i].latlong.lat = resultlat;
  places[i].latlong.lng = resultlng;
  console.log("setCoord test: " + resultlat + "," + resultlng);
};

getCoord();

//***********************View Model******************************************
var viewModel =  {
  //create an observable array of places
  placeList: ko.observableArray([]),

  //adds all places to the list
  //set id's for each place
  initList: function(){
    var i = 0;
    places.forEach(function(place){
      place.id = i;
      viewModel.placeList.push(place);
      i++;
    });
  },

                      //********search filter***********//

  //this watches user input text
  filterText: ko.observable(""),

  //called everytime text input changes in the filter box.
  //it gets passed value, which is the content of the input box
  filter: function(value){
    //clear the list
    viewModel.placeList.removeAll();
    //clear map of markers
    markers.forEach(function(marker){
      marker.setVisible(false);
    });

    //stores place id for identifying marker
    var id;

    //add places back to the list if queries match
    places.forEach(function(place){

      //indexOf returns -1 if there is no match
      if(place.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        //addd place to viewModel
        viewModel.placeList.push(place);

        //grab place id and use it to display marker
        id = place.id;
        markers[id].setVisible(true);
      }
    });
  },//end viewModel.filter

              //********** List Click ***********//
showInfo: function(place){
  //first clear any open list info
  viewModel.placeList().forEach(function(p){
    p.info("You have not clicked me....");
  });

  place.info("You Clicked!");
  //open marker info window for selected place
  fillWindow(markers[place.id], infoWindow);
}

};

//************************** Initialization Calls *********************************

//set list to default state
viewModel.initList();
//this calls filter function when filterText is changed (any time user enters text)
viewModel.filterText.subscribe(viewModel.filter);
//apply data bindings
ko.applyBindings(viewModel);
