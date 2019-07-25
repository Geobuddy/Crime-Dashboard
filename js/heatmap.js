$('.form-control').change(function() {
	var offence= $("#crimeType").val();
	var arrest= $("#arrest").val();
	var domestic= $("#domestic").val();
	var startDate= $("#startDate").val();
	var endDate= $("#endDate").val();

// ---------- PLOT HEATMAP ---------------
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
	}).done(function(heatmap) {

		var locations = heatmap.features.map(function(points){

			var location = points.geometry.coordinates.reverse();
			location.push(0.5);
			return location;
		});

		heat = new L.heatLayer(locations, {radius: 10}).addTo(map);

	})
	.fail(function() {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});

});