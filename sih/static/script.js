// Define custom icons for water network components

// Initialize the map
var map = L.map("map").setView(["12.987065321038617", "79.9721354800911"], 25);

// Add a tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);
//

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
  var componentMarker;
  map.on("contextmenu", (event) => {
    const latlng = event.latlng;
    if (polyline.getBounds().contains(latlng)) {
      const id = polyline.options.id;
      if (window.confirm("Are you sure you want to delete this line?")) {
        map.removeLayer(polyline);
        url = "rem";
        const csrfToken = document.querySelector(
          "input[name=csrfmiddlewaretoken]"
        ).value; // Get the CSRF token
        // Replace with the actual Django endpoint URL

        const data = {
          pipid: id,
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
      }
    }
  });
}
for (i of lis) {
  const markerLatLng = new L.LatLng(i[3], i[4]);

  if (i[1] === "valve") {
    componentMarker = L.marker(markerLatLng, { icon: valveIcon,id:i[0] });
    valveLayer.addLayer(componentMarker);
    const id = componentMarker.options.id;
    componentMarker.on("contextmenu", function (event) {
      if(window.confirm("Are you sure you want to delete this valve?")){
      url = "remmark";
        const csrfToken = document.querySelector(
          "input[name=csrfmiddlewaretoken]"
        ).value; // Get the CSRF token
        // Replace with the actual Django endpoint URL

        const data = {
          pipid: id,
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
        location.reload()
  }});
  }
  if (i[1] === "hydrant") {
    componentMarker = L.marker(markerLatLng, { icon: hydrantIcon,id:i[0] });
    hydrantLayer.addLayer(componentMarker);
    const id = componentMarker.options.id;
    componentMarker.on("contextmenu", function (event) {
      if(window.confirm("Are you sure you want to delete this hydrant?")){
      url = "remmark";
        const csrfToken = document.querySelector(
          "input[name=csrfmiddlewaretoken]"
        ).value; // Get the CSRF token
        // Replace with the actual Django endpoint URL

        const data = {
          pipid: id,
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
        location.reload()
  }});
  }
  if (i[1] === "purifier") {
    
    componentMarker = L.marker(markerLatLng, { icon: purifierIcon,id:i[0] });
    purifierLayer.addLayer(componentMarker);
    const id = componentMarker.options.id;
    componentMarker.on("contextmenu", function (event) {
      if(window.confirm("Are you sure you want to delete this purifier?")){
      url = "remmark";
        const csrfToken = document.querySelector(
          "input[name=csrfmiddlewaretoken]"
        ).value; // Get the CSRF token
        // Replace with the actual Django endpoint URL

        const data = {
          pipid: id,
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
        location.reload()
  }});
  }
  if (i[1] === "tank") {
    componentMarker = L.marker(markerLatLng, { icon: tankIcon, id:i[0] });
    tankLayer.addLayer(componentMarker);
    const id = componentMarker.options.id;
    componentMarker.on("contextmenu", function (event) {
      if(window.confirm("Are you sure you want to delete this tank?")){
      url = "remmark";
        const csrfToken = document.querySelector(
          "input[name=csrfmiddlewaretoken]"
        ).value; // Get the CSRF token
        // Replace with the actual Django endpoint URL

        const data = {
          pipid: id,
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
        location.reload()
  }});
  }
}
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
map.on("draw:created", function (e) {
  var layer = e.layer;

  if (layer instanceof L.Polyline) {
    var latLngs = layer.getLatLngs();

    if (latLngs.length === 2) {
      startCoordinates = latLngs[0];
      endCoordinates = latLngs[1];
      console.log("Start Coordinates:", startCoordinates);
      console.log("End Coordinates:", endCoordinates);

      pipeCoordinates.push({ start: startCoordinates, end: endCoordinates });

      drawnItems.addLayer(layer);
      map.on("draw:drawstart", (event) => {
        // Remove the previous polyline when starting a new drawing
        if (event.layerType === "polyline") {
          removeExistingPolyline();
        }
      });

      function removeExistingPolyline() {
        map.eachLayer((layer) => {
          if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });
      }

      // Add a contextmenu event listener to the map to delete the polyline on right-click
      map.on("contextmenu", (event) => {
        const latlng = event.latlng;
        map.eachLayer((layer) => {
          if (
            layer instanceof L.Polyline &&
            layer.getBounds().contains(latlng)
          ) {
            if (window.confirm("Are you sure you want to delete this line?")) {
              map.removeLayer(layer);
            }
          }
        });
      });

      var startlat = latLngs[0].lat;
      var endlat = latLngs[1].lat;
      var startlng = latLngs[0].lng;
      var endlng = latLngs[1].lng;
      const csrfToken = document.querySelector(
        "input[name=csrfmiddlewaretoken]"
      ).value; // Get the CSRF token
      const url = "pipe"; // Replace with the actual Django endpoint URL

      const data = {
        startlat: startlat,
        startlng: startlng,
        endlat: endlat,
        endlng: endlng,
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
      location.reload();
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
    if (!componentId.trim() && currentComponent !== "pipe") {
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
      const icon = componentMarker.getIcon();
      console.log(icon);
      // You can now access poperties of the icon, for example, the icon URL
      iconUrl = icon.options.iconUrl;

      console.log("Icon URL:", iconUrl);
      addedComponentIds[componentId] = true;
      compname = currentComponent;
      id = componentId;
      latitude = e.latlng.lat;
      longitude = e.latlng.lng;

      // Log the component ID and coordinates
      const csrfToken = document.querySelector(
        "input[name=csrfmiddlewaretoken]"
      ).value; // Get the CSRF token
      const url = "fun1"; // Replace with the actual Django endpoint URL

      const data = {
        iconUrl: iconUrl,
        compname: compname,
        id: id,
        latitude: latitude,
        longitude: longitude,

        csrfmiddlewaretoken: csrfToken,
      };
      if (id !== null) {
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(data),
        });
      }
      console.log(`${currentComponent} Coordinates:`, e.latlng);
      console.log("Component ID:", componentId);
      location.reload();
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
/////////////////////////////////////////////
// 

 //Define the grievance icon
 

// Define grievance data with coordinates and complaint ID
var grievanceData = [
  { lat: 12.987, lng: 79.972, complaintId: '123' },
  { lat: 12.988589, lng: 79.97136, complaintId: '23'},
  {lat: 12.98833, lng: 79.97267, complaintId:'56'},
  {lat: 12.98845, lng: 79.9724, complaintId:'121'}    // Add more data as needed
];

// Add grievance markers to the map with popups
grievanceData.forEach(function (data) {
  var marker = L.marker([data.lat, data.lng], { icon: grievanceIcon }).addTo(map);

  // Create a popup with coordinates and complaint ID
  var popupContent = `
      <strong>Location:</strong> ${data.lat}, ${data.lng}<br>
      <strong>Complaint ID:</strong> ${data.complaintId}
  `;

  // Add the popup to the marker
  marker.bindPopup(popupContent);

  // Define popup behavior
  marker.on('mouseover', function () {
      this.openPopup();
  });

  marker.on('mouseout', function () {
      this.closePopup();
  });
});




// Define tank data with coordinates, tank ID, and capacity
var tankData = [
  {lat: 12.988172378935182, lng: 79.971065998142, tankId: '3', capacity: '20,000 L' },
  {lat: 12.98847429838, lng: 79.97438429838, tankId: '5', capacity: '15,000 L' },
  // Add more data as needed
];

// Add tank markers to the map with popups
tankData.forEach(function (data) {
  var marker = L.marker([data.lat, data.lng], { icon: tankIcon }).addTo(map);

  // Create a popup with tank information
  var popupContent = `
      <strong>Type:</strong> Tank<br>
      <strong>Tank ID:</strong> ${data.tankId}<br>
      <strong>Capacity:</strong> ${data.capacity}
  `;

  // Add the popup to the marker
  marker.bindPopup(popupContent);

  // Define popup behavior
  marker.on('mouseover', function () {
      this.openPopup();
  });

  marker.on('mouseout', function () {
      this.closePopup();
  });
});

// Define pipe data with coordinates, pipe ID, diameter, and length
var pipeData = [
  {lat1: 12.988172378935182, lng1: 79.971065998142, lat2: 12.9881013087559, lng2: 79.97199726130931, pipeId: 'P001', diameter: '800mm', length: '102 meters' },
  { lat1: 12.9881013087559, lng1: 79.97199726130931, lat2: 12.988807831091236, lng2: 79.97209167493565, pipeId: 'P002', diameter: '800mm', length: '185 meters' },
  { lat1: 12.988807831091236, lng1: 79.97209167493565, lat2: 12.988791108628165, lng2: 79.97379541429838, pipeId: 'P003', diameter: '800mm', length: '370 meters' },
  { lat1: 12.988791108628165, lng1: 79.97379541429838, lat2: 12.98847429838, lng2: 79.9743429838, pipeId: 'P004', diameter: '800mm', length: '435 meters' },
  // Add more pipe data as needed
];

// Create yellow polylines for the pipes and add popups with information
pipeData.forEach(function (data) {
  var pipeCoordinates = [
      [data.lat1, data.lng1],
      [data.lat2, data.lng2]
  ];

  var pipe = L.polyline(pipeCoordinates, { color: 'orange' }).addTo(map);

  // Create a popup with pipe information
  var popupContent = `
      <strong>Pipe ID:</strong> ${data.pipeId}<br>
      <strong>Diameter:</strong> ${data.diameter}<br>
      <strong>Length:</strong> ${data.length}
  `;

  // Add the popup to the pipe
  pipe.bindPopup(popupContent);

  // Define popup behavior
  pipe.on('mouseover', function () {
      this.openPopup();
  });

  pipe.on('mouseout', function () {
      this.closePopup();
  });
});

// Fit the map to the bounds of the pipes
map.fitBounds(pipeData.map(function (data) {
  return [[data.lat1, data.lng1], [data.lat2, data.lng2]];
}));

// Define additional pipe data for red pipes
var additionalRedPipeData = [
  {
      lat1: 12.98821104570188, lng1: 79.97464728348861,
      lat2: 12.986425560039274, lng2: 79.97217857840954,
      diameter: '200mm',
      length: '75 meters'
  },
  {
      lat1: 12.987074180762704, lng1: 79.97306907212989,
     lat2: 12.989480991366603, lng2: 79.97068083332125,
      diameter: '200mm',
      length: '150 meters'
  },
  {
      lat1: 12.986425560039274, lng1: 79.97217857840954,
     lat2: 12.98676337335111, lng2: 79.96924960616526,
      diameter: '200mm',
      length: '50 meters'
  }
];

// Create red polylines for the additional red pipes and add popups with information
additionalRedPipeData.forEach(function (data) {
  var pipeCoordinates = [
      [data.lat1, data.lng1],
      [data.lat2, data.lng2]
  ];

  var redPipe = L.polyline(pipeCoordinates, { color: 'red' }).addTo(map);

  // Create a popup with red pipe information
  var popupContent = `
      <strong>Diameter:</strong> ${data.diameter}<br>
      <strong>Length:</strong> ${data.length}
  `;

  // Add the popup to the red pipe
  redPipe.bindPopup(popupContent);

  // Define popup behavior
  redPipe.on('mouseover', function () {
      this.openPopup();
  });

  redPipe.on('mouseout', function () {
      this.closePopup();
  });
});



// Define valve data with coordinates, valve ID, and other information
var valveData = [
  {
      lat: 12.987042402519501,
      lng: 79.97308462858201,
      valveId: '7',
      type: 'Valve',
      status: 'Open',
  },
  // Add more data as needed
];

// Add valve markers to the map with popups
valveData.forEach(function (data) {
  var marker = L.marker([data.lat, data.lng], { icon: valveIcon }).addTo(map);

  // Create a popup with valve information
  var popupContent = `
      <strong>Type:</strong> ${data.type}<br>
      <strong>Valve ID:</strong> ${data.valveId}<br>
      <strong>Status:</strong> ${data.status}
  `;

  // Add the popup to the marker
  marker.bindPopup(popupContent);

  // Define popup behavior
  marker.on('mouseover', function () {
      this.openPopup();
  });

  marker.on('mouseout', function () {
      this.closePopup();
  });
});

