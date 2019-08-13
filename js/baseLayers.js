    // load the map
var map =  L.map('map', {center: [41.815, -87.71], zoom: 11}, {doubleClickZoom: false});

// load the tiles
var CartoDB_DarkMatter =  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 18
}).addTo(map);

var osm =  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}',
 {foo: 'bar',
 maxZoom: 18, 
 attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(map);

var baseLayers = {
	"CartoDB": CartoDB_DarkMatter,
	"OSM": osm,
	};  

var layerControl =L.control.layers(baseLayers).addTo(map);	

L.control.scale({maxWidth: 200}).addTo(map);