// AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8  google API Key
// 200235024-32c4fc71813961608e163497918dd634 mtb project API key

// Google Multiple Results for brewery url: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5407,-77.4360&radius=1000&keyword=brewery&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8

// https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200235024-32c4fc71813961608e163497918dd634

// global variables: 
var mtbObject;
var mtbtrailInfoArr = [];

var mapCtr;

function trailCall(lat, long, dist) {
// ajax calls
console.log("Lat & Long: " + lat, long)
    // var queryURL = "https://www.mtbproject.com/data/get-trails?lat=37.5407&lon=-77.4360&maxDistance=2&key=200235024-32c4fc71813961608e163497918dd634";
    var queryURL = "https://www.mtbproject.com/data/get-trails?lat=" + lat + "&lon=" + long + "&maxDistance=" + dist + "&key=200235024-32c4fc71813961608e163497918dd634";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        mtbObject = response;
        console.log(mtbObject);
        trailList(dist);
    });
}


function geoCall() {
    var queryURL = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8";
    $.ajax({
        url: queryURL,
        method: "POST"
    }).then(function (response) {
        var lat = response.location.lat;
        var long = response.location.lng;
        mapCtr = {
            lat: lat,
            long: long
        };
        let dist = $("#dist").val();
        console.log("Dist: " + dist)
        trailCall(lat, long, dist);
        console.log(mapCtr);
    })
}

function coordinateCall(sParameter, dist) {
        var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + sParameter + "&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8";
    
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            let lat = response.results[0].geometry.location.lat
            let lon = response.results[0].geometry.location.lng
            trailCall(lat, lon, dist);
            // let div = $("<div>").text("Query: " + sParameter + "  = Lat: " + lat + " Lon: " + lon)
            // $("#locationInfo").append(div);
        });
    }

// functions:
function markerMap() {

    var latLong = {lat: 37.5407, lng: -77.4360};
    var latLong2 = {lat: 37.5407, lng: -77.5360};
    var latLong3 = {lat: 37.5407, lng: -77.3360};
    
    var map = new google.maps.Map(
        document.getElementById("markerMap"), {
            zoom: 12, 
            center: latLong, 
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

function trailList(dist) {
    // let distItem = $("<li>").text("Search Distance: " + dist + " miles");
    $("#searchDist").text(dist);
    $("#mtbList").empty();
    for (var i = 0; i < mtbObject.trails.length; i++) {
        var trailName = mtbObject.trails[i].name;
        var trailLat = mtbObject.trails[i].latitude;
        var trailLon = mtbObject.trails[i].longitude;
        var trailID = mtbObject.trails[i].id;
        var trailInfo = {
            name: trailName,
            ID: trailID,
            lat: trailLat,
            lon: trailLon
        }
        mtbtrailInfoArr.push(trailInfo);
        console.log(trailInfo);

        var trailItem = $("<li>");
        var trailLink = $("<a href='" + mtbObject.trails[i].url + "'></a>");
        trailLink.attr("target", "_blank");
        trailLink.text(trailName);
        trailItem.append(trailLink);
        $("#mtbList").append(trailItem);
    }
}

function buttonClick(){
    $("#coordinateSubmit").click(function(event){
        event.preventDefault();
        let x = $("#coordinateInput").val();
        let d = $("#dist").val();
        console.log("dist: " + d)
        coordinateCall(x, d);
    })
}


// document on ready
$(document).ready(function () {
    // trailCall();
    geoCall();
    buttonClick();

    // end of doc ready
});