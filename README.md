## EXPLORING FOX PARK NEIGHBORHOOD APP

RUNNING AND USING THE APPLICATION
****************************************

TO RUN:
Download repository and navigate to the root directory. Open index.html in
your web browser.

TO USE:

The default view shows a map with markers at interesting places in fox
neighborhood. Clicking on a marker will open an info window displaying a place
name and a google streetview panorama that can be manipulated and also made full-screen.

The hamburger menu icon in the top left corner opens and closes the list view.
The list view contains a search box that can be used to search the directory of places.
Clicking on a place will show a photo from that place's foursquare photo, as well as
the place's foursquare ranking. It will also open an info window on the corresponding map
marker. Clicking again will close the expanded list view and the marker.

KNOCKOUT MV* APPLICATION STRUCTURE
**********************************
contained in: js/app.js

The application uses seperation of concerns and knockout.js to provide a responsive
experience. The MV* framework on the business/logic side of the app is divided into
three parts:

There is also code here for calling a geocode function in js/map.js and passing
locations as addresses. It's currently a bit out of place and a more functional approach might
be to hard-code coordinates.

DATA MODEL:
This contains an javascript object "constructor" for places that will be included.
properties of place objects that will be "observed" by the view are created as
knockout observables.

It also contains hard-coded data for a few places in the neighborhood.

CONTROLLER/VIEW MODEL:
The main function of the view model is to create and update an observable array
which holds place objects that are currently meant to appear on the map as markers
or in the list view as location.

It also contains the functionality for searching the list view.

It also contains the functionality for what happens when a user clicks on a list
item in the list view. This includes requests to the foursquare API.

GOOGLE MAP
**************************************
contained in: js/map.js

This script initiates the map, geocodes addresses and feeds them back to the
data model, creates an observable array of marker objects, and sets up the
infowindow and street view panorama functionality.
