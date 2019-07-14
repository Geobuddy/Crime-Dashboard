$(document).ready(

	function() {
	var offSelect = $("#crimeType")
	
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$select=distinct primary_type&$order=primary_type ASC'
	})
	.done(function(data) {
		// console.log(data);
		$.each(data.features, function (i, feature) {
			// console.log(i,feature);
			offSelect.append(
				$("<option></option>").val(feature.properties.primary_type).html(feature.properties.primary_type))
		});

		console.log(data);
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});


	var arrSelect = $("#arrest")
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$select=distinct arrest&$order=arrest DESC'
	})
	.done(function(data) {
		console.log(data);
		$.each(data.features, function (i, feature) {
			console.log(i,feature);
			arrSelect.append(
				$("<option></option>").val(feature.properties.arrest).html(feature.properties.arrest))
			// body...
		});
		console.log(data);
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

	var domSelect = $("#domestic")
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$select=distinct domestic&$order=domestic DESC'
	})
	.done(function(data) {
		console.log(data);
		$.each(data.features, function (i, feature) {
			console.log(i,feature);
			domSelect.append(
				$("<option></option>").val(feature.properties.domestic).html(feature.properties.domestic))
			// body...
		});
		console.log(data);
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});


    $('#startDate').datepicker({
    	showAnim: 'slideDown',
    	changeMonth: true,
    	numberOfMonths: 1,
    	dateFormat: 'yy-mm-dd',
    	changeYear: true,
    	onClose: function( selectedDate ) {
    		$( "#endDate" ).datepicker( "option", "minDate", selectedDate );
		}
	});

    $('#endDate').datepicker({
    	defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		dateFormat: 'yy-mm-dd',
		changeYear: true,
		onClose: function( selectedDate ) {
    		$( "#startDate" ).datepicker( "option", "maxDate", selectedDate );
	  	}
	});

	});




// var layer;
// // Initial Setup  with layer Verified No
// layer = L.geoJson(null, {
// 	pointToLayer: function (feature, latlng) {
// 		// body...
// 		return L.circleMarker(latlng, {
// 			color: "black",
// 			fillcolor: "red",
// 			fillOpacity: 1,
// 			radius: 8
// 		})
// 	},
// 	onEachFeature: function (feature, layering) {
// 		// body...
// 		layering.bindPopup("<b>"+feature.properties.primary_type +"</b>");
// 	},
// 	filter: function (feature, layering) {
// 		// body...
// 		return (feature.properties.primary_type == $("#crimeType").val())
// 	}

// })




function filterData() {
	var offence= $("#crimeType").val();
	var arrest= $("#arrest").val();
	var domestic= $("#domestic").val();
	var startDate= $("#startDate").val();
	var endDate= $("#endDate").val();
	console.log(offence, arrest, domestic, startDate,endDate);


	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?',
		method: "GET",
		dataType: "json",
        data: {
        	"$select" : "ward, primary_type"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "ward, primary_type",
        	"$where" : "primary_type ='" + offence + "'",
        	"arrest" : arrest,
        	"domestic" : domestic
        	+ " AND date >'" + startDate + "'"
        	+ " AND date <'" + endDate + "'",
        	"$order" : "ward"
        	
			
        	
        	


          // "$where": "date >'" + startDate + "'"
          // + " AND date <'" + endDate + "'",
          // "primary_type" : offence,
          // "arrest" : arrest,
          // "domestic" : domestic,
          // "$limit" : 200
          // "$group": offence
      	},
	})
	.done(function(data) {
		// $.each(data.features, function (i, feature) {
		// 	console.log(i,feature);
		// 	domSelect.append(
		// 		$("<option></option>").val(feature.properties.domestic).html(feature.properties.domestic))
		// 	// body...
		// });
		// add the JSON layer onto the map - it will appear using the default icons 
			/* Act on the event */
			layer = L.geoJson(data, {
				pointToLayer: function (feature, latlng) {
					// body...
					return L.circleMarker(latlng, {
						color: "blue",
						fillcolor: "red",
						fillOpacity: 1,
						radius: 5
					})
				},
				onEachFeature: function (feature, layering) {
					// body...
					layering.bindPopup("<b>"+feature.properties.primary_type +"</b>");
				},
				filter: function (feature, layering) {
					// body...
					if (feature.properties.primary_type == $("#crimeType").val()){
						return (feature.properties.primary_type == $("#crimeType").val())
					}
					else{
						return (feature.properties.primary_type)
					}
					
				},

			}).addTo(map); 
			// map.fitBounds(layer.getBounds());
		console.log(data);
		console.log("success");
	})

}


