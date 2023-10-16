var random_places = [
  ['Moscow1', 55.822083, 37.665453, 4],
  ['Moscow2', 55.604697, 37.642107, 4],
  ['Lisbon1', 38.749402, -9.120034, 4],
  ['Lisbon2', 38.70896, -9.16913, 4],
  ['NewYork1', 40.784513, -73.97663, 4],
  ['NewYork2', 40.707522, -74.037055, 4],
  ['Bondi Beach', -33.890542, 151.274856, 4],
  ['Coogee Beach', -33.923036, 151.259052, 5],
  ['Cronulla Beach', -34.028249, 151.157507, 3],
  ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
  ['Maroubra Beach', -33.950198, 151.259302, 1],
];

function initialize() {
  var markers = [];
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: false,
    gestureHandling: 'greedy',
  });

  var styles = [
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ];

  map.setOptions({ styles: styles });

  // Show initial location at Sydney — can be changed to detect user location
  var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.9902, 151.1899),
    new google.maps.LatLng(-33.7554, 151.2731),
  );
  map.fitBounds(defaultBounds);

  var input = /** @type {HTMLInputElement} */ (document.getElementById(
    'pac-input',
  ));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var searchBox = new google.maps.places.SearchBox(
    /** @type {HTMLInputElement} */ (input),
  );

  // [START region_getplaces]
  // Listen for the event fired when the user selects an item from the
  // pick list. Retrieve the matching places for that item.
  google.maps.event.addListener(searchBox, 'places_changed', function() {
    var places = searchBox.getPlaces();

    for (var i = 0, marker; (marker = markers[i]); i++) {
      marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; (place = places[i]); i++) {
      var image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      var marker = new google.maps.Marker({
        map: map,
        icon: image,
        title: place.name,
        position: place.geometry.location,
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(5); // Why 17? Because it looks good.
      }
    }
  });
  // [END region_getplaces]

  var place_markers = [];

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.

  // Make markers show if they are inside visible bounds
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
    if (!bounds) {
      return;
    }
    searchBox.setBounds(bounds);

    // Remove out of bounds markers
    for (var k = 0; k < place_markers.length; k++) {
      var one_marker = place_markers[k];
      if (!bounds.contains(one_marker.getPosition())) {
        one_marker.setMap(null);
      }
    }

    // Create markers which should be visible
    for (var i = 0; i < random_places.length; i++) {
      var placeLatLng = random_places[i];

      var myLatLng = new google.maps.LatLng(placeLatLng[1], placeLatLng[2]);
      if (bounds.contains(myLatLng)) {
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: placeLatLng[0],
        });
        place_markers.push(marker);
      }
    }
    // end places markers
  });
}

google.maps.event.addDomListener(window, 'load', initialize);