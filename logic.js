// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures (data.features)
   
  
  // The function that will determine the colour of the circle based on depth of the earthquake. 
  //Hint: The depth of the earth can be found as the third coordinate for each earthquake
  

  // Define a function that will give each earthquake a different radius based on its magnitude.
 //function radiusCalc(magnitude) {
    // Adjust the calculation based on your desired radius scaling factor
   // return Math.sqrt(Math.abs(magnitude)) * 1;
 // }

});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.title}</h3> <hr> <p>Date: ${new Date(feature.properties.time)}</p>`)
    }
    
    function createCircleMarker(feature, latlng){
      let options = {
       radius:feature.properties.mag*6,
       fillColor: chooseColor(feature.geometry.coordinates[2]),
       color: "black",
       weight: 1,
       opacity: 0.8,
       fillOpacity: 0.35
      } 
      return L.circleMarker(latlng,options);
   }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
    
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function  chooseColor(depth) {
  if (depth > 90) return "#B22222"; 
  else if (depth > 70) return "#DC1143C"; 
  else if (depth > 50) return "#BCBC00";
  else if (depth > 30) return "#FFFF00"; 
  else if (depth > 10) return "#006400"; 
  else return "#35BC00"; 
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      40.09, -115.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

 // Set up the legend
 let legend = L.control({ position: "bottomright" });

 // Designing the legend
 legend.onAdd = function() {
   let div = L.DomUtil.create("div", "legend");
   div.innerHTML += "<h5>Earthquake Depth</h5>";
   div.innerHTML += '<i style="background: #35BC00"></i><span>: -10 - 10</span><br>';
   div.innerHTML += '<i style="background: #006400""></i><span>: 10 - 30</span><br>';
   div.innerHTML += '<i style="background: #FFFF00"></i><span>: 30 - 50</span><br>';
   div.innerHTML += '<i style="background: #BCBC00"></i><span>: 50 - 70</span><br>';
   div.innerHTML += '<i style="background: #DC1143C"></i><span>: 70 - 90</span><br>';
   div.innerHTML += '<i style="background: #B22222"></i><span>: 90+ </span><br>';

   return div;
 };

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap); 
  legend.addTo(myMap);

}

 