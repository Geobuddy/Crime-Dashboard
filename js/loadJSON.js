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

		// console.log(data);
		// console.log("success");
	})
	.fail(function() {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});


	var arrSelect = $("#arrest")
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$select=distinct arrest&$order=arrest DESC'
	})
	.done(function(data) {
		// console.log(data);
		$.each(data.features, function (i, feature) {
			// console.log(i,feature);
			arrSelect.append(
				$("<option></option>").val(feature.properties.arrest).html(feature.properties.arrest.toString().toUpperCase()))
		});
		// console.log(data);
		// console.log("success");
	})
	.fail(function() {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});

	var domSelect = $("#domestic")
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$select=distinct domestic&$order=domestic DESC'
	})
	.done(function(data) {
		// console.log(data);
		$.each(data.features, function (i, feature) {
			// console.log(feature);
			domSelect.append(
				$("<option></option>").val(feature.properties.domestic).html(feature.properties.domestic.toString().toUpperCase()))
			// body...
		});
		// console.log(data);
		// console.log("success");
	})
	.fail(function() {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
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


 	// var reqDataOne={
  //       	"$select" : "ward, primary_type"
  //       	+ ", "
  //       	+ 'count(primary_type) as offence',
  //       	"$group" : "ward, primary_type",
  //       	"$where" : "primary_type ='" + offence + "'",
  //       	"arrest" : arrest,
  //       	"domestic" : domestic
  //       	+ " AND date >'" + startDate + "'"
  //       	+ " AND date <'" + endDate + "'",
  //       	"$order" : "ward"
        	
  //     	}


  //   var reqDataTwo={
  //       	"$select" : "ward, primary_type"
  //       	+ ", "
  //       	+ 'count(primary_type) as offence',
  //       	"$group" : "ward, primary_type",
  //       	"$where" : "primary_type ='" + offence + "'",
  //       	"arrest" : arrest,
  //       	"domestic" : domestic
  //       	+ " AND date >'" + startDate + "'"
  //       	+ " AND date <'" + endDate + "'",
  //       	"$order" : "ward"
        	
  //     	}

      	// function () {
      	// 	// body...
      	// 	var data = {
      	// 		"$select" : "ward, primary_type"
       //  		+ ", "
       //  		+ 'count(primary_type) as offence',
       //  		"$group" : "ward, primary_type",
       //  		"$where" : "date >'" + startDate + "'"
       //  		+ " AND date <'" + endDate + "'",
       //  		"arrest" : arrest,
       //  		"domestic" : domestic,
       //  		"primary_type" : offence,
       //  		"$order" : "ward",
      	// 	}
      	// }



	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?',
		method: "GET",
		dataType: "json",
        data: {
        	"$select" : "ward, primary_type"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "ward, primary_type",
        	"$where" : "date >'" + startDate + "'"
        	+ " AND date <'" + endDate + "'",
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
        	"$order" : "ward"
      	},
	}).done(function(crime) {
			console.log(crime);
			$.ajax({
				url: 'https://data.cityofchicago.org/resource/k9yb-bpqx.geojson',
				type: 'GET',
				dataType: 'json',
				data:{
				},
			}).done(function(boundaries) {
				//Width and height
				// var w = 500;
				// var h = 300;

				//Define map projection/Define path generator
				var transform = d3.geoTransform({point: projectPoint}),
				path = d3.geoPath().projection(transform);

								 
				//Define quantize scale to sort data values into buckets of color
				var color = d3.scaleQuantile()
									.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);
									//Colors taken from colorbrewer.js, included in the D3 download

				// Redraw updated SVG layer - https://stackoverflow.com/questions/34088550/d3-how-to-refresh-a-chart-with-new-data/34184333
				d3.select("svg").remove(); 

				//Create SVG element
				var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      				g = svg.append("g").attr("class", "leaflet-zoom-hide");

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

				var feature = g.selectAll("path")	
					.data(myBoundary)
					.enter()
					.append("path");

				map.on("zoom", reset);
				reset ();

				function reset() {
					// body...
					bounds = path.bounds(boundaries);
					var topLeft = bounds[0],
						bottomRight = bounds[1];
					svg .attr("width", bottomRight[0] - topLeft[0])
						.attr("height", bottomRight[1] - topLeft[1])
						.style("left", topLeft[0] + "px")
						.style("top", topLeft[1] + "px");
					g .attr("transform", "translate(" + -topLeft[0] + "," 
					                                  + -topLeft[1] + ")");

					feature.attr("d", path)
					feature.style("stroke", "black")
					feature.style("opacity", 0.7)
					feature.style("fill", function(d) {
						// console.log(d);
					//Get data value
						var value = d.properties.value;
						
						if (value) {
							//If value exists…
							return color(value);
						} else {
							//If value is undefined…
							return "#c8c8c8";
						}
					});
				}

				function projectPoint(x, y) {
					// body...
					var point = map.latLngToLayerPoint(new L.LatLng(y, x));
					this.stream.point(point.x, point.y);
				}




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