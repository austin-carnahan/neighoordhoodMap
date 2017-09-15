//**************************** Data Model ************************************
var Place = function(name, address, venueId) {
    this.name = name;
    this.address = address;
    this.latlong = {
        lat: 0.0,
        lng: 0.0
    };
    this.id = 0;
    this.mark = null;
    this.venue = venueId;
    this.photoURL = ko.observable("");
    this.info = ko.observable("");
    this.visible = ko.observable(false);
};

var places = [
    new Place("Lona's Lil Eats", "2199 California Ave., St. Louis, MO", "540fe080498e07b19caf3abf"),
    new Place("Fox Park", "2716 Shenandoah Ave., St. Louis, MO", "4d4584387e2e5481673c6b8f"),
    new Place("Trader Bob's Tattoo Shop", "2529 Jefferson Avenue, St. Louis, MO", "4b1d5f06f964a5207f0f24e3"),
    new Place("The Purple Martin", "2800 Shenandoah Ave, St. Louis, MO", "52f1ba52498e5761f913eeb6"),
    new Place("Keypers Piano Bar", "2280 Jefferson Avenue, St. Louis, MO", "4cc08cfeca4aa1cd22b420b4"),
    new Place("Fritanga", "2208 Jefferson Avenue, St. Louis, MO", "4aeb2762f964a52013bf21e3"),
    new Place("7-Eleven", "2607 Gravois Ave, St. Louis, MO", "4c192f67834e2d7fae012a80")
];

//**************************Geocode Places ************************************
getCoord = function() {
    for (i = 0; i < places.length; i++) {
        var address = places[i].address;
        geocodeAddress(address, i);
    }
};

setCoord = function(resultlat, resultlng, i) {
    places[i].latlong.lat = resultlat;
    places[i].latlong.lng = resultlng;
};


//***********************View Model******************************************
var viewModel = {

    initApp: function() {
        //create a new map
        initMap();
        //get coordinates for palces
        getCoord();
        //init menu functionality
        initMenu();
        //set list to default state
        viewModel.initList();

    },

    //create an observable array of places
    placeList: ko.observableArray([]),

    //adds all places to the list
    //set id's for each place
    initList: function() {
        var i = 0;
        places.forEach(function(place) {
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
    filter: function(value) {
        //clear any open info/photos in list
        viewModel.placeList().forEach(function(p) {
            p.visible(false);
        });
        //clear the list
        viewModel.placeList.removeAll();
        //clear map of markers
        markers.forEach(function(marker) {
            marker.setVisible(false);
        });

        //add places back to the list if queries match
        places.forEach(function(place) {

            //indexOf returns -1 if there is no match
            if (place.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                //addd place to viewModel
                viewModel.placeList.push(place);

                markers.forEach(function(marker){
                  if(marker.id === place.id){
                    marker.setVisible(true);
                  }
                });
            }
        });
    }, //end viewModel.filter

    //********** List Click *************//
    showInfo: function(place) {

        //if already selected, close it
        if (place.visible() === true) {
            place.visible(false);
            infoWindow.close();
        } else {
            //we will open it
            //first clear any open list info
            viewModel.placeList().forEach(function(p) {
                p.info("");
                p.visible(false);
            });


            //get foursquare data
            $.ajax({
                url: "https://api.foursquare.com/v2/venues/" + place.venue + "?&client_id=2ULM5QFG2MSTWR1I23BKMMRML2KRPE0W251M2IGEQOYD4UG2&client_secret=CX5HD4LD23J5IRWSCQ1NNU10EVVQWAJDCPUUD5LAYCJZEPMF&v=20170602",
                datatype: "jsonp",
                async: true,
            }).done(function(response) {
                var rating = response.response.venue.rating;
                var size = "300x300";
                place.photoURL(response.response.venue.photos.groups[0].items[1].prefix + size + response.response.venue.photos.groups[0].items[1].suffix);
                place.visible(true);
                place.info("Rating: " + rating.toString() + "/10");
                console.log(response);
            }).fail(function(jqXHR, textStatus) {
                place.photoURL("img/photofail.jpg");
                place.visible(true);
            });

            markers.forEach(function(marker){
              if(marker.id === place.id){
                //set current marker
                currentMark = marker;
                //pan to marker
                map.panTo(marker.getPosition());
                //open info window
                fillWindow(marker, infoWindow);
                //bounce marker
                toggleBounce(marker);
                //show streetview
                showPano(marker.position);
              }
            });
        }
    }

};

function initMenu() {
    document.getElementById("menu").onclick = function(e) {
        e.preventDefault();
        document.getElementById("wrapper").classList.toggle("toggled");
    };
}

function navClick() {
    document.getElementById("options-box").style.width = "250px";
}

//************************** Initialization Calls *********************************
//this calls filter function when filterText is changed (any time user enters text)
viewModel.filterText.subscribe(viewModel.filter);
//apply data bindings
ko.applyBindings(viewModel);
