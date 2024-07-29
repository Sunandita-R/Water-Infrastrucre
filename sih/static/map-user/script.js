// Define custom icons for water network components

// Initialize the map
var map = L.map("map").setView(["12.987065321038617", "79.9721354800911"], 17);

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Initialize the Leaflet.draw drawing control for pipes


var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var hydrantLayer = new L.LayerGroup();
var tankLayer = new L.LayerGroup();
var purifierLayer = new L.LayerGroup();
var valveLayer = new L.LayerGroup();
var pipeLayer = new L.LayerGroup();

map.addLayer(hydrantLayer);
map.addLayer(tankLayer);
map.addLayer(purifierLayer);
map.addLayer(valveLayer);
map.addLayer(pipeLayer);

var currentComponent = null;
var addedComponentIds = {}; // Store added component IDs
console.log(l);
lis = JSON.parse(l);
pd = JSON.parse(p);
console.log(lis);
for (i of pd) {
  const points = [
    [i[1], i[2]],
    [i[3], i[4]],
  ];

  // Create a blue polyline using the points
  const polyline = L.polyline(points, { color: "blue", id: i[0] }).addTo(map);
}
var pipeCoordinates = [];
for (i of lis) {
  const markerLatLng = new L.LatLng(i[3], i[4]);

  if (i[1] === "valve") {
    componentMarker = L.marker(markerLatLng, { icon: valveIcon,id:i[0] });
    valveLayer.addLayer(componentMarker);
  }
  if (i[1] === "hydrant") {
    componentMarker = L.marker(markerLatLng, { icon: hydrantIcon,id:i[0] });
    hydrantLayer.addLayer(componentMarker);
}
if (i[1] === "purifier") {
    
  componentMarker = L.marker(markerLatLng, { icon: purifierIcon,id:i[0] });
  purifierLayer.addLayer(componentMarker);
}
if (i[1] === "tank") {
  componentMarker = L.marker(markerLatLng, { icon: tankIcon, id:i[0] });
  tankLayer.addLayer(componentMarker);}}



// Function to save water component coordinates and ID to the database (You should implement this part)
function saveComponentToDatabase(componentType, coordinates, componentId) {
  // Implement the database saving logic here
  // Example:
  // var component = new ComponentModel({ type: componentType, coordinates: coordinates, id: componentId });
  // component.save(); // Save the component data to your database
}

// Function to save pipe coordinates to the database (You should implement this part)
function savePipeToDatabase(coordinates) {
  // Implement the database saving logic here
  // Example:
  // var pipe = new PipeModel({ coordinates: coordinates });
  // pipe.save(); // Save the pipe data to your database
}
