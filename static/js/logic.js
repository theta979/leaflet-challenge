// Create the 'basemap' tile layer that will be the background of our map.
let topoMaps = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let myMap = L.map("map", {
  center: [27.96044, -15],
  zoom: 3
});

// Then add the 'basemap' tile layer to the map.
topoMaps.addTo(myMap);

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      color: "white",
      fillColor: chooseColor(feature.geometry.coordinates[2]),
      opacity: 1,
      fillOpacity: 1,
      radius: getRadius(feature.properties.mag),
      weight: 1
    }
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function chooseColor(depth) {
    switch (true) {
      case depth > 90:
        return "#FF0000";
      case depth > 70:
        return "#ea2c2c";
      case depth > 50:
          return "#f2a134";
      case depth > 30:
            return "#f7e379"; 
      case depth > 10:
        return "#d4ee00";     
      default:
        return "#98ee00";
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag + "<br>Depth: "
        + feature.geometry.coordinates[2] + "<br>Location: "
        + feature.properties.place
        
      );
      layer.on("mouseover", function () {
        this.openPopup();
      });

      layer.on("mouseout", function () {
        this.closePopup();
      });
    }

  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    div.style.background = "white";
    div.style.padding = "10px";
    // div.style.margin = "60px";
    // div.style.width = "auto";
    // div.style.height = "40px";
    // div.style.display = "flex";
    div.style.alignItems = "center";

    // Initialize depth intervals and colors for the legend

    let depthInterval = [0, 10, 30, 50, 70, 90];
    let depthColor = ["#98ee00", "#d4ee00", "#f7e379", "#f2a134", "#ea2c2c", "#FF0000"];

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    div.innerHTML = "<h2 style='text-align: center;'>Legend</h2>"; // add title first

    for (let i = 0; i < depthInterval.length; i++) {
      div.innerHTML += "<i style='background: " + depthColor[i] + "; width: 40px; height: 20px; display: inline-block; margin-right: 5px;'></i> "
       + depthInterval[i] + (depthInterval[i + 1] ? "&ndash;" + depthInterval[i + 1] + "<br>" : "+");
    }

    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  // d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

});
