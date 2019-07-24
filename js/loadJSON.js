$(document).ready(

	function() {
	var offSelect = $("#crimeType")
	
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson?$select=distinct primary_type&$order=primary_type ASC'
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
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson?$select=distinct arrest&$order=arrest DESC'
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
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson?$select=distinct domestic&$order=domestic DESC'
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

var app_token = "GhcK7Cj79Lg5uRtd5hPdldrnY";
function filterData() {
	var offence= $("#crimeType").val();
	var arrest= $("#arrest").val();
	var domestic= $("#domestic").val();
	var startDate= $("#startDate").val();
	var endDate= $("#endDate").val();
	console.log(offence, arrest, domestic, startDate,endDate);

// -------------------------- QUERY FOR CHOROPLETH LAYER IN SVG ---------------------

	var formData = new FormData();

    var formData =  {
        	"$select" : "ward"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "ward",
        	"$where" : "date >='" + startDate + "'"
        	+ " AND date <='" + endDate + "'"
        	+ " AND latitude IS NOT NULL", 
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
        	"$order" : "ward",
        	"$limit" : 200000,
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
	}).done(function(crime) {
			// console.log(crime);
			$.ajax({
				url: 'https://data.cityofchicago.org/resource/k9yb-bpqx.geojson',
				type: 'GET',
				dataType: 'json',
				data:{
				},
			}).done(function(boundaries) {

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
				var svg = d3.select(map.getPanes().overlayPane).append("svg");
      				var g = svg.append("g").attr("class", "leaflet-zoom-hide");

      				// https://stackoverflow.com/questions/16348717/how-to-get-maximum-value-from-an-array-of-objects-to-use-in-d3-scale-linear-do
					color.domain([
						d3.min(crime.features, function(d) { return +d.properties.offence; }),
						d3.max(crime.features, function(d) { return +d.properties.offence; })
					]);


					var myCrime = crime.features;
					var myBoundary = boundaries.features;

					for(var i =0; i < myCrime.length; i++){
						var dataState = myCrime[i].properties.ward;
						var dataValue = myCrime[i].properties.offence;

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
					console.log(myBoundary);

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
					feature.attr("class", "svg1")
					feature.style("stroke", "black")
					feature.style("opacity", 0.6)
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


				// ---------- Plot Histogram for Crime count per Ward ---------------

				var x = [];

				for(var i =0; i < myCrime.length; i++){
					x.push(myCrime[i].properties.offence);
			
				}
				
				var barChart = [{
						x:x,
						type: "histogram",
						histfunc: "count",
						}];

				var layout = {
					title: "Crime Histogram",
					yaxis: {
						title: "Count"
					},
					bargap: 0.05,
					xbins: {
						size:20000
					}
				};

				

				Plotly.newPlot('graph4', barChart,layout,{showSendToCloud: true});

				});

	});

	// ------------------- QUERY TO PLOT CRIME COUNT PER TYPE ---------------------


	var formDataGraph = new FormData();

    var formDataGraph =  {
        	"$select" : "primary_type"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "primary_type",
        	"$where" : "date >='" + startDate + "'"
        	+ " AND date <='" + endDate + "'"
        	+ " AND latitude IS NOT NULL",
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
        	"$order" : "offence DESC",
        	"$limit" : 200000,
        	"$$app_token": app_token};

        if (offence == "All") {
		  //  block of code to be executed if condition1 is true
		  delete formDataGraph.primary_type;
		}if (arrest == "All"){
			delete formDataGraph.arrest;
		}if (domestic == "All"){
			delete formDataGraph.domestic;
		}else{

		};

	$.ajax({
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
		method: "GET",
		dataType: "json",
        data: formDataGraph,
	}).done(function( graphData) {
		// console.log(graphData);
		var data = graphData.features;

		var x = [];
		var y = [];


		for(var i =0; i < data.length; i++){
			y.push(data[i].properties.primary_type);
			x.push(+data[i].properties.offence);
	
		}
		
		var barChart = [{
				x:x,
				y:y,
				type: "bar",
				orientation: "h",
				transforms: [{
			    type: 'sort',
			    target: 'y',
			    order: 'descending'
			 	}]
				}];

		var layout = {
			title: "Crime by Type",
			xaxis: {
				title: "Crime Count"
			},
			margins: {
			l:"220px"	
			}

		};

		

		Plotly.newPlot('graph1', barChart,layout);

		
	})
	.fail(function() {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});
	
	// ---------- Plot To Time-Series ---------------

	var formDataLineGraph = new FormData();

    var formDataLineGraph =  {
        	"$select" : "date"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "date",
        	"$where" : "date >'" + startDate + "'"
        	+ " AND date <'" + endDate + "'"
        	+ " AND latitude IS NOT NULL",
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
        	"$order" : "date ASC",
        	"$limit" : 200000,
        	"$$app_token" : app_token};

        if (offence == "All") {
		  //  block of code to be executed if condition1 is true
		  delete formDataLineGraph.primary_type;
		}if (arrest == "All"){
			delete formDataLineGraph.arrest;
		}if (domestic == "All"){
			delete formDataLineGraph.domestic;
		}else{

		};

	$.ajax({
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
		method: "GET",
		dataType: "json",
        data: formDataLineGraph,
	}).done(function(lineGraphData) {
		// console.log(lineGraphData);
		var data = lineGraphData.features;

		var x = [];
		var y = [];

		var selectorOptions = {
		    buttons: [{
		        step: 'month',
		        stepmode: 'backward',
		        count: 1,
		        label: '1m'
		    }, {
		        step: 'month',
		        stepmode: 'backward',
		        count: 6,
		        label: '6m'
		    }, {
		        step: 'year',
		        stepmode: 'todate',
		        count: 1,
		        label: 'YTD'
		    }, {
		        step: 'year',
		        stepmode: 'backward',
		        count: 1,
		        label: '1y'
		    }, {
		        step: 'all',
		    }],
		};
		

		var layout = {
			title: "Crime Time-Series",
			// autosize: false,
			xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {}
        	},
        	yaxis: {
        		fixedrange: true,
        		title: "Crime Count"
        	}
		};

		for(var i =0; i < data.length; i++){
			y.push(data[i].properties.offence);
			x.push(new Date(data[i].properties.date));
	
		};
		
		var barChart = [{
				mode: "lines",
				x:x,
				y:y
				}];

		Plotly.newPlot('graph2', barChart,layout);

	})
	.fail(function() {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});
	


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
		// console.log(heatmap);
		
		var locations = heatmap.features.map(function(points){

			var location = points.geometry.coordinates.reverse();
			location.push(0.5);
			return location;
			console.log(location);
		});

		var heat = new L.heatLayer(locations, {radius: 10}).addTo(map);

	})
	.fail(function() {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});


















};