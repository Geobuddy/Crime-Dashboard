function main() {
var app_token = "GhcK7Cj79Lg5uRtd5hPdldrnY";

	$('.form-control').change(function() {
		var offence= $("#crimeType").val();
		var arrest= $("#arrest").val();
		var domestic= $("#domestic").val();
		var startDate= $("#startDate").val();
		var endDate= $("#endDate").val();

	// ---------- Set request parameters ---------------
		var formTable = new FormData();

	    var formTable =  {
	        	"$where" : "date >='" + startDate + "'"
	        	+ " AND date <='" + endDate + "'"
	        	+ " AND latitude IS NOT NULL",
	        	"arrest" : arrest,
	        	"domestic" : domestic,
				"primary_type" : offence,
				"$limit": 2000,
	        	"$$app_token" : app_token};

	        if (offence == "All") {
			  //  block of code to be executed if condition1 is true
			  delete formTable.primary_type;
			}if (arrest == "All"){
				delete formTable.arrest;
			}if (domestic == "All"){
				delete formTable.domestic;
			}else{

			};

		$.ajax({
			url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
			method: "GET",
			dataType: "json",
	        data: formTable,
		}).done(function(data) {
			var table = data.features
			$('#myTable').DataTable({
				destroy: true, //clear previous table//
				data: table,
			    columns: [
		            { "data": "properties.primary_type" },
		            { "data": "properties.description" },
		            { "data": "properties.location_description" },
		            { "data": "properties.date" },
		            { "data": "properties.arrest" },
		            { "data": "properties.domestic" },
		            { "data": "properties.community_area" },
		            { "data": "properties.latitude" },
		            { "data": "properties.longitude" },
		        ]
			});
		});
	}).change();
};

window.onload = main;
