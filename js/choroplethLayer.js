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
				'<b>'+ 'Community Area: ' + props.area_numbe + '</b><br />' + props.value + ' Offence (s)' + '<br /> Crime rate: ' + props.crime_rate.toFixed(3) + ' per 1000 pep'
				: 'Hover over a state');
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d > 1000 ? '#253494' :
					d > 500  ? '#2c7fb8' :
					d > 200  ? '#41b6c4' :
					d > 100  ? '#7fcdbb' :
					d > 50   ? '#c7e9b4' :
								'#ffffcc';
					
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '2',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.value)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 3,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}


		function resetHighlight(e) {
			// console.log(e);
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
			myBoundary = boundaries.features;
			if(geojson){
				$( "#Cbox3" ).prop( "checked", false );
				map.removeLayer(geojson);
			}
			geojson = L.geoJson(myBoundary, {
			style: style,
			onEachFeature: onEachFeature
		})
		map.addLayer(geojson);

		}

		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [50, 100, 200, 500, 1000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);

		// Hide and Show Choropleth
		$("#Cbox1").click(function() {
			if(this.checked){
		    	// map.addLayer(geojson);
		    	legend.addTo(map);
		    	map.addLayer(info);
			}else{
				// map.removeLayer(geojson);
				legend.onRemove(map);
				map.removeLayer(info);
			}    
		    });



		// });
// 	});
// });













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
function heatLayer(data) {
	$( "#Cbox2" ).prop( "checked", false );
	$(".leaflet-heatmap-layer").hide();
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
        minOpacity: 0.7,
        scaleRadius: true,
        useLocalExtrema: true,
    });

};

$("#Cbox2").click(function() {
	if(this.checked){
    	map.addLayer(heat);
	}else{
		map.removeLayer(heat);
	}    
    });

	// ---------- PLOT CLUSTER MAP ---------------
var clusters;

function clusterLayer(data){ //Inherited from AJAX in heatmapLayer
	if(clusters){
		$( "#Cbox3" ).prop( "checked", false );
		map.removeLayer(clusters);
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
					"<b>Date: </b>"+Date(feature.properties.date));
			},
        });

	clusters = new L.markerClusterGroup({ disableClusteringAtZoom: 15 });

    clusters.addLayer(geoJsonLayer);
};

		// Hide and Show Heatmap
	$("#Cbox3").click(function() {
		if(this.checked){
	    	map.addLayer(clusters);
		}else{
			map.removeLayer(clusters);
		}    
	    });
	
