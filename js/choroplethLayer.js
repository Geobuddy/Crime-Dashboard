$(document).ready(function() {
	$('.form-control').change(function(e) {
		e.preventDefault();
		/* Act on the event */
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
	        	"$limit" : 100000,
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
		}).done(function (crime) {
				// console.log(crime);
				$.ajax({
					url: 'https://raw.githubusercontent.com/RandomFractals/ChicagoCrimes/master/data/chicago-community-areas.geojson',
					type: 'GET',
					dataType: 'json',
					data:{
					},
				}).done(function(boundaries) {
					$.getJSON("Census_2010_Populations_Chicago.json", function(data) {
					}).done(function (population) {
						var myPop = population;
						console.log(myPop);
						var myCrime = crime.features;
						var myBoundary = boundaries.features;

						for(var i =0; i < myCrime.length; i++){
							var dataState = myCrime[i].properties.community_area;
							var dataValue = +myCrime[i].properties.offence;

							for(var k= 0; k < myPop.length; k++){
								var	popArea = myPop[k].Community_Area_Num;
								var popNum = +myPop[k].Population_2010;


								for(var j =0; j < myBoundary.length; j++){
									var jsonState = myBoundary[j].properties.area_numbe;
									if(dataState == jsonState){
										myBoundary[j].properties.value = dataValue;
										break;
									}
									if(popArea == jsonState){
										myBoundary[j].properties.population_numb = popNum;
										var count = myBoundary[j].properties.value;
										var pop = myBoundary[j].properties.population_numb
										myBoundary[j].properties.crime_rate = (count / pop )*1000;
										break;
									}
									
								}
							}
						}
						getData(boundaries);
					});
				});
			});
	});
});

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
				'<b>'+ 'Community Area: ' + props.area_numbe + '</b><br />' + props.value + ' Offence (s)'
				: 'Hover over a state');
		};

		info.addTo(map);


		// get color depending on population density value
		function getColor(d) {
			return d > 1000 ? '#253494' :
					d > 500  ? '#2c7fb8' :
					d > 200  ? '#41b6c4' :
					d > 100  ? '#7fcdbb' :
					d > 50   ? '#c7e9b4' :
								'#ffffcc';
					
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


		L.geoJson(getData(), {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		function getData(){
		}

		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [50, 100, 200, 500, 1000],
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

		//sHide and Show Choropleth map
		$("#Btn1").click(function() {
		    	$(".info.leaflet-control, .info.legend.leaflet-control").toggle();
		    });




		// ---------- Plot Histogram for Crime count per Community ---------------

		var x = [];
		var xHist = [];
		var yHist = []

		// for(var i =0; i < myCrime.length; i++){
		// 	x.push(myCrime[i].properties.offence);
		// 	xHist.push(+myCrime[i].properties.community_area);
		// 	yHist.push(myCrime[i].properties.offence);
		// }
		
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

		// });
// 	});
// });