// AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8  google API Key
// 200235024-32c4fc71813961608e163497918dd634 mtb project API key
// K5Z_dubKt-_EVyJUvAHPz3WGzLVsxRlETPB0HA7lDhxHhUK9yg3D1N0Hk3EQXg2lkQ1saWkwTKpAuUfxOz-tk8YQPCdO6T4lv9z-rMCWEOYT9_zslmYT7k62vTwoXHYx  Yelp API Key
// VLkrB9mSBeIJx4ZH6y8smQ   Yelp client ID

// Google Multiple Results for brewery url: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5407,-77.4360&radius=1000&keyword=brewery&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8

// https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200235024-32c4fc71813961608e163497918dd634

// global variables: 
// var mtbObject;
var mtbtrailInfoArr = [];

// var breweryObject;
var breweryInfoArr = [];

// var mapCtr;
// ajax calls

// lat and longitude based on current user location
function geoCall() {
    
    var queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8";
    $.ajax({
        url: queryURL,
        method: "POST"
    }).then(function (response) {
        var lat = response.location.lat;
        var long = response.location.lng;
        let mapCtr = {
            lat: lat,
            lng: long
        };
        let dist = $("#dist").val();
        console.log(mapCtr)
        $("#markerMap").empty();
        markerMap(mapCtr)
        trailCall(lat, long, dist);
        foursquareCall(lat, long, dist);
        // console.log(mapCtr);
    })
}

// lat and lon based on zip code or other search parameters - provided by google api
function coordinateCall(sParameter, dist) {
   
    var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sParameter + "&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response);
        let lat = response.results[0].geometry.location.lat
        let lon = response.results[0].geometry.location.lng
        let newLoc = {
            lat: lat,
            lng: lon
        };
        $("#markerMap").empty();
        markerMap(newLoc)
        trailCall(lat, lon, dist);
        foursquareCall(lat, lon, dist);
        // let div = $("<div>").text("Query: " + sParameter + "  = Lat: " + lat + " Lon: " + lon)
        // $("#locationInfo").append(div);
    });
}

// calls mtb project for trails located within a defined radius
function trailCall(lat, long, dist) {
// ajax calls
// console.log("Lat & Long: " + lat, long)
    // var queryURL = "https://www.mtbproject.com/data/get-trails?lat=37.5407&lon=-77.4360&maxDistance=2&key=200235024-32c4fc71813961608e163497918dd634";
    var queryURL = "https://www.mtbproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=" + dist + "&key=200235024-32c4fc71813961608e163497918dd634";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // mtbObject = response;
        // console.log(mtbObject);
        let mtbObject = response.trails;
        // console.log(mtbObject);
        trailList(mtbObject, dist);
    });
}

// calls four square search for breweries based on lat and long and search radius
function foursquareCall(lat, long, dist){
    let clientID = "AHO52TCU5VGZ15RXWQOXNCKIUADLG1IY2PSRTJKBIGVPPQTH";
    let clientSecret = "ML1MNNCBTE3LUQAYZRYLSKXHYYAMNRSKK4AE5YOWTTPEYMRN";
    // convert miles to meters because foursquare uses meters for radius
    let distMeters = dist * 1609.3;
    let v = 20181201
    let queryURL = "https://api.foursquare.com/v2/venues/explore?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=" + v + "&limit=10&radius=" + distMeters + "&ll=" + lat + "," + long + "&query=brewery";
    // let queryURL = "https://api.foursquare.com/v2/venues/explore?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20181223&limit=10&radius=" + distMeters + "&ll=" + lat + "," + long + "&query=brewery";
    // let queryURL = "https://api.foursquare.com/v2/venues/explore?client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20180323&limit=10&ll=" + lat + "," + long + "&query=brewery";
    // let queryURL = "https://api.foursquare.com/v2/venues/search?client_id=" + clientID + "&client_secret=" + clientSecret + "&limit=10&radius=" + dist + "&ll=" + lat + "," + long + "&query=brewery";

    $.ajax({
        url: queryURL,
        method: "get"
    }).then(function (data) {
        let breweryItems = data.response.groups[0].items;
        // brewList(response, dist);
        brewList(breweryItems, dist);
    })


}

// functions:
function markerMap(mapCtr) {

    var latLong = {lat: 37.5407, lng: -77.4360};
    var latLong2 = {lat: 37.5407, lng: -77.5360};
    var latLong3 = {lat: 37.5407, lng: -77.3360};
    
    var map = new google.maps.Map(
        document.getElementById("markerMap"), {
            zoom: 12, 
            center: mapCtr, 
            styles: [
                {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
                {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
                {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: '#d59563'}]
                },
                {
                featureType: 'poi',
                elementType: 'labels.text.fill',
                stylers: [{visibility: 'off'}]
                },
                {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: '#263c3f'}]
                },
                {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{visibility: 'off'}]
                },
                {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{color: '#38414e'}]
                },
                {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{color: '#212a37'}]
                },
                {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{color: '#9ca5b3'}]
                },
                {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{color: '#746855'}]
                },
                {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{color: '#1f2835'}]
                },
                {
                featureType: 'road.highway',
                elementType: 'labels.text.fill',
                stylers: [{color: '#f3d19c'}]
                },
                {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{visibility: 'off'}]
                },
                {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{visibility: 'off'}]
                },
                {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: '#17263c'}]
                },
                {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: '#515c6d'}]
                },
                {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: '#17263c'}]
            }
        ]
    });
    
    var marker = new google.maps.Marker({position:latLong, map: map});
    var marker2 = new google.maps.Marker({position:latLong2, map: map});
    var marker3 = new google.maps.Marker({position:latLong3, map: map});

}

// receives info from mtb api, populates mtb array and updates DOM list of trails
function trailList(mtbObject, dist) {
    // let distItem = $("<li>").text("Search Distance: " + dist + " miles");
    // $("#searchDist").text(dist);
    $("#mtbList").empty();
    for (var i = 0; i < mtbObject.length; i++) {
        var trailName = mtbObject[i].name;
        var trailLat = mtbObject[i].latitude;
        var trailLon = mtbObject[i].longitude;
        var trailID = mtbObject[i].id;
        var trailInfo = {
            name: trailName,
            ID: trailID,
            lat: trailLat,
            lon: trailLon
        }
        mtbtrailInfoArr.push(trailInfo);

        var trailItem = $("<li>");
        var trailLink = $("<a href='" + mtbObject[i].url + "'></a>");
        trailLink.attr("target", "_blank");
        trailLink.text(trailName);
        trailItem.append(trailLink);
        $("#mtbList").append(trailItem);
    }
}

// receives info from foursquare applicationCache, populates brewery array and updates DOM list of breweries
function brewList(breweryObject, dist) {
    // let distItem = $("<li>").text("Search Distance: " + dist + " miles");
    // $("#searchDist").text(dist);
    $("#breweryList").empty();
    for (var i = 0; i < breweryObject.length; i++) {
        var breweryName = breweryObject[i].venue.name;
        var breweryLat = breweryObject[i].venue.location.lat;
        var breweryLon = breweryObject[i].venue.location.lng;
        var breweryID = breweryObject[i].venue.id;

        var breweryInfo = {
            name: breweryName,
            ID: breweryID,
            lat: breweryLat,
            lon: breweryLon
        }
        breweryInfoArr.push(breweryInfo);
        // console.log(breweryInfo);

        var brewItem = $("<li>").text(breweryName);
        $("#breweryList").append(brewItem);
    }
    console.log(breweryInfoArr)
}

// activates button click functionality
function buttonClick(){
    $("#coordinateSubmit").click(function(event){
        event.preventDefault();
        let x = $("#coordinateInput").val();
        if(x == ""){
            geoCall();
        }else{            
            $("#coordinateInput").val("");
            let d = $("#dist").val();
            // console.log("dist: " + d)
            coordinateCall(x, d);
        }

    })
}


// document on ready
$(document).ready(function () {
    // trailCall();
    geoCall();
    buttonClick();

    // end of doc ready
});