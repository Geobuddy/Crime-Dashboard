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
				url: 'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.geojson',
				type: 'GET',
				dataType: 'json',
				data:{
				},
			}).done(function(boundaries) {

				var myCrime = crime.features;
				var myBoundary = boundaries.features;

				for(var i =0; i < myCrime.length; i++){
					var dataState = myCrime[i].properties.community_area;
					var dataValue = myCrime[i].properties.offence;

					for(var j =0; j < myBoundary.length; j++){
						var jsonState = myBoundary[j].properties.area_numbe;
						if(dataState == jsonState){
							myBoundary[j].properties.value = dataValue;
							break;
						}
					}
				}

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
						'<b>'+ 'Community area: ' + props.area_numbe + '</b><br />' + props.value + ' Offence (s)'
						: 'Hover over a state');
				};

				info.addTo(map);


				// get color depending on population density value
				function getColor(d) {
					return d > 1000 ? '#800026' :
							d > 500  ? '#BD0026' :
							d > 200  ? '#E31A1C' :
							d > 100  ? '#FC4E2A' :
							d > 50   ? '#FD8D3C' :
							d > 20   ? '#FEB24C' :
							d > 10   ? '#FED976' :
										'#FFEDA0';
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

				var geojson;

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

				geojson = L.geoJson(myBoundary, {
					style: style,
					onEachFeature: onEachFeature
				}).addTo(map);

				var legend = L.control({position: 'bottomright'});

				legend.onAdd = function (map) {

					var div = L.DomUtil.create('div', 'info legend'),
						grades = [0, 10, 20, 50, 100, 200, 500, 1000],
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



				// ---------- Plot Histogram for Crime count per Community ---------------

				var x = [];
				var xHist = [];
				var yHist = []

				for(var i =0; i < myCrime.length; i++){
					x.push(myCrime[i].properties.offence);
					xHist.push(+myCrime[i].properties.community_area);
					yHist.push(myCrime[i].properties.offence);
				}
				
				var histogram = [{
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

				

				Plotly.newPlot('graph4', histogram,layout,{showSendToCloud: true});

				// ---------- Plot Crime count per Community Area ---------------
				
				// xHist = xHist.map(String);
				console.log(xHist);

				var barChart = [{
						x:xHist,
						y:yHist,
						type: "bar",
						transforms: [{
					    type: 'sort',
					    target: 'y',
					    order: 'descending'
					 	}]
						}];

				var layout = {
					title: "Crime Count per Community Area",
					yaxis: {
						title: "Crime Count"
					},
					xaxis: {
						title: "Community Area",
						type:'category'
					},
					margins: {
					l:"220px"	
					}

				};

				

				Plotly.newPlot('graph3', barChart,layout);

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
				mode: "category",
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