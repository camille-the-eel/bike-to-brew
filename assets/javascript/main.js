// AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8  google API Key
// 200235024-32c4fc71813961608e163497918dd634 mtb project API key

// Google Multiple Results for brewery url: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5407,-77.4360&radius=1000&keyword=brewery&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8

// https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200235024-32c4fc71813961608e163497918dd634

var map;
var markers=[];
var infowindow;
var service;

// AJAX CALLS

// get lat and longitude based on current user location
function geoCall(dist) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        let mapCtr = {
            lat: lat,
            lng: lon
        };
        $("#markerMap").empty();
        trailCall(lat, lon, dist, mapCtr);
        markerMap(mapCtr);
    })
}

// lat and lon based on zip code or other search parameters - provided by google api
function coordinateCall(sParameter, dist) {
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sParameter + "&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let lat = response.results[0].geometry.location.lat
        let lon = response.results[0].geometry.location.lng
        let newLoc = {
            lat: lat,
            lng: lon
        };
        // $("#markerMap").empty();
        trailCall(lat, lon, dist, newLoc);
        map.panTo(newLoc);
    });
}

// calls mtb project for trails located within a defined radius
function trailCall(lat, long, dist, mapCtr) {
    var queryURL = "https://www.mtbproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=" + dist + "&key=200235024-32c4fc71813961608e163497918dd634";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        let mtbObject = response.trails;
        // foursquareCall(lat, long, dist, mapCtr, mtbObject);
        placesCall(lat, long, dist, mapCtr, mtbObject);    
    });
}

// calls four square search for breweries based on lat and long and search radius
function foursquareCall(lat, long, dist, mapCtr, mtbObject){
    let clientID = "AHO52TCU5VGZ15RXWQOXNCKIUADLG1IY2PSRTJKBIGVPPQTH";
    let clientSecret = "ML1MNNCBTE3LUQAYZRYLSKXHYYAMNRSKK4AE5YOWTTPEYMRN";
    // convert miles to meters because foursquare uses meters for search radius
    let distMeters = dist * 1609.3;
    let v = 20181201
    let queryURL = "https://api.foursquare.com/v2/venues/explore?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=" + v + "&limit=10&radius=" + distMeters + "&ll=" + lat + "," + long + "&query=brewery";
    $.ajax({
        url: queryURL,
        method: "get"
    }).then(function (data) {
        let breweryObject = data.response.groups[0].items;
        makeArrays(mapCtr, mtbObject, breweryObject, dist)
    })
}

function placesCall(lat, lon, dist, mapCtr, mtbObject){
    let distMeters = dist * 1609.3;
    let searchCenter= {
        lat: lat,
        lng: lon
    };

    var request = {
      location: searchCenter,
      radius: distMeters,
      keyword: 'brewery',
      rankBy: google.maps.places.RankBy.PROMINENCE,
    };
  
    service = new google.maps.places.PlacesService(map);
    // service.nearbySearch(request, callback);
    service.nearbySearch(request, callback);
    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            let breweryObject = results;
            makeArrays(mapCtr, mtbObject, breweryObject, dist)
        }
      }


  }
  
// function callback(results, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//     //   for (var i = 0; i < results.length; i++) {
//     //     var place = results[i];
//     //     createMarker(results[i]);
//     //   }
//     }
//   }

// pushes desired info from AJAX objects then calls list functions and marker map
function makeArrays(mapCtr, mtbObject, breweryObject){
    console.log(breweryObject);
    var mtbInfoArr=[]
    var breweryInfoArr=[]
    let i = 0
    // pull info from Mountain Bike Object
    for (i = 0; i < mtbObject.length; i++) {
        var trailName = mtbObject[i].name;
        var trailLat = mtbObject[i].latitude;
        var trailLon = mtbObject[i].longitude;
        var trailID = mtbObject[i].id;
        var trailUrl = mtbObject[i].url 
        var trailInfo = {
            name: trailName,
            ID: trailID,
            lat: trailLat,
            lon: trailLon,
            tUrl: trailUrl,
            type: 'trail',
            dataIndex: i,
        }
        mtbInfoArr.push(trailInfo);
    };
    // pull info from brewery object
    // for (var k = 0; k < breweryObject.length; k++) {
    //     var breweryName = breweryObject[k].venue.name;
    //     var breweryLat = breweryObject[k].venue.location.lat;
    //     var breweryLon = breweryObject[k].venue.location.lng;
    //     var breweryID = breweryObject[k].venue.id;
    //     var breweryInfo = {
    //         name: breweryName,
    //         ID: breweryID,
    //         lat: breweryLat,
    //         lon: breweryLon,
    //         type: 'brewery',
    //         dataIndex: k + i,
        // }
    for (var k = 0; k < breweryObject.length; k++) {
        var breweryName = breweryObject[k].name;
        var breweryLat = breweryObject[k].geometry.location.lat();
        var breweryLon = breweryObject[k].geometry.location.lng();
        var breweryID = breweryObject[k].place_id;
        var breweryInfo = {
            name: breweryName,
            ID: breweryID,
            lat: breweryLat,
            lon: breweryLon,
            type: 'brewery',
            dataIndex: k + i,
            address: breweryObject[k].vicinity,
        }
        breweryInfoArr.push(breweryInfo);
    }
    trailList(mtbInfoArr);
    brewList(breweryInfoArr);
    // combine the two arrays for sending to marker map
    mapInfoArr = mtbInfoArr.concat(breweryInfoArr);
    addMarkers(mapInfoArr);

}

// Draw google map with our specific styling
function markerMap(mapCtr, mapInfoArr) {
    map = new google.maps.Map(
        document.getElementById("markerMap"), {
            zoom: 11, 
            center: mapCtr, 
            styles: [
                {
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#19480d"
                    }
                  ]
                },
                {
                  elementType: "labels.text.fill",
                  stylers: [
                    {
                      color: "#ffffff"
                    }
                  ]
                },
                {
                  elementType: "labels.text.stroke",
                  stylers: [
                    {
                      color: "#60371f"
                    },
                    {
                      lightness: -25
                    }
                  ]
                },
                {
                  featureType: "administrative",
                  elementType: "geometry.stroke",
                  stylers: [
                    {
                      color: "#c9b2a6"
                    }
                  ]
                },
                {
                  featureType: "administrative.land_parcel",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "administrative.land_parcel",
                  elementType: "geometry.stroke",
                  stylers: [
                    {
                      color: "#dcd2be"
                    }
                  ]
                },
                {
                  featureType: "administrative.land_parcel",
                  elementType: "labels.text.fill",
                  stylers: [
                    {
                      color: "#ae9e90"
                    }
                  ]
                },
                {
                  featureType: "administrative.neighborhood",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "landscape.natural",
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#19480d"
                    }
                  ]
                },
                {
                  featureType: "poi",
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#19480d"
                    }
                  ]
                },
                {
                  featureType: "poi",
                  elementType: "labels.text",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "poi",
                  elementType: "labels.text.fill",
                  stylers: [
                    {
                      color: "#93817c"
                    }
                  ]
                },
                {
                  featureType: "poi.business",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "poi.park",
                  elementType: "geometry.fill",
                  stylers: [
                    {
                      color: "#60371f"
                    },
                    {
                      lightness: -45
                    }
                  ]
                },
                {
                  featureType: "poi.park",
                  elementType: "labels.text.fill",
                  stylers: [
                    {
                      color: "#447530"
                    }
                  ]
                },
                {
                  featureType: "road",
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#f5f1e6"
                    }
                  ]
                },
                {
                  featureType: "road",
                  elementType: "labels",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "road",
                  elementType: "labels.icon",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "road.arterial",
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#fee3a7"
                    },
                    {
                      lightness: -85
                    }
                  ]
                },
                {
                  featureType: "road.arterial",
                  elementType: "labels",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "road.highway",
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#a36301"
                    }
                  ]
                },
                {
                  featureType: "road.highway",
                  elementType: "geometry.stroke",
                  stylers: [
                    {
                      color: "#a36301"
                    }
                  ]
                },
                {
                  featureType: "road.highway",
                  elementType: "labels",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "road.highway.controlled_access",
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#e9a502"
                    }
                  ]
                },
                {
                  featureType: "road.highway.controlled_access",
                  elementType: "geometry.stroke",
                  stylers: [
                    {
                      color: "#bd8502"
                    }
                  ]
                },
                {
                  featureType: "road.local",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "road.local",
                  elementType: "labels.text.fill",
                  stylers: [
                    {
                      color: "#806b63"
                    }
                  ]
                },
                {
                  featureType: "transit",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "transit.line",
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#dfd2ae"
                    }
                  ]
                },
                {
                  featureType: "transit.line",
                  elementType: "labels.text.fill",
                  stylers: [
                    {
                      color: "#8f7d77"
                    }
                  ]
                },
                {
                  featureType: "transit.line",
                  elementType: "labels.text.stroke",
                  stylers: [
                    {
                      color: "#ebe3cd"
                    }
                  ]
                },
                {
                  featureType: "transit.station",
                  elementType: "geometry",
                  stylers: [
                    {
                      color: "#dfd2ae"
                    }
                  ]
                },
                {
                  featureType: "water",
                  elementType: "geometry.fill",
                  stylers: [
                    {
                      color: "#24bfe2"
                    }
                  ]
                },
                {
                  featureType: "water",
                  elementType: "labels.text",
                  stylers: [
                    {
                      visibility: "off"
                    }
                  ]
                },
                {
                  featureType: "water",
                  elementType: "labels.text.fill",
                  stylers: [
                    {
                      color: "#92998d"
                    }
                  ]
                }
              ] 
    
    }); 
    mapPanSearch();
    google.maps.event.addListener(map, "click", function(event) {
        infowindow.close();
    });
}

// add button to map to re-do search based on loction of center of map
function mapPanSearch(){
    var searchControlDiv = document.createElement('div');
    var searchControl = new SearchControl(searchControlDiv, map);

    searchControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(searchControlDiv);
}

// search button settings
function SearchControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '3px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginTop = '8px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to redo search at center of map';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Redo Search';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', function() {
        let newCtr = map.getCenter();
        let lat = newCtr.lat();
        let lon = newCtr.lng();
        lat = parseFloat(lat.toFixed(5));
        lon = parseFloat(lon.toFixed(5));
        $("#coordinateInput").val(lat + ', ' + lon)
        let newLoc = {
            lat: lat,
            lng: lon
        };
        let dist = distance();
        trailCall(lat, lon, dist, newLoc);
    });

  }

// draws the markers on the map, adds click event for info box pop up
function addMarkers(mapInfoArr){
    // this for loop clears all the markers from the map before drawing new ones
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      markers = [];
    var iconBase = 'https://maps.google.com/mapfiles/ms/micons/';
    var icons = {
        brewery: {
        icon: iconBase + "bar.png"
        },
        trail: {
        icon: iconBase + "cycling.png"
        }
    };
    infowindow = new google.maps.InfoWindow();
    for(let i = 0; i < mapInfoArr.length; i++){
        let position = {lat: mapInfoArr[i].lat, lng: mapInfoArr[i].lon}
        let type = mapInfoArr[i].type;
        let name = mapInfoArr[i].name;
        let url = mapInfoArr[i].tUrl
        let id = mapInfoArr[i].ID;
        let address = mapInfoArr[i].address;
        let marker = new google.maps.Marker({
            position:position,
            id: id,
            url: url,
            title: name, 
            type: type,
            map: map, 
            icon: icons[type].icon,
            address: address,
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            infoWindowPopup(this);
        });
    }
    zoomExtents();
}

function zoomExtents(){
        var bounds = new google.maps.LatLngBounds();
        if (markers.length>0) { 
            for (var i = 0; i < markers.length; i++) {
               bounds.extend(markers[i].getPosition());
              }    
              map.fitBounds(bounds);
          }
}

// receives info from mtb api, populates mtb array and updates DOM list of trails
function trailList(mtbInfoArr) {
    // let distItem = $("<li>").text("Search Distance: " + dist + " miles");
    // $("#searchDist").text(dist);
    $(".mtbList").empty();
    for (var i = 0; i < mtbInfoArr.length; i++) {
        var trailName = mtbInfoArr[i].name;
        var trailID = mtbInfoArr[i].ID;
        var trailIndex = mtbInfoArr[i].dataIndex;
        var trailItem = $("<li>");
        var trailLink = $("<a href='#!'></a>");
        trailLink.attr("data-ID", trailID);
        trailLink.attr("data-index", trailIndex);
        trailLink.addClass('listData');
        trailLink.text(trailName);
        trailItem.append(trailLink);
        $(".mtbList").append(trailItem);
    }
}

// open modal when trail details button is clicked
function trailDetails(trailId){
    let trailWidget = $("<div>");
    trailWidget.html('<iframe style="width:100%; max-width:1200px; height:410px;" frameborder="0" scrolling="no" src="https://www.mtbproject.com/widget?v=3&map=1&type=trail&id=' + trailId + '&z=6"></iframe>')
    $(".modal-content").empty();
    $(".modal-content").append(trailWidget);
$('#modal1').modal('open');
}

function breweryDetails(breweryId){
  var request = {
    placeId: breweryId,
    fields: ['url', 'website']
  };
  console.log(request);

  service = new google.maps.places.PlacesService(map);
  service.getDetails(request, placeDetails);
  function placeDetails(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
          let bURL = results.website;
          let breweryWidget = $("<div>");
          breweryWidget.html('<iframe style="width:100%; max-width:800px; height:410px;" frameborder="0" scrolling="yes" src=" ' + bURL + ' "></iframe>')
          $(".modal-content").empty();
          $(".modal-content").append(breweryWidget);
      $('#modal1').modal('open');
      }
    }
}

// receives info from foursquare applicationCache, populates brewery array and updates DOM list of breweries
function brewList(breweryInfoArr) {
    $(".breweryList").empty();
    for (var i = 0; i < breweryInfoArr.length; i++) {
        var breweryName = breweryInfoArr[i].name;
        var breweryIndex = breweryInfoArr[i].dataIndex;
        var brewItem = $("<li>");
        var brewLink = $('<a href="#!">' + breweryName + '</a>');
        brewLink.attr("data-index", breweryIndex);
        brewLink.addClass('listData');
        brewItem.append(brewLink);
        $(".breweryList").append(brewItem);
    }
}

// activates button click functionality
function buttonClick(){
    $("#coordinateSubmit").click(function(event){
        event.preventDefault();
        let x = $("#coordinateInput").val();
        if(x == ""){
            geoCall(distance());
        }else{
            coordinateCall(x, distance());        
        }
    })

    $('.clearSearch').click(function(){
        $('#coordinateInput').val("");
    })

    $(document).on("click", ".listData", function(){
        let tID = $(this).attr("data-ID")
        let tlat = $(this).attr("data-lat")
        let tlon = $(this).attr("data-lon")
        let markerIndex = $(this).attr("data-index") 
        let marker = markers[markerIndex];
        let latln = marker.getPosition();
        let lat = latln.lat();
        let lon = latln.lng();
        panZoom(lat, lon)
        infoWindowPopup(marker);
    })
}

// add info to the map marker info window
function infoWindowPopup(marker){
    if(marker.type == "trail"){
        infowindow.setContent('<div>' + 
        '<strong>' + marker.title + '</strong><br>' +
        '</div>' +
        '<button class="btn waves-effect waves-light btn-small" type="button" name="action" class="trailDetails" onclick="trailDetails(' + marker.id + ')">More Info</button>'
        )
        // infowindow.open(map, marker);
    }else{   
      let mID = marker.id   
        infowindow.setContent('<div>' + 
        '<strong>' + marker.title + '</strong><br>' +
        marker.address + '<br>' +
        // '<button class="btn waves-effect waves-light btn-small" type="button" name="action" class="trailDetails" onclick="breweryDetails(' + marker.id + ')">More Info</button>' +
        '<button class="btn waves-effect waves-light btn-small" type="button" name="action" class="trailDetails" onclick="breweryDetails(`' + mID + '`)">More Info</button>' +
        '</div>')
        // infowindow.open(map, marker);
    }
    infowindow.open(map, marker);
}

// pans map to map marker when selecting from one of the lists
function panZoom(lat, lon){
   lat = parseFloat(lat);
   lon = parseFloat(lon);
    let markerLoc = {
        lat: lat,
        lng: lon
    };
    map.panTo(markerLoc);
    map.setZoom(14);
}

// distance input validation
var distance = function(){
    let d = $("#dist").val();
    if (d > 50){
        d = 50;
        $("#dist").val("50");
    }
    else if (d == ""){
    d = 5;
    $("#dist").val("5")
    };
    return d;
}

// hides the splash screen after a set amount of time then shows the app
function splashScreen(){
    setTimeout(function(){
        $("#splashScreen").slideUp(500);
        $("#appContent").fadeIn(1000);
        buttonClick();
        geoCall(distance());
    }, 1000);
}



// document on ready
$(document).ready(function () {
    // trailCall();
    // geoCall(distance());
    splashScreen();
    $('.dropdown-trigger').dropdown();
    $('.collapsible').collapsible();
    $('.modal').modal();

    // end of doc ready
});