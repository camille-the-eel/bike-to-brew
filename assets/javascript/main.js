// AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8  google API Key
// 200235024-32c4fc71813961608e163497918dd634 mtb project API key

// Google Multiple Results for brewery url: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5407,-77.4360&radius=1000&keyword=brewery&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8

// https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200235024-32c4fc71813961608e163497918dd634



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
        $("#markerMap").empty();
        trailCall(lat, lon, dist, newLoc);
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
    markerMap(mapCtr, mapInfoArr);

}

// Draw google map with icons for trails and breweries
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
        let marker = new google.maps.Marker({position:position,
            url: url,
            title: name, 
            type: type,
            map: map, 
            icon: icons[type].icon,})
        google.maps.event.addListener(marker, 'click', function() {
            if(this.type == "trail"){
                infowindow.setContent('<div>' + 
                '<strong>' + this.title + '</strong><br>' +
                '<a href=' + this.url + ' target="_blank">Trail Link</a><br>' + 
                '</div>')
                infowindow.open(map, this);
            }else{            infowindow.setContent('<div>' + 
            '<strong>' + this.title + '</strong><br>' +
            '</div>')
            infowindow.open(map, this);
            }

        });
    }
    // var marker = new google.maps.Marker({position:latLong, map: map});
}

// receives info from mtb api, populates mtb array and updates DOM list of trails
function trailList(mtbInfoArr) {
    // let distItem = $("<li>").text("Search Distance: " + dist + " miles");
    // $("#searchDist").text(dist);
    $(".mtbList").empty();
    for (var i = 0; i < mtbInfoArr.length; i++) {
        var trailName = mtbInfoArr[i].name;
        var trailLat = mtbInfoArr[i].latitude;
        var trailLon = mtbInfoArr[i].longitude;
        var trailID = mtbInfoArr[i].ID;
        var trailUrl = mtbInfoArr[i].tUrl 
        var trailItem = $("<li>");
        var trailLink = $("<a href='" + trailUrl + "'></a>");
        trailLink.attr("target", "_blank");
        trailLink.text(trailName);
        trailItem.append(trailLink);
        $(".mtbList").append(trailItem);
    }
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
function splashScreen(){
    setTimeout(function(){
        $("#splashScreen").slideUp(500);
        $("#appContent").fadeIn(1000);
        geoCall(distance());
    }, 1000);
}



// document on ready
$(document).ready(function () {
    // trailCall();
    // geoCall(distance());
    splashScreen();
    buttonClick();
    $('.dropdown-trigger').dropdown();
    $('.collapsible').collapsible();

    // end of doc ready
});