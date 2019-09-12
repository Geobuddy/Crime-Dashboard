var app_token = "GhcK7Cj79Lg5uRtd5hPdldrnY";
loadDropdowns();

function loadDropdowns() {

	var offSelect = $("#crimeType1, #crimeType2");
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson?$select=distinct primary_type&$order=primary_type ASC'
	})
	.done(function(data) {
		$.each(data.features, function (i, feature) {
			offSelect.append(
				$("<option></option>").val(feature.properties.primary_type).html(feature.properties.primary_type))
		});
	});

	var arrSelect = $("#arrest")
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson?$select=distinct arrest&$order=arrest DESC'
	})
	.done(function(data) {
		$.each(data.features, function (i, feature) {
			arrSelect.append(
				$("<option></option>").val(feature.properties.arrest).html(feature.properties.arrest.toString().toUpperCase()))
		});
	});

	var domSelect = $("#domestic")
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson?$select=distinct domestic&$order=domestic DESC'
	})
	.done(function(data) {
		$.each(data.features, function (i, feature) {
			domSelect.append(
				$("<option></option>").val(feature.properties.domestic).html(feature.properties.domestic.toString().toUpperCase()))
		});
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
}
function main() {
// Function to make AJAX request everytime class .form-control is altered
	$('.form-control').change(function() {

			var offence1= $("#crimeType1").val();
			var offence2= $("#crimeType2").val();
			var arrest= $("#arrest").val();
			var domestic= $("#domestic").val();
			var startDate= $("#startDate").val();
			var endDate= $("#endDate").val();

		// ---------- Set request parameters 1 ---------------
			var formParam1 = new FormData();

		    var formParam1 =  {
		        	"$where" : "date >='" + startDate + "'"
		        	+ " AND date <='" + endDate + "'"
		        	+ " AND latitude IS NOT NULL"
		        	+ " AND primary_type IN ('" + offence1 + "','" + offence2 + "')",
		        	"arrest" : arrest,
		        	"domestic" : domestic,
					"$limit": 500000,
		        	"$$app_token" : app_token};

		        if (arrest == "All"){
					delete formParam1.arrest;
				}if (domestic == "All"){
					delete formParam1.domestic;
				}else{

				};

			$.ajax({
				url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
				method: "GET",
				dataType: "json",
		        data: formParam1,
			}).done(function(data) {
				graph1(data);
				graph3(data);
			});


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
					 	text: result[1].map(String),
		  				textposition: 'auto',
		  				textfont: {
					        size: 12,
					        color: '#000'
					      },
		  				hoverinfo: 'none',
						}];

				var layout = {
					title: "Crime by Type",
					xaxis: {
						title: "Crime Count",
					},
					yaxis: {
						tickfont: {
					    size: 10,
					    },
					},
					margin: {
					    l: 170
					},
				};

				Plotly.newPlot('graph1', barChart,layout, {responsive: true});
			};

			// ------------ Plot Boxplot ---------------

			function graph3(data){
				var myData = data.features;

				var xPie1 = [];
				var xPie2 = [];
				var xPie3 = [];
				var xPie4 = [];

				for(var i =0; i < myData.length; i++){
					if(myData[i].properties.primary_type == $("#crimeType1").val()){
					xPie1.push(myData[i].properties.arrest);
					xPie2.push(myData[i].properties.domestic);
					}
					else{
						xPie3.push(myData[i].properties.arrest);
						xPie4.push(myData[i].properties.domestic);
					}
				}

				var result = foo(xPie1);
				var result1 = foo(xPie2);
				var result2 = foo(xPie3);
				var result3 = foo(xPie4);

				var arrestPercentage1 = (result[1][1]/(result[1][0]+result[1][1]))*100;
				if(isNaN(arrestPercentage1) == true){
					arrestPercentage1 = 0;
				};
				var pie1 = {
						  values: result[1],
						  labels: result[0],
						  type: 'pie',
						  name: '' + $("#crimeType1").val() + '',
						  marker: {
						    colors: ['red','blue']
						  },
						  textinfo: 'none',
						  title: {
						    text:''+ arrestPercentage1.toFixed(1) +'%<br> Arrest(s)',
						    font: {
						      size: 16
						    },
						  },
						  hole: .8,
						  domain: {
						    row: 0,
						    column: 0
						  },
						}

				var domesticPercentage1 = (result1[1][1]/(result1[1][0]+result1[1][1]))*100;
				if(isNaN(domesticPercentage1) == true){
					domesticPercentage1 = 0;
				};
				var pie2 = {
					values: result1[1],
					  labels: result1[0],
					  type: 'pie',
					  name: '' + $("#crimeType1").val() + '',
					  marker: {
					    colors: ['red','blue']
					  },
					  textinfo: 'none',
					  title: {
					    text:''+ domesticPercentage1.toFixed(1) +'%<br> Domestic(s)',
					    font: {
					      size: 16
					    },
					  },
					  hole: .8,
					  domain: {
					    row: 0,
					    column: 1
					  },
					};

				var arrestPercentage2 = (result2[1][1]/(result2[1][0]+result2[1][1]))*100;
				if(isNaN(arrestPercentage2) == true){
					arrestPercentage2 = 0;
				};
				var pie3 = {
						  values: result2[1],
						  labels: result2[0],
						  type: 'pie',
						  name: '' + $("#crimeType2").val() + '',
						  marker: {
						    colors: ['red','blue']
						  },
						  textinfo: 'none',
						  title: {
						    text:''+ arrestPercentage2.toFixed(1) +'%<br> Arrest(s)',
						    font: {
						      size: 16
						    },
						  },
						  hole: .8,
						  domain: {
						    row: 1,
						    column: 0
						  },
						}
				var domesticPercentage2 = (result3[1][1]/(result3[1][0]+result3[1][1]))*100;
				if(isNaN(domesticPercentage2) == true){
					domesticPercentage2 = 0;
				}
				var pie4 = {
					values: result3[1],
					  labels: result3[0],
					  type: 'pie',
					  name: '' + $("#crimeType2").val() + '',
					  marker: {
					    colors: ['red','blue']
					  },
					  textinfo: 'none',
					  title: {
						    text:''+ domesticPercentage2.toFixed(1) +'%<br> Domestic(s)',
						    font: {
						      size: 16
						    },
						  },
					  hole: .8,
					  domain: {
					    row: 1,
					    column: 1,
					  },
					};

				var data = [pie1,pie2,pie3,pie4];

				var layout = {
					title:{
						text: '' + $("#crimeType1").val() + ' & '+ $("#crimeType2").val() +' Arrest and Domestic Count',
						size: 16
					},
					grid: {rows: 2, columns: 2}
					};

			Plotly.newPlot('graph3', data,layout,{responsive: true});

			};

			// ---------- Plot To Time-Series ---------------

			var formDataLineGraph1 = new FormData();
		    var formDataLineGraph1 =  {
		        	"$select" : "date_trunc_ym(date) as date1"
		        	+ ", "
		        	+ 'count(primary_type) as offence1',
		        	"$group" : "date1",
		        	"$where" : "date >='" + startDate + "'"
		        	+ " AND date <='" + endDate + "'"
		        	+ " AND latitude IS NOT NULL",
		        	"arrest" : arrest,
		        	"domestic" : domestic,
					"primary_type" : offence1,
		        	"$order" : "date1 ASC",
		        	"$limit" : 200000,
		        	"$$app_token" : app_token};

		        if (arrest == "All"){
					delete formDataLineGraph1.arrest;
				}if (domestic == "All"){
					delete formDataLineGraph1.domestic;
				}else{

				};

			var formDataLineGraph2 = new FormData();
		    var formDataLineGraph2 =  {
		        	"$select" : "date_trunc_ym(date) as date2"
		        	+ ", "
		        	+ 'count(primary_type) as offence2',
		        	"$group" : "date2",
		        	"$where" : "date >='" + startDate + "'"
		        	+ " AND date <='" + endDate + "'"
		        	+ " AND latitude IS NOT NULL",
		        	"arrest" : arrest,
		        	"domestic" : domestic,
					"primary_type" : offence2,
		        	"$order" : "date2 ASC",
		        	"$limit" : 200000,
		        	"$$app_token" : app_token};

		        if (arrest == "All"){
					delete formDataLineGraph2.arrest;
				}if (domestic == "All"){
					delete formDataLineGraph2.domestic;
				}else{

				};


			$.ajax({
				url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
				method: "GET",
				dataType: "json",
			    data: formDataLineGraph1,
			}).done(function (data1) {
				var data1 = data1.features;
				$.ajax({
					url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
					method: "GET",
					dataType: "json",
				    data: formDataLineGraph2,
				}).done(function (data2) {
					var data2 = data2.features;

				var offence1= $("#crimeType1").val();
				var offence2= $("#crimeType2").val();
				var trace1 = data1;
				var trace2 = data2;


				var x1 = [];
				var y1 = [];
				var x2 = [];
				var y2 = [];

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


				for(var i =0; i < data1.length; i++){
					y1.push(data1[i].properties.offence1);
					x1.push(new Date(data1[i].properties.date1));
				};

				for(var i =0; i < data2.length; i++){
					y2.push(data2[i].properties.offence2);
					x2.push(new Date(data2[i].properties.date2));
					};

				var Trace1 = {
						name: ""+ offence1 +"",
						mode: "lines",
						type: "scatter",
						showlegend: true,
						x:x1,
						y:y1
						};

				var Trace2 = {
						name: ""+ offence2 +"",
						mode: "lines",
						type: "scatter",
						showlegend: true,
						x:x2,
						y:y2,
						line: {
						    color: 'red',
						  }
						};

				var layout = {
					title: "Time-Series",
					xaxis: {
			        rangeselector: selectorOptions,
			        rangeslider: {}
			    	},
			    	yaxis: {
			    		fixedrange: true,
			    		title: "Crime Count"
			    	},
			    	legend: {
					    x: 1,
					    y: 0.5,
					    font: {
					    	size:6
					    }
					}
				};

				var plot = [Trace1, Trace2]
				Plotly.newPlot('graph2', plot,layout, {responsive: true});

				});
			});

			// ------------- Plot Histogram -------------
			var formDataBarGraph1 = new FormData();
		    var formDataBarGraph1 =  {
		        	"$select" : "date_extract_m(date) as month1"
		        	+ ", "
		        	+ 'count(primary_type) as offence1',
		        	"$group" : "month1",
		        	"$where" : "date >='" + startDate + "'"
		        	+ " AND date <='" + endDate + "'"
		        	+ " AND latitude IS NOT NULL",
		        	"arrest" : arrest,
		        	"domestic" : domestic,
					"primary_type" : offence1,
		        	"$order" : "month1 ASC",
		        	"$limit" : 200000,
		        	"$$app_token" : app_token};

		        if (arrest == "All"){
					delete formDataBarGraph1.arrest;
				}if (domestic == "All"){
					delete formDataBarGraph1.domestic;
				}else{

				};

			var formDataBarGraph2 = new FormData();
		    var formDataBarGraph2 =  {
		        	"$select" : "date_extract_m(date) as month2"
		        	+ ", "
		        	+ 'count(primary_type) as offence2',
		        	"$group" : "month2",
		        	"$where" : "date >='" + startDate + "'"
		        	+ " AND date <='" + endDate + "'"
		        	+ " AND latitude IS NOT NULL",
		        	"arrest" : arrest,
		        	"domestic" : domestic,
					"primary_type" : offence2,
		        	"$order" : "month2 ASC",
		        	"$limit" : 200000,
		        	"$$app_token" : app_token};

		        if (arrest == "All"){
					delete formDataBarGraph2.arrest;
				}if (domestic == "All"){
					delete formDataBarGraph2.domestic;
				}else{

				};


			$.ajax({
				url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
				method: "GET",
				dataType: "json",
			    data: formDataBarGraph1,
			}).done(function (data1) {
				var data1 = data1.features;
				$.ajax({
					url: 'https://data.cityofchicago.org/resource/ijzp-q8t2.geojson',
					method: "GET",
					dataType: "json",
				    data: formDataBarGraph2,
				}).done(function (data2) {
					var data2 = data2.features;

					var offence1= $("#crimeType1").val();
					var offence2= $("#crimeType2").val();

					// console.log(trace1, trace2);

					var yCount1 = []; //Average count
					var xMonth1 = []; //Months

					var yCount2 = []; //Average count
					var xMonth2 = []; //Months

					var year1 = new Date($("#startDate").val()).getFullYear();
					var year2 = new Date($("#endDate").val()).getFullYear();
					var month1 = new Date($("#startDate").val()).getMonth();
					var month2 = new Date($("#endDate").val()).getMonth();
					var day1 = new Date($("#startDate").val()).getDate();
					var day2 = new Date($("#endDate").val()).getDate();
					var numYear = year2 - year1;
					var numMonth = month2 - month1;
					var numDay = day2 - day1;

					var timePeriod;

					if (numYear > 0){
						timePeriod = numYear;
					}
					if (numMonth > 0) {
						timePeriod = numMonth;
					}
					else{
						timePeriod = numDay;
					}

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

					for(var i =0; i < data1.length; i++){
						yCount1.push(data1[i].properties.offence1/timePeriod);
						xMonth1.push(month[new Date(data1[i].properties.month1).getMonth()]);
					};

					for(var i =0; i < data2.length; i++){
						yCount2.push(data2[i].properties.offence2/timePeriod);
						xMonth2.push(month[new Date(data2[i].properties.month2).getMonth()]);
					};

					var trace1 =
						  {
						x: xMonth1,
						y: yCount1,
					    type: "bar",
					    textfont: {
					        size: 12,
					        color: '#000'
					      },
					    name: ''+ $("#crimeType1").val() + '',
					    marker: {
				           line: {
				            color:  "black",
				            width: 1
				    	},
				    	}
						};

					var trace2 =
						  {
						x: xMonth2,
						y: yCount2,
					    type: "bar",
					    textfont: {
					        size: 12,
					        color: '#000'
					      },
					    name: ''+ $("#crimeType2").val() + '',
					    marker: {
					    	color: 'red',
				           line: {
				            color:  "black",
				            width: 1
				    	},
				    	}
						};

					var data = [trace1,trace2];

					var layout = {
					  title: 'Average Monthly Crime from '+ $("#startDate").val() + ' to '+ $("#endDate").val() + '',
					  yaxis: {
				    		fixedrange: true,
				    		title: "Count"
				    	}
					};

				Plotly.newPlot('graph4', data, layout,{responsive: true});
			});
		});
	}).change();
};

window.onload = main;
