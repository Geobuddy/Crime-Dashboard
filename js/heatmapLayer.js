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
    // render map with the new options

    if(heat){
    	$(".leaflet-heatmap-layer").remove(); //Destroy previous canvas
    }
    else{

    }
    map.addLayer(heat);
};

// Hide and Show Heatmap
$("#Btn2").click(function() {
    	$(".leaflet-heatmap-layer").toggle();
    });

