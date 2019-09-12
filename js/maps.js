function main() {
	$('.form-control').change(function(e) {
		e.preventDefault();
		/* Act on the event */
		var offence= $("#crimeType").val();
		var arrest= $("#arrest").val();
		var domestic= $("#domestic").val();
		var startDate= $("#startDate").val();
		var endDate= $("#endDate").val();
		// console.log(offence, arrest, domestic, startDate,endDate);

		// -------------------------- QUERY FOR CHOROPLETH LAYER IN SVG ---------------------

		var formData = new FormData();

	    var formData =  {
	        	"$select" : "community_area"
	        	+ ", "
	        	+ 'count(primary_type) as offence',
	        	"$group" : "community_area",
	        	"$where" : "date >='" + startDate + "'"
	        	+ " AND date <='" + endDate + "'"
	        	+ " AND latitude IS NOT NULL",
	        	"arrest" : arrest,
	        	"domestic" : domestic,
				"primary_type" : offence,
	        	"$order" : "community_area",
	        	"$limit" : 100000,
	        	"$$app_token": app_token};


	        if (offence == "All") {
			  //  block of code to be executed if condition1 is true
			  delete formData.primary_type;
			}if (arrest == "All"){
				delete formData.arrest;
			}if (domestic == "All"){
				delete formData.domestic;
			}else{
				// return formData
			};

			$.ajax({
				url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
				method: "GET",
				dataType: "json",
			    data: formData,
			}).done(function (crime) {
					$.ajax({
						url: 'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.geojson',
						type: 'GET',
						dataType: 'json',
						data:{},
					}).done(function(boundaries) {
						$.getJSON({
							url: "Census_2010_Populations_Chicago.json",
							type: "GET",
							dataType: "json",
						}).done(function (population) {
							var myPop = population;
							var myCrime = crime.features;
							var myBoundary = boundaries.features;
							for(var i =0; i < myCrime.length; i++){
								var dataState = myCrime[i].properties.community_area;
								var dataValue = +myCrime[i].properties.offence;

								for(var k= 0; k < myPop.length; k++){
									var	popArea = myPop[k].Community_Area_Num;
									var popNum = +myPop[k].Population_2010;


									for(var j =0; j < myBoundary.length; j++){
										var jsonState = myBoundary[j].properties.area_numbe;
										if(dataState == jsonState){
											myBoundary[j].properties.value = dataValue;
											break;
										}
										if(popArea == jsonState){
											myBoundary[j].properties.population_numb = popNum;
											var count = myBoundary[j].properties.value;
											var pop = myBoundary[j].properties.population_numb
											myBoundary[j].properties.crime_rate = (count / pop )*1000;
											break;
										}

									}
								}
							}
						getData(boundaries);
					});
				});
			});
	}).change();
};

window.onload = main
// ------------ CHOROPLETH LAYER --------------------// adapted from:view-source:https://leafletjs.com/examples/choropleth/example.html

// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	var crimeType = $("#crimeType").val()
	this._div.innerHTML = '<h5>' + crimeType + ' Crime</h5>' +  (props ?
		'<b>'+ 'Community Area: ' + props.community + ' (' + props.area_numbe + ')' + '</b><br /><b>' + props.value + ' Offence (s)' + '</b><br /><b> Crime rate: ' + props.crime_rate.toFixed(2) + ' per 1000 pop</b>'
		: 'Hover over a state');
};

info.addTo(map);

function style(feature) {
	return {
		weight: 1.5,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
	};
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 2,
		color: '#000000',
		dashArray: '',
		fillOpacity: 0.9
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function selectLocation(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 3,
		color: '#000000',
		dashArray: '',
		fillOpacity: 1
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
	// map.fitBounds(e.target.getBounds());
	var selectedLocation = e.target.feature.properties.area_numbe;
	// return selectedLocation;
	// console.log(selectedLocation);
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: selectLocation
	});
}

var geojson;

function getData(boundaries){
	myBoundary = boundaries
	if(geojson){
		map.removeLayer(geojson);
		layerControl.removeLayer(geojson)
	}
	geojson = L.choropleth(myBoundary, {
		valueProperty: "crime_rate",
		scale: ['#FFEDA0','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026'],
		steps: 8,
		mode: "k",
		style: style,
		onEachFeature: onEachFeature
	})
	map.addLayer(geojson);
	layerControl.addOverlay(geojson, "Choropleth");
}


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'info legend'),
		grades = ['#FFEDA0','#FED976','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026'] //[50, 100, 200, 500, 1000],
		labels = []

    /* Add min & max*/
div.innerHTML = '<div><h3 style="font-weight:bolder;font-size:larger;">Crime Rate</h3></div><div class="labels"><div class="min">Low</div> \
<div class="max">High</div></div>'

	for (var i = 0; i < grades.length; i++) {
		labels.push(
			'<li style="background-color:' + grades[i] + '"></li> ');
	}

	div.innerHTML += '<ul style="list-style-type:none;display:flex">' + labels.join('') + '</ul>';
	return div;
};


legend.addTo(map);
//

//============================================//========================//

$('.form-control').change(function() {
	var offence= $("#crimeType").val();
	var arrest= $("#arrest").val();
	var domestic= $("#domestic").val();
	var startDate= $("#startDate").val();
	var endDate= $("#endDate").val();

// ---------- Set request parameters ---------------
	var formHeatmap = new FormData();

    var formHeatmap =  {
        	"$where" : "date >='" + startDate + "'"
        	+ " AND date <='" + endDate + "'"
        	+ " AND latitude IS NOT NULL",
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
			"$limit": 200000,
        	"$$app_token" : app_token};

        if (offence == "All") {
		  //  block of code to be executed if condition1 is true
		  delete formHeatmap.primary_type;
		}if (arrest == "All"){
			delete formHeatmap.arrest;
		}if (domestic == "All"){
			delete formHeatmap.domestic;
		}else{

		};

	$.ajax({
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
		method: "GET",
		dataType: "json",
        data: formHeatmap,
	}).done(function(data) {
		heatLayer(data);
		graph1(data);
		graph4(data);
		// clusterLayer(data);
	});
}).change();

	// ---------- PLOT HEATMAP ---------------

// Adapted from: https://www.patrick-wied.at/static/heatmapjs/example-heatmap-leaflet.html
var heat;
function heatLayer(data) {
	if(heat){
		map.removeLayer(heat);
		layerControl.removeLayer(heat);
	}
	var locations = data.features.map(function(points){
			var location = points.geometry.coordinates.reverse();
			// location.push(0.9);
			return location;
		});

	// Draw heatmap
	 heat = new L.heatLayer(locations)

	// Set heatmap parameters
	heat.setOptions({
        radius: 9,
        max: 1.0,
        minOpacity: 0.8,
        scaleRadius: true,
        useLocalExtrema: true,
    });
	layerControl.addOverlay(heat, "Heatmap")
};


	// ---------- PLOT CLUSTER MAP ---------------
// var clusters;
// function clusterLayer(data){ //Inherited from AJAX in heatmapLayer
// 	if(clusters){
// 		map.removeLayer(clusters);
// 		layerControl.removeLayer(clusters);
// 	}
// 	clusters = new L.markerClusterGroup();
// 	var geoJsonLayer = new L.geoJson(data,{
// 			pointToLayer: function(feature, latlng){
// 				var marker = L.marker(latlng);
// 				marker.bindPopup(
// 					"<b>Crime Type: </b>"+feature.properties.primary_type +
// 					"</br>" +
// 					"<b>Description: </b>"+feature.properties.description  +
// 					"</br>" +
// 					"<b>Block: </b>"+feature.properties.block  +
// 					"</br>" +
// 					"<b>Date: </b>"+feature.properties.date);
// 				return marker;
// 			},
//         });

//     map.addLayer(geoJsonLayer);
//     layerControl.addOverlay(clusters, "Clusters")
// };
