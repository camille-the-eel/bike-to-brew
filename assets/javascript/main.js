// AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8  google API Key
// 200235024-32c4fc71813961608e163497918dd634 mtb project API key

// Google Multiple Results for brewery url: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5407,-77.4360&radius=1000&keyword=brewery&key=AIzaSyAkRgKvL87NTW0sZv9yDSOpQRPXaVV61h8

// https://www.mtbproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200235024-32c4fc71813961608e163497918dd634

// global variables: 
var mtbObject;
var mtbtrailInfoArr = [];
var map;

// ajax calls
function call() {
    var queryURL = "https://www.mtbproject.com/data/get-trails?lat=37.5407&lon=-77.4360&maxDistance=2&key=200235024-32c4fc71813961608e163497918dd634";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        mtbObject = response;
        console.log(mtbObject);
        trailList();
    });
}


// functions:
function markerMap() {

    var latLong = {lat: 37.5407, lng: -77.4360};
    var latLong2 = {lat: 37.5407, lng: -77.5360};
    var latLong3 = {lat: 37.5407, lng: -77.3360};
        
    // Creating Map (including style)
    map = new google.maps.Map(
        document.getElementById("markerMap"), {
            zoom: 12, 
            center: latLong, 
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

    // Calling 
    var iconBase = 'https://maps.google.com/mapfiles/ms/micons/';
    var icons = {
        bar: {
        icon: iconBase + "bar.png"
        },
        cycling: {
        icon: iconBase + "cycling.png"
        }
    };

    var mtbArray = [
        {
            position: latLong, 
            type: "bar"
        }, {
            position: latLong2, 
            type: "bar"
        }, {
            position: latLong3, 
            type: "cycling"
        }
    ]

    features.forEach(function(feature) {
        var marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map
        });
        console.log("marker placed")
    });

}
    
    

    // var goldStar = {
    //     path: "M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z",
    //     fillColor: "yellow",
    //     fillOpacity: 0.8,
    //     scale: 0.125,
    //     strokeColor: "gold",
    //     strokeWeight: 1
    // };


function trailList() {
    for (var i = 0; i < mtbObject.trails.length; i++) {
        // console.log(trailName);
        var trailName = mtbObject.trails[i].name;
        var trailLat = mtbObject.trails[i].latitude;
        var trailLon = mtbObject.trails[i].longitude;
        var trailInfo = {
            name: trailName,
            lat: trailLat,
            lon: trailLon
        }
        mtbtrailInfoArr.push(trailInfo);

        var trailItem = $("<li>")
        var trailLink = $("<a href='" + mtbObject.trails[i].url + "'></a>");
        trailLink.attr("target", "_blank");
        trailLink.text(trailName);
        trailItem.append(trailLink);
        $("#mtbList").append(trailItem);
    }
    // alert("trails")
}

// document on ready
$(document).ready(function () {
    call();

    // end of doc ready
});