$('.form-control').change(function() {
	/* Act on the event */
	var offence= $("#crimeType").val();
	var arrest= $("#arrest").val();
	var domestic= $("#domestic").val();
	var startDate= $("#startDate").val();
	var endDate= $("#endDate").val();
	console.log(offence, arrest, domestic, startDate,endDate);

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
        	"$select" : "date_trunc_ym(date) as date"
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
		console.log(lineGraphData);
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
});