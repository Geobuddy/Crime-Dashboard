// create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable
var client;
// and a variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on
var layer;
// Parsed JSON
var crimejson;
// Load the map
getCrimes();
//Select dates function
datePicker();

// create the code to get the Earthquakes data using an XMLHttpRequest 
function getCrimes() {
	client = new XMLHttpRequest();
	client.open('GET','https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$limit=200'); 
	client.onreadystatechange = crimeResponse; 
// note don't use earthquakeResponse() with brackets as that doesn't work 
client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function crimeResponse() {
// this function listens out for the server to say that the data is ready - i.e. has state 4 
	if (client.readyState == 4) {
// once the data is ready, process the data 
		var crimedata = client.responseText; 
		loadCrimelayer(crimedata);
		crimeLayer(crimedata);
		// filterData(crimedata);
	}
}
// define a global variable to hold the layer so that we can use it later on
// convert the received data - which is text - to JSON format and add it to the map 
function loadCrimelayer(crimedata) {
// convert the text to JSON
	crimejson = JSON.parse(crimedata);
// add the JSON layer onto the map - it will appear using the default icons 
	layer = L.geoJson(crimejson,
	{
		//use point to layer to create the points
		pointToLayer: function (feature,latlng)
		{
		// look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude and use a different marker depending on this value
		// also include a pop-up that shows the place value of the earthquakes 
		return L.marker(latlng, {icon:testMarkerRed}).bindPopup("<b>"+feature.properties.primary_type +"</b>");
	},
	}).addTo(map); 
	map.fitBounds(layer.getBounds());
}

function crimeLayer(crimedata) {
// convert the text to JSON
	data = crimejson.features
	// console.log(data)
	// https://www.youtube.com/watch?v=nmNvGHMtE2k - make Offence group array unique
	let arrOffence = data.map(item => item.properties.primary_type);
	arrOffence =  [...new Set(arrOffence)];
	arrOffence = arrOffence.sort();
	console.log(arrOffence)

	var offenceDrop = document.getElementById("offence");
	for(var i = 0; i < arrOffence.length; i++){
		offenceDrop.options.add(new Option(arrOffence[i]));
	}
	
	// https://www.youtube.com/watch?v=nmNvGHMtE2k - make Arrest array unique
	let arrArrest = data.map(item => item.properties.arrest);
	arrArrest =  [...new Set(arrArrest)];
	arrArrest = arrArrest.reverse();
	// console.log(arrArrest.touppercase())

	var arrestDrop = document.getElementById("arrest");
	for(var i = 0; i < arrArrest.length; i++){
		arrestDrop.options.add(new Option(arrArrest[i]));
	}

		// https://www.youtube.com/watch?v=nmNvGHMtE2k - make Arrest array unique
	let arrDomestic = data.map(item => item.properties.domestic);
	arrDomestic = [...new Set(arrDomestic)];
	arrDomestic = arrDomestic.reverse();
	// console.log(arrDomestic)

	var domesticDrop = document.getElementById("domestic");
	for(var i = 0; i < arrDomestic.length; i++){
		domesticDrop.options.add(new Option(arrDomestic[i]));
	}

}

function getValue() {
	// body...
	// var dropVal = offenceDrop.options[offenceDrop.selectedIndex].value;
	var offenceVal = document.getElementById("offence").value;
	// console.log(offenceVal);
	var arrestVal = document.getElementById("arrest").value;
	// console.log(arrestVal);
	var domesticVal = document.getElementById("domestic").value;
	// console.log(domesticVal);

	var startDateVal = document.getElementById("startDate").value;
	console.log(startDateVal);

	var endDateVal = document.getElementById("endDate").value;
	console.log(endDateVal);
	dateArr= [...new Array(startDateVal,endDateVal)]
	// console.log(dateArr)

filterData(offenceVal,arrestVal,domesticVal,dateArr)

}

var startDate, endDate; 

function datePicker() {
    $('#startDate').datepicker({
    	showAnim: 'slideDown',
    	changeMonth: true,
    	numberOfMonths: 1,
    	dateFormat: 'yy-mm-dd',
    	onClose: function( selectedDate ) {
    		$( "#endDate" ).datepicker( "option", "minDate", selectedDate );
		}
	});

    $('#endDate').datepicker({
    	defaultDate: "+1w",
		changeMonth: true,
		numberOfMonths: 1,
		dateFormat: 'yy-mm-dd',
		onClose: function( selectedDate ) {
    		$( "#startDate" ).datepicker( "option", "maxDate", selectedDate );
	  	}
	});
};

function filterData(offenceVal,arrestVal,domesticVal,dateArr) {
	// body...

	var offence = offenceVal;
	var arrest = arrestVal;
	var domestic = domesticVal;
	var startDate = dateArr[0];
	var endDate = dateArr[1]
	console.log(endDate);

// https://dev.socrata.com/docs/cors-and-jsonp.html
  	$.ajax({
        url: "https://data.cityofchicago.org/resource/vwwp-7yr9.geojson",
        method: "GET",
        dataType: "json",
        data: {
          "$where": "date >'" + startDate + "'"
          + " AND date <'" + endDate + "'"
          + " AND primary_type = '" + offence + "'" 
          + " AND arrest = " + arrest 
          + " AND domestic = " + domestic,
          "$limit" : 200,
    	},
		success: function( data, status, jqxhr ){
			console.log( "Request received:", data );
		},
		error: function( jqxhr, status, error ){
			console.log( "Something went wrong!" );
		}
    });	
}
