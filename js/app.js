//TODO
//1. get FS photos
//2. get FS hours
// cache data so we don't api every time click
//3.fix async marker/list problem
//4.fix streetview position and get rid of yellow guuy
//5.error handling
//6 README
//**************************** Data Model ************************************
var place = function(name, address, venueId){
  this.name = name;
  this.address = address;
  this.latlong = {lat:0.0, lng:0.0};``
  this.id = 0;
  this.venue = venueId;
  this.photoURL = ko.observable("");
  this.info = ko.observable("You have not clicked me...");
  this.visible = ko.observable(false);
};

var places = [
new place("Lona's Lil Eats", "2199 California Ave., St. Louis, MO", "540fe080498e07b19caf3abf"),
new place("Fox Park", "2716 Shenandoah Ave., St. Louis, MO", "4d4584387e2e5481673c6b8f"),
new place("Trader Bob's Tattoo Shop", "2529 Jefferson Avenue, St. Louis, MO", "4b1d5f06f964a5207f0f24e3"),
new place("The Purple Martin", "2800 Shenandoah Ave, St. Louis, MO", "52f1ba52498e5761f913eeb6"),
new place("Keypers Piano Bar", "2280 Jefferson Avenue, St. Louis, MO", "4cc08cfeca4aa1cd22b420b4"),
new place("Fritanga","2208 Jefferson Avenue, St. Louis, MO", "4aeb2762f964a52013bf21e3"),
new place("7-Eleven", "2607 Gravois Ave, St. Louis, MO", "4c192f67834e2d7fae012a80")
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
    //clear any open info/photos in list
    viewModel.placeList().forEach(function(p){
      p.visible(false);
    });
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
    p.visible(false);
  });

  //get foursquare data
  $.ajax({
    url: "https://api.foursquare.com/v2/venues/" + place.venue + "?&client_id=2ULM5QFG2MSTWR1I23BKMMRML2KRPE0W251M2IGEQOYD4UG2&client_secret=CX5HD4LD23J5IRWSCQ1NNU10EVVQWAJDCPUUD5LAYCJZEPMF&v=20170602",
    datatype: "jsonp",

    success: function(response){
      var rating = response.response.venue.rating;
      var size = "300x300";
      place.photoURL(response.response.venue.photos.groups[0].items[1].prefix + size + response.response.venue.photos.groups[0].items[1].suffix);
      place.visible(true);
      place.info("Rating: " + rating.toString() + "/10");
      console.log(response);
      clearTimeout(foursquareRequestTimeout);
    },
    async: true,
  });

    var foursquareRequestTimeout = setTimeout(function() {
      alert("Failed to load Foursquare photos");
    }, 3000);


  //place.info("You Clicked!");
  //open marker info window for selected place
  fillWindow(markers[place.id], infoWindow);
  //bounce it out
  toggleBounce(markers[place.id]);
  //show streetview
  showPano(markers[place.id].position);
}

};

//************************** Initialization Calls *********************************

//set list to default state
viewModel.initList();
//this calls filter function when filterText is changed (any time user enters text)
viewModel.filterText.subscribe(viewModel.filter);
//apply data bindings
ko.applyBindings(viewModel);
