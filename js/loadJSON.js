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


function filterData() {
	var offence= $("#crimeType").val();
	var arrest= $("#arrest").val();
	var domestic= $("#domestic").val();
	var startDate= $("#startDate").val();
	var endDate= $("#endDate").val();
	console.log(offence, arrest, domestic, startDate,endDate);

	var formData = new FormData();

    var formData =  {
        	"$select" : "ward"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "ward",
        	"$where" : "date >'" + startDate + "'"
        	+ " AND date <'" + endDate + "'",
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
        	"$order" : "ward"};

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
				var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      				g = svg.append("g").attr("class", "leaflet-zoom-hide");

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
			

	});


	var formDataGraph = new FormData();

    var formDataGraph =  {
        	"$select" : "primary_type"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "primary_type",
        	"$where" : "date >'" + startDate + "'"
        	+ " AND date <'" + endDate + "'",
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
        	"$order" : "offence DESC"};

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
	}).done(function(graphData) {
		// console.log(graphData);

		var data = graphData.features;

		var margin = {top: 30, right: 0, bottom: 10, left:230};
		height = parseInt(d3.select("#graph1").style("height")) - margin.top - margin.bottom,
		width = parseInt(d3.select("#graph1").style("width")) - margin.left - margin.right;


		x = d3.scaleLinear()
		    .domain([0, d3.max(data, d => +d.properties.offence)])
		    .range([margin.left, width - margin.right]);

		y = d3.scaleBand()
		    .domain(data.map(d => d.properties.primary_type))
		    .range([margin.top, height - margin.bottom])
		    .padding(0.1);

		xAxis = g => g
		    .attr("transform", `translate(0,${margin.top})`)
		    .call(d3.axisTop(x).ticks(width / 80))
		    .call(g => g.select(".domain").remove());

		yAxis = g => g
		    .attr("transform", `translate(${margin.left},0)`)
		    .call(d3.axisLeft(y).tickSizeOuter(0));

		format = x.tickFormat(20);

		d3.select("#graph1").selectAll("svg").remove(); 

		var barsvg = d3.select("#graph1").append("svg")
						.attr("width", "100%")
						.attr("height", "100%");

		barsvg.append("g")
		  .attr("fill", "steelblue")
		.selectAll("rect")
		.data(data)
		.join("rect")
		  .attr("x", x(0))
		  .attr("y", d => y(d.properties.primary_type))
		  .attr("width", d => x(+d.properties.offence) - x(0))
		  .attr("height", y.bandwidth());

		barsvg.append("g")
		  .attr("fill", "white")
		  .attr("text-anchor", "end")
		  .style("font", "12px sans-serif")
		.selectAll("text")
		.data(data)
		.join("text")
		  .attr("x", d => x(+d.properties.offence) - 4)
		  .attr("y", d => y(d.properties.primary_type) + y.bandwidth() / 2)
		  .attr("dy", "0.35em")
		  .text(d => format(+d.properties.offence));

		barsvg.append("g")
		  .call(xAxis);

		barsvg.append("g")
		  .call(yAxis);

		return barsvg.node();

	})
	.fail(function() {
		// console.log("error");
	})
	.always(function() {
		// console.log("complete");
	});
	


	var formDataLineGraph = new FormData();

    var formDataLineGraph =  {
        	"$select" : "date"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "date",
        	"$where" : "date >'" + startDate + "'"
        	+ " AND date <'" + endDate + "'",
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
        	"$order" : "date ASC"};

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
		console.log(lineGraphData);

		// var trace = {
		// 	x:
		// 	y:
		// 	type: 'scatter'
		// }

		// var data = [trace]

		//set the dimensions and margins of the graph
// 		var margin = {top: 10, right: 30, bottom: 30, left: 60},
// 	    width = 460 - margin.left - margin.right,
// 	    height = 400 - margin.top - margin.bottom;

// 		// append the svg object to the body of the page
// 		var svg = d3.select("#lineGraph")
// 		  .append("svg")
// 		    .attr("width", width + margin.left + margin.right)
// 		    .attr("height", height + margin.top + margin.bottom)
// 		  .append("g")
// 		    .attr("transform",
// 		          "translate(" + margin.left + "," + margin.top + ")");

// 		//Read the data
// 		var data = lineGraphData.features;

// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",

//   // When reading the csv, I must format variables:
//   function(d){
//     return { date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value }
//   },

//   // Now I can use this dataset:
//   function(data) {

//     // Add X axis --> it is a date format
//     var x = d3.scaleTime()
//       .domain(d3.extent(data, function(d) { return d.date; }))
//       .range([ 0, width ]);
//     xAxis = svg.append("g")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//     // Add Y axis
//     var y = d3.scaleLinear()
//       .domain([0, d3.max(data, function(d) { return +d.value; })])
//       .range([ height, 0 ]);
//     yAxis = svg.append("g")
//       .call(d3.axisLeft(y));

//     // Add a clipPath: everything out of this area won't be drawn.
//     var clip = svg.append("defs").append("svg:clipPath")
//         .attr("id", "clip")
//         .append("svg:rect")
//         .attr("width", width )
//         .attr("height", height )
//         .attr("x", 0)
//         .attr("y", 0);

//     // Add brushing
//     var brush = d3.brushX()                   // Add the brush feature using the d3.brush function
//         .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
//         .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

//     // Create the line variable: where both the line and the brush take place
//     var line = svg.append('g')
//       .attr("clip-path", "url(#clip)")

//     // Add the line
//     line.append("path")
//       .datum(data)
//       .attr("class", "line")  // I add the class line to be able to modify this line later on.
//       .attr("fill", "none")
//       .attr("stroke", "steelblue")
//       .attr("stroke-width", 1.5)
//       .attr("d", d3.line()
//         .x(function(d) { return x(d.date) })
//         .y(function(d) { return y(d.value) })
//         )

//     // Add the brushing
//     line
//       .append("g")
//         .attr("class", "brush")
//         .call(brush);

//     // A function that set idleTimeOut to null
//     var idleTimeout
//     function idled() { idleTimeout = null; }

//     // A function that update the chart for given boundaries
//     function updateChart() {

//       // What are the selected boundaries?
//       extent = d3.event.selection

//       // If no selection, back to initial coordinate. Otherwise, update X axis domain
//       if(!extent){
//         if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
//         x.domain([ 4,8])
//       }else{
//         x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
//         line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
//       }

//       // Update axis and line position
//       xAxis.transition().duration(1000).call(d3.axisBottom(x))
//       line
//           .select('.line')
//           .transition()
//           .duration(1000)
//           .attr("d", d3.line()
//             .x(function(d) { return x(d.date) })
//             .y(function(d) { return y(d.value) })
//           )
//     }

//     // If user double click, reinitialize the chart
//     svg.on("dblclick",function(){
//       x.domain(d3.extent(data, function(d) { return d.date; }))
//       xAxis.transition().call(d3.axisBottom(x))
//       line
//         .select('.line')
//         .transition()
//         .attr("d", d3.line()
//           .x(function(d) { return x(d.date) })
//           .y(function(d) { return y(d.value) })
//       )
//     });

// })
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	























};