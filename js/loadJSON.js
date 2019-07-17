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
    	defaultDate: new Date(2010, 01, 01),
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
		defaultDate: new Date(),
		onClose: function( selectedDate ) {
    		$( "#startDate" ).datepicker( "option", "maxDate", selectedDate );
	  	},
	});

    var baseLayers = {
					"OSM": osm,
					"Mapbox": mapbox
				};

	L.control.layers(baseLayers).addTo(map);
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

	// var ajaxData = {
 //        	"$select" : "ward, primary_type"
 //        	+ ", "
 //        	+ 'count(primary_type) as offence',
 //        	"$group" : "ward, primary_type",
 //        	"$where" : "primary_type ='" + offence + "'",
 //        	"arrest" : arrest,
 //        	"domestic" : domestic
 //        	+ " AND date >'" + startDate + "'"
 //        	+ " AND date <'" + endDate + "'",
 //        	"$order" : "ward"
 //      	};
 //      	if($("#crimeType").val() == "All")
 //      		ajaxData.;


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
        	
      	},
	}).done(function(crime) {

			$.ajax({
				url: 'https://data.cityofchicago.org/resource/k9yb-bpqx.geojson',
				type: 'GET',
				dataType: 'json',
				data:{
				},
			}).done(function(boundaries) {
				//Width and height
				var w = 500;
				var h = 300;

				//Define map projection
				var projection = d3.geo.albersUsa()
									   .translate([w/2, h/2])
									   .scale([500]);

				//Define path generator
				var path = d3.geo.path()
								 .projection(projection);
								 
				//Define quantize scale to sort data values into buckets of color
				var color = d3.scale.quantize()
									.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
									//Colors taken from colorbrewer.js, included in the D3 download

				//Create SVG element
				var svg = d3.select("#graph3")
							.append("svg")
							.attr("width", "100%")
							.attr("height", "100%");

					color.domain([
						d3.min(crime.features, function(d) { return d.properties.offence; }),
						d3.max(crime.features, function(d) { return d.properties.offence; })
					]);

					var myCrime = crime.features;
					var myBoundary = boundaries.features;
					
					for(var i =0; i < myCrime.length; i++){
						var dataState = myCrime[i].properties.ward;
						var dataValue = myCrime[i].properties.offence;
						// console.log(dataState);

						for(var j =0; j < myBoundary.length; j++){
							var jsonState = myBoundary[j].properties.ward;
							if(dataState == jsonState){
								myBoundary[j].properties.value = dataValue;
								// console.log(jsonState);
								break;
							}
						}
					}

				svg.selectAll("path")	
					.data(myBoundary)
					.enter()
					.append("path")
					.attr("d", path)
					.style("fill", function(d) {
						console.log(d);
					//Get data value
						var value = d.properties.value;
						
						if (value) {
							//If value exists…
							return color(value);
						} else {
							//If value is undefined…
							return "#ccc";
						}
					});

				// var baseLayers = {
				// 	"OSM": osm,
				// 	"Mapbox": mapbox
				// };
				var overlays = {};

				var line = new L.polygon(svg).addTo(map);
				console.log(line);

				

			});
			
	// 	$.each(crime.features, function (i, feature) {
	// 		console.log(i,feature);
	// 		// domSelect.append(
	// 		// 	$("<option></option>").val(feature.properties.domestic).html(feature.properties.domestic))
	// 		// body...
	// 	});
	// 	// add the JSON layer onto the map - it will appear using the default icons 
	// 		/* Act on the event */
	// 		layer = L.geoJson(crime, {
	// 			pointToLayer: function (feature, latlng) {
	// 				// body...
	// 				return L.circleMarker(latlng, {
	// 					color: "blue",
	// 					fillcolor: "red",
	// 					fillOpacity: 1,
	// 					radius: 5
	// 				})
	// 			},
	// 			onEachFeature: function (feature, layering) {
	// 				// body...
	// 				layering.bindPopup("<b>"+feature.properties.primary_type +"</b>");
	// 			},
	// 			filter: function (feature, layering) {
	// 				// body...
	// 				if (feature.properties.primary_type == $("#crimeType").val()){
	// 					return (feature.properties.primary_type == $("#crimeType").val())
	// 				}
	// 				else{
	// 					return (feature.properties.primary_type)
	// 				}
					
	// 			},

	// 		}).addTo(map); 
	// 		map.fitBounds(layer.getBounds());
	});

};


