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
        	"$limit" : 100000,
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
	}).done(function( data) {
		graph1(data);
		});

function graph1(graphData){

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
			title: "Crime Count",
		},
		yaxis: {
			tickfont: {
		    size: 8,
		    },
		},
		margin: {
		    l: 170
		}
	};

	

	Plotly.newPlot('graph1', barChart,layout, {responsive: true});

}

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
        	"$limit" : 100000,
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
	}).done(function(data) {
		graph3(data);
		});

function graph3(lineGraphData) {
	var data = lineGraphData.features;

	var x = [];
	var y = [];

	var selectorOptions = {
	    buttons: [{
	        step: 'month',
	        stepmode: 'backward',
	        count: 3,
	        label: '3m'
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
	

	for(var i =0; i < data.length; i++){
		y.push(data[i].properties.offence);
		x.push(new Date(data[i].properties.date));

	};

	
	var total = 0;
	for(var i = 0; i < data.length; i++) {
	    total += +data[i].properties.offence;
	}
	var yMean = total / data.length;

	var x0 = x[0];
	var x1 = x[x.length - 1];

	var barChart = {
			name: "Time-Series",
			mode: "lines",
			type: "scatter",
			showlegend: true,
			x:x,
			y:y
			};

	var trace = {
	    	name: "Mean",
	    	showlegend: true,
			x: [x0,x1],
			y:[yMean,yMean],
			type: "scatter",
			mode: "lines",
			line: {
	        color: 'rgb(255,0,0)',
	        width: 4,
	        dash: "dash"
	      }
		};

	var layout = {
		title: "Crime Time-Series",
		xaxis: {
        rangeselector: selectorOptions,
        rangeslider: {}
    	},
    	yaxis: {
    		fixedrange: true,
    		title: "Crime Count"
    	},
	};
	
	var plot = [barChart, trace]
	Plotly.newPlot('graph2', plot,layout, {responsive: true})

	var boxplot = {
	  x: y,
	  boxpoints: 'all',
	  jitter: 0.3,
	  pointpos: 1.8,
	  name: "" + offence + "",
	  type: 'box',
	};

	var data = [boxplot];

	var layout = {
	  yaxis:{
	  	tickfont: {
		    size: 8,
		    },
	  },
	  margin: {
		    l: 170
		}

	};

	Plotly.newPlot('graph5', data, layout, {responsive: true});

}

});

function graph2(data) {
	//data from choropleth AJAX
	// ---------- Plot Histogram for Crime count per Community ---------------
	
	var myCrime = data.features;
	var myBoundary = data.features;

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
		xaxis:{
			title: "Bins"
		},
		bargap: 0.05,
		xbins: {
			size:20000,
		}
	};	

	Plotly.newPlot('graph4', histogram,layout,{showSendToCloud: true, responsive: true});


	// ---------- Plot Crime count per Community Area ---------------
	
	// xHist = xHist.map(String);

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
		}
	};
	Plotly.newPlot('graph3', barChart,layout, {responsive: true});
}


// Resize plot when the widown size is changed
$( '.row' ).resize(function() {
  Plotly.relayout('.graph', {
	    width: 0.45 * $( '.row' ).innerWidth,
	    height: 0.45 * $( '.row' ).innerHeight
	  });
});