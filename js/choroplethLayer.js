$(document).ready(function() {
	$('.form-control').change(function(e) {
		e.preventDefault();
		/* Act on the event */
		var offence= $("#crimeType").val();
		var arrest= $("#arrest").val();
		var domestic= $("#domestic").val();
		var startDate= $("#startDate").val();
		var endDate= $("#endDate").val();
		console.log(offence, arrest, domestic, startDate,endDate);

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
				graph2(crime);
				$.ajax({
					url: 'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.geojson',
					type: 'GET',
					dataType: 'json',
					data:{
					},
				}).done(function(boundaries) {
					$.getJSON("Census_2010_Populations_Chicago.json", function(data) {
					}).done(function (population) {
						var myPop = population;
						console.log(myPop);
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
	});
});

// ------------ CHOROPLETH LAYER --------------------// adapted from:view-source:https://leafletjs.com/examples/choropleth/example.html

		// control that shows state info on hover
		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h5>Chicago Crime Count</h5>' +  (props ?
				'<b>'+ 'Community Area: ' + props.area_numbe + '</b><br />' + props.value + ' Offence (s)' + '<br /> Crime rate: ' + props.crime_rate.toFixed(2) + ' per 1000 pep'
				: 'Hover over a state');
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d //> 1000 ? '#253494' :
					// d > 500  ? '#2c7fb8' :
					// d > 200  ? '#41b6c4' :
					// d > 100  ? '#7fcdbb' :
					// d > 50   ? '#c7e9b4' :
					// 			'#ffffcc';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '2',
				fillOpacity: 0.7,
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 3,
				color: '#666',
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

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		var geojson;

		function getData(boundaries){
			myBoundary = boundaries

			// if(geojson){
			// 	map.removeLayer(geojson);
			// 	layerControl.removeLayer(geojson)
			// }
			// geojson = L.geoJson(myBoundary, {
			// style: style,
			// onEachFeature: onEachFeature
			// })
			// map.addLayer(geojson);
			// layerControl.addOverlay(geojson, "Choropleth")
			// map.addLayer(geojson);

			if(geojson){
				map.removeLayer(geojson);
				layerControl.removeLayer(geojson)
			}
			geojson = L.choropleth(myBoundary, {
				valueProperty: "value",
				scale: ["#d1eeea","#a8dbd9","#85c4c9","#68abb8","#4f90a6","#3b738f","#2a5674"],
				steps: 7,
				mode: "q",
				style: style,
				onEachFeature: onEachFeature
			})
			map.addLayer(geojson);

			layerControl.addOverlay(geojson, "Choropleth")

		}





		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = ["#d1eeea","#a8dbd9","#85c4c9","#68abb8","#4f90a6","#3b738f","#2a5674"] //[50, 100, 200, 500, 1000],
				labels = []

		    /* Add min & max*/
    div.innerHTML = '<div><h3 style="font-weight:bolder;font-size:larger;">Crime Rate</h3></div><div class="labels"><div class="min">Low</div> \
  <div class="max">High</div></div>'

			for (var i = 1; i < grades.length; i++) {
				labels.push(
					'<li style="background-color:' + grades[i] + '"></li> ');
			}

			div.innerHTML += '<ul style="list-style-type:none;display:flex">' + labels.join('') + '</ul>';
			return div;
		};

		legend.addTo(map);















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
        	"$where" : "date >'" + startDate + "'"
        	+ " AND date <'" + endDate + "'"
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
		clusterLayer(data);
		heatLayer(data);
	});
});
	
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
    //     	map.addLayer(heat);
	layerControl.addOverlay(heat, "Heatmap")
};


	// ---------- PLOT CLUSTER MAP ---------------
var clusters;

function clusterLayer(data){ //Inherited from AJAX in heatmapLayer
	if(clusters){
		map.removeLayer(clusters);
		layerControl.removeLayer(clusters);
	}
	geoJsonLayer = new L.geoJson(data,{
			pointToLayer: function(feature, latlng){
				return L.marker(latlng).bindPopup(
					"<b>Crime Type: </b>"+feature.properties.primary_type + 
					"</br>" +
					"<b>Description: </b>"+feature.properties.description  + 
					"</br>" +
					"<b>Block: </b>"+feature.properties.block  + 
					"</br>" +
					"<b>Date: </b>"+feature.properties.date);
			},
        });

	clusters = new L.markerClusterGroup({ disableClusteringAtZoom: 15 });

    clusters.addLayer(geoJsonLayer);
    // map.addLayer(clusters);
    layerControl.addOverlay(clusters, "Clusters")
};

