// Define custom icons for water network components

// Initialize the map
var map = L.map("map").setView(["12.987065321038617", "79.9721354800911"], 17);

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

// Initialize the Leaflet.draw drawing control for pipes
var drawControl = new L.Control.Draw({
  edit: false,
  draw: {
    polygon: false,
    polyline: {
      shapeOptions: {
        color: "blue",
      },
      allowIntersection: true,
      showLength: true,
      metric: true,
    },
    rectangle: false,
    circle: false,
    circlemarker: false,
  },
});
map.addControl(drawControl);

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

var pipeCoordinates = [];

map.on("draw:created", function (e) {
  var layer = e.layer;

  if (layer instanceof L.Polyline) {
    var latLngs = layer.getLatLngs();

    if (latLngs.length === 2) {
      var startCoordinates = latLngs[0];
      var endCoordinates = latLngs[1];
      const csrfToken = document.querySelector(
        "input[name=csrfmiddlewaretoken]"
      ).value; // Get the CSRF token
      const url = "fun1"; // Replace with the actual Django endpoint URL

      const data = {
        startCoordinates: startCoordinates,
        endCoordinates: endCoordinates,
        csrfmiddlewaretoken: csrfToken,
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
      });
      console.log("Start Coordinates:", startCoordinates);
      console.log("End Coordinates:", endCoordinates);

      pipeCoordinates.push({ start: startCoordinates, end: endCoordinates });

      drawnItems.addLayer(layer);
      savePipeToDatabase(pipeCoordinates);
    } else {
      console.error("Pipe must consist of exactly two points.");
    }
  }
});

map.on("click", function (e) {
  if (currentComponent) {
    // Capture the component ID from the input field
    var componentId = document.getElementById("componentId").value;

    // Check if the component ID is blank or empty
    if (!componentId.trim()) {
      alert("Component ID is required. Please enter a valid ID.");
      return; // Prevent adding a component with a blank ID
    }

    // Check if the component ID already exists
    if (addedComponentIds[componentId]) {
      alert(
        "Component with the same ID already exists. Not adding a duplicate."
      );
      return; // Prevent adding a duplicate component
    }

    // Create a marker based on the selected component type
    var componentMarker;
    switch (currentComponent) {
      case "hydrant":
        componentMarker = L.marker(e.latlng, { icon: hydrantIcon });
        hydrantLayer.addLayer(componentMarker);
        break;
      case "tank":
        componentMarker = L.marker(e.latlng, { icon: tankIcon });
        tankLayer.addLayer(componentMarker);
        break;
      case "purifier":
        componentMarker = L.marker(e.latlng, { icon: purifierIcon });
        purifierLayer.addLayer(componentMarker);
        break;
      case "valve":
        componentMarker = L.marker(e.latlng, { icon: valveIcon });
        valveLayer.addLayer(componentMarker);
        break;
      default:
        break;
    }

    // If a component marker is added, store its ID in the data structure
    if (componentMarker) {
      addedComponentIds[componentId] = true;
      compname = currentComponent;
      id = componentId;

      // Log the component ID and coordinates
      const csrfToken = document.querySelector(
        "input[name=csrfmiddlewaretoken]"
      ).value; // Get the CSRF token
      const url = "fun1"; // Replace with the actual Django endpoint URL

      const data = {
        startCoordinates: startCoordinates,
        endCoordinates: endCoordinates,
        csrfmiddlewaretoken: csrfToken,
      };

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify(data),
      });
      console.log(`${currentComponent} Coordinates:`, e.latlng);
      console.log("Component ID:", componentId);
      const latitude = e.latlng.lat;
      const longitude = e.latlng.lng;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      // Save the component data (including ID) to the database (You should implement this part)
      saveComponentToDatabase(currentComponent, e.latlng, componentId);
    }
  }
});

// Function to set the current component type
function setCurrentComponent(componentType) {
  currentComponent = componentType;
}

// Event listener for the form submission
document
  .getElementById("addComponentForm")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from actually submitting

    // Get the selected component type from the form
    var selectedComponent = document.getElementById("type").value;

    // Set the currentComponent to the selected component type

    if (selectedComponent === "pipe") {
      // Enable drawing mode for pipes
      currentComponent = "pipe";
      map.addControl(drawControl);
      // pipeCoordinates = []; // Clear previous pipe coordinates
    } else {
      // Handle other component types here (e.g., hydrant, tank, etc.)
      setCurrentComponent(selectedComponent);
      var componentId = document.getElementById("componentId").value;
      console.log("Selected Component:", selectedComponent);
      console.log("Component ID:", componentId);
    }

    // Add any other logic you need, such as creating a marker on the map
  });

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
