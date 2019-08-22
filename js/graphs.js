function foo(arr) {
    var a = [], b = [], prev;
    
    arr.sort();
    for ( var i = 0; i < arr.length; i++ ) {
        if ( arr[i] !== prev ) {
            a.push(arr[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = arr[i];
    }  
    return [a, b];
}


function graph1(data){

	var data = data.features;
	var arr = [];

	for(var i =0; i < data.length; i++){
		arr.push(data[i].properties.primary_type);
	}
	var result = foo(arr);
	// console.log(result);
	var barChart = [{
			x:result[1],
			y:result[0],
			type: "bar",
			orientation: "h",
			transforms: [{
		    type: 'sort',
		    target: 'x',
		    order: 'ascending'
		 	}],
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

$('.form-control').change(function() {
	/* Act on the event */

	var offence= $("#crimeType").val();
	var arrest= $("#arrest").val();
	var domestic= $("#domestic").val();
	var startDate= $("#startDate").val();
	var endDate= $("#endDate").val();
	// ---------- Plot To Time-Series ---------------

	var formDataLineGraph = new FormData();

    var formDataLineGraph =  {
        	"$select" : "date_trunc_ym(date) as date"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "date",
        	"$where" : "date >='" + startDate + "'"
        	+ " AND date <='" + endDate + "'"
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
	}).done(function(data) {
		graph2(data);
		});

function graph2(data) {
	// console.log(data);
	var data = data.features;

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
		title: 'Crime Time-Series from '+ $("#startDate").val() + ' to '+ $("#endDate").val() + '',
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

}	
	var formDataBarGraph = new FormData();

    var formDataBarGraph =  {
        	"$select" : "date_extract_m(date) as month"
        	+ ", "
        	+ 'count(primary_type) as offence',
        	"$group" : "month",
        	"$where" : "date >='" + startDate + "'"
        	+ " AND date <='" + endDate + "'"
        	+ " AND latitude IS NOT NULL",
        	"arrest" : arrest,
        	"domestic" : domestic,
			"primary_type" : offence,
        	"$order" : "month ASC",
        	"$limit" : 200000,
        	"$$app_token" : app_token};

        if (offence == "All") {
		  //  block of code to be executed if condition1 is true
		  delete formDataBarGraph.primary_type;
		}if (arrest == "All"){
			delete formDataBarGraph.arrest;
		}if (domestic == "All"){
			delete formDataBarGraph.domestic;
		}else{
		};

	$.ajax({
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
		method: "GET",
		dataType: "json",
        data: formDataBarGraph,
	}).done(function(data) {
		graph3(data);
		});
});

function graph3(data) {

	var offence= $("#crimeType").val();

	var data = data.features;
	var yHist = [];

	var Year1 = new Date($("#startDate").val()).getFullYear();
	var Year2 = new Date($("#endDate").val()).getFullYear();
	var numYear = Year2 - Year1

	for(var i =0; i < data.length; i++){
		yHist.push(data[i].properties.offence/numYear);
	};

	var month = new Array(12);
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";


	var trace1 = 
		  {
		x: month,
		y: yHist,
	    type: "bar",
	    bins: {
		    end: 2.8, 
		    size: 0.06, 
		    start: .5
		  },
	    marker: {
           line: {
            color:  "black", 
            width: 1
    	},
    	} 
		};

	var data = [trace1];

	var layout = {
	  title: 'Average Monthly '+ offence +' Crime from '+ $("#startDate").val() + ' to '+ $("#endDate").val() + '',
	  yaxis: {
    		fixedrange: true,
    		title: "Count"
    	}
	};

Plotly.newPlot('graph3', data, layout,{responsive: true});
}

function graph4(data) {
	//data from Heatmap AJAX request

	// ---------- Plot Pie chart for Arrest and Domestic count ---------------
	
	var myData = data.features;

	var xPie1 = [];
	var xPie2 = [];

	for(var i =0; i < myData.length; i++){
		xPie1.push(myData[i].properties.arrest);
		xPie2.push(myData[i].properties.domestic);
	}

	var result = foo(xPie1);
	var result1 = foo(xPie2);

	var pie1 = {
			  values: result[1],
			  labels: result[0],
			  type: 'pie',
			  name: '' + $("#crimeType").val() + '',
			  marker: {
			    colors: ['red','blue']
			  },
			  domain: {
			    row: 0,
			    column: 0
			  },
			  hole: .7,
			  title: {
			    text:'Arrest',
			    font: {
			      size: 24
			    },
			  },
			}

	var pie2 = {
		values: result1[1],
		  labels: result1[0],
		  type: 'pie',
		  name: '' + $("#crimeType").val() + '',
		  marker: {
		    colors: ['red','blue']
		  },
		  title: {
		    text:'Domestic',
		    font: {
		      size: 24
		    },
		  },
		  hole: .7,
		  domain: {
		    row: 0,
		    column: 1
		  },
		};

	var data = [pie1,pie2];

	var layout = {
		title: '' + $("#crimeType").val() + ' Arrest & Domestic Count',
		  grid: {rows: 1, columns: 2}
		};

	Plotly.newPlot('graph4', data, layout, {responsive: true});

}