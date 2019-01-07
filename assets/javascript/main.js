// AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8  google API Key
// 200235024-32c4fc71813961608e163497918dd634 mtb project API key

// Google Multiple Results for brewery url: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5407,-77.4360&radius=1000&keyword=brewery&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8

// https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200235024-32c4fc71813961608e163497918dd634

var map;
var markers=[];

// AJAX CALLS

// get lat and longitude based on current user location
function geoCall(dist) {
    var queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8";
    $.ajax({
        url: queryURL,
        method: "POST"
    }).then(function (response) {
        var lat = response.location.lat;
        var lon = response.location.lng;
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
        foursquareCall(lat, long, dist, mapCtr, mtbObject);
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

// pushes desired info from AJAX objects then calls list functions and marker map
function makeArrays(mapCtr, mtbObject, breweryObject){
    var mtbInfoArr=[]
    var breweryInfoArr=[]
    // pull info from Mountain Bike Object
    for (var i = 0; i < mtbObject.length; i++) {
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
        }
        mtbInfoArr.push(trailInfo);
    };
    // pull info from brewery object
    for (var i = 0; i < breweryObject.length; i++) {
        var breweryName = breweryObject[i].venue.name;
        var breweryLat = breweryObject[i].venue.location.lat;
        var breweryLon = breweryObject[i].venue.location.lng;
        var breweryID = breweryObject[i].venue.id;
        var breweryInfo = {
            name: breweryName,
            ID: breweryID,
            lat: breweryLat,
            lon: breweryLon,
            type: 'brewery',
        }
        breweryInfoArr.push(breweryInfo);
    }
    trailList(mtbInfoArr, dist);
    brewList(breweryInfoArr, dist);
    // combine the two arrays for sending to marker map
    mapInfoArr = mtbInfoArr.concat(breweryInfoArr);
    // markerMap(mapCtr, mapInfoArr);
    addMarkers(mapInfoArr);

}

// Draw google map with our specific styling - then calls function to add markers
function markerMap(mapCtr, mapInfoArr) {
    map = new google.maps.Map(
        document.getElementById("markerMap"), {
            zoom: 11, 
            center: mapCtr, 
            styles: [
                {elementType: "geometry", 
                stylers: [{color: "#242f3e"}]
                },
                {elementType: "labels.text.stroke", 
                stylers: [{color: "#242f3e"}]
                },
                {elementType: "labels.text.fill", 
                stylers: [{color: "#746855"}]
                },
                {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{color: "#d59563"}]
                },
                {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{visibility: "off"}]
                },
                {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{color: "#263c3f"}]
                },
                {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{visibility: "off"}]
                },
                {
                featureType: "road",
                elementType: "geometry",
                stylers: [{color: "#38414e"}]
                },
                {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{color: "#212a37"}]
                },
                {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{color: "#9ca5b3"}]
                },
                {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{color: "#746855"}]
                },
                {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{color: "#1f2835"}]
                },
                {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{color: "#f3d19c"}]
                },
                {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{visibility: "off"}]
                },
                {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{visibility: "off"}]
                },
                {
                featureType: "water",
                elementType: "geometry",
                stylers: [{color: "#17263c"}]
                },
                {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{color: "#515c6d"}]
                },
                {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{color: "#17263c"}]
            }
        ]   
    
    }); 
    mapPan();
}

// add button to map to re-do search based on loction of center of map
function mapPan(){
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
    var infowindow = new google.maps.InfoWindow();
    for(let i = 0; i < mapInfoArr.length; i++){
        let position = {lat: mapInfoArr[i].lat, lng: mapInfoArr[i].lon}
        let type = mapInfoArr[i].type;
        let name = mapInfoArr[i].name;
        let url = mapInfoArr[i].tUrl
        let id = mapInfoArr[i].ID
        let marker = new google.maps.Marker({
            position:position,
            id: id,
            url: url,
            title: name, 
            type: type,
            map: map, 
            icon: icons[type].icon,
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'click', function() {
            if(this.type == "trail"){
                infowindow.setContent('<div>' + 
                '<strong>' + this.title + '</strong><br>' +
                '<a href=' + this.url + ' target="_blank">Trail Link</a><br>' + 
                '</div>' +
                '<button class="btn waves-effect waves-light" type="button" name="action" class="trailDetails" onclick="trailDetails(' + this.id + ')">More Info</button>'
                )
                infowindow.open(map, this);
            }else{            
                infowindow.setContent('<div>' + 
                '<strong>' + this.title + '</strong><br>' +
                '</div>')
                infowindow.open(map, this);
            }
        });
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
        var trailUrl = mtbInfoArr[i].tUrl 
        var trailItem = $("<li>");
        // var trailLink = $("<a href='" + trailUrl + "'></a>");
        var trailLink = $("<a href='#!'></a>");
        // trailLink.attr("target", "_blank");
        trailLink.attr("data-ID", trailID);
        trailLink.addClass('trailLink');
        trailLink.text(trailName);
        trailItem.append(trailLink);
        $(".mtbList").append(trailItem);
    }
}

function trailDetails(trailId){
    let trailWidget = $("<div>");
    trailWidget.html('<iframe style="width:100%; max-width:1200px; height:410px;" frameborder="0" scrolling="no" src="https://www.mtbproject.com/widget?v=3&map=1&type=trail&id=' + trailId + '&x=-8622072&y=4510716&z=6"></iframe>')
    $(".modal-content").empty();
    $(".modal-content").append(trailWidget);
$('#modal1').modal('open');
}

// receives info from foursquare applicationCache, populates brewery array and updates DOM list of breweries
function brewList(breweryInfoArr) {
    $(".breweryList").empty();
    for (var i = 0; i < breweryInfoArr.length; i++) {
        var breweryName = breweryInfoArr[i].name;
        // var brewItem = $("<li>").text(breweryName);
        var brewItem = $("<li>");
        var brewLink = $('<a href="#!">' + breweryName + '</a>');
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

    $(document).on("click", ".trailLink", function(){
        let tID = $(this).attr("data-ID")
        trailDetails(tID);
    })
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