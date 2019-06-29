// create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable
var client;
// and a variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on
var layer;
// create the code to get the Earthquakes data using an XMLHttpRequest 
function getCrimes() {
	client = new XMLHttpRequest();
	client.open('GET','https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$limit=200'); 
	client.onreadystatechange = crimeResponse; 
// note don't use earthquakeResponse() with brackets as that doesn't work 
client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function crimeResponse() {
// this function listens out for the server to say that the data is ready - i.e. has state 4 
if (client.readyState == 4) {
// once the data is ready, process the data 
var crimedata = client.responseText; 
loadCrimelayer(crimedata);
}
}
// define a global variable to hold the layer so that we can use it later on
// convert the received data - which is text - to JSON format and add it to the map 
function loadCrimelayer(crimedata) {
// convert the text to JSON
var crimejson = JSON.parse(crimedata);
// add the JSON layer onto the map - it will appear using the default icons 
layer = L.geoJson(crimejson,
{
		//use point to layer to create the points
		pointToLayer: function (feature,latlng)
		{
		// look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude and use a different marker depending on this value
		// also include a pop-up that shows the place value of the earthquakes 
		return L.marker(latlng, {icon:testMarkerRed}).bindPopup("<b>"+feature.properties.primary_type +"</b>");
		console.log(crimejson)
},
}).addTo(map); 
map.fitBounds(layer.getBounds());
}