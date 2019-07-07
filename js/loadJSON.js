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

		console.log(data);
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});


	var arrSelect = $("#arrest")
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$select=distinct arrest&$order=arrest DESC'
	})
	.done(function(data) {
		console.log(data);
		$.each(data.features, function (i, feature) {
			console.log(i,feature);
			arrSelect.append(
				$("<option></option>").val(feature.properties.arrest).html(feature.properties.arrest))
			// body...
		});
		console.log(data);
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});

	var domSelect = $("#domestic")
	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$select=distinct domestic&$order=domestic DESC'
	})
	.done(function(data) {
		console.log(data);
		$.each(data.features, function (i, feature) {
			console.log(i,feature);
			domSelect.append(
				$("<option></option>").val(feature.properties.domestic).html(feature.properties.domestic))
			// body...
		});
		console.log(data);
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});


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

	});

function getOffence(){
	var offence= $("#crimeType").val();
	// console.log(Offence);
	fitlerData(offence);
};

function getArrest(){
	var arrest= $("#arrest").val();
	// console.log(arrest);
	fitlerData(arrest);
};

function getDomestic(){
	var domestic= $("#domestic").val();
	// console.log(domestic);
	fitlerData(domestic);
};

function getStartDate(){
	var startDate= $("#startDate").val();
	// var selectedEnd= $("#endDate").val();
	// console.log(selectedStart);
	fitlerData(startDate);
};

function getEndDate(){
	var endDate= $("#endDate").val();
	// console.log(endDate);
	fitlerData(endDate);
};

function fitlerData(offence,arrest,domestic,startDate,endDate) {

	$.ajax({
		url: 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?',
		method: "GET",
		dataType: "json",
        data: {
          "$where": "primary_type = '" + offence + "'",
          // + " AND date >'" + startDate + "'",
          // + " AND date <'" + endDate + "'"
          // + " AND primary_type = '" + offence + "'" 
          // + " AND arrest = " + arrest 
          // + " AND domestic = " + domestic,
          "$limit" : 200
      	},
	})
	.done(function(data) {

		// $.each(data.features, function (i, feature) {
		// 	console.log(i,feature);
		// 	domSelect.append(
		// 		$("<option></option>").val(feature.properties.domestic).html(feature.properties.domestic))
		// 	// body...
		// });
		// add the JSON layer onto the map - it will appear using the default icons 
		$("#crimeType").change(function() {
			/* Act on the event */
			layer = L.geoJson(data,{
			//use point to layer to create the points
				pointToLayer: function (feature,latlng){
			return new L.marker(latlng, {icon:testMarkerRed}).bindPopup("<b>"+feature.properties.primary_type +"</b>");
			},
			}).addTo(map); 
			map.fitBounds(layer.getBounds());

		});
		// layer = L.geoJson(data,
		// {
		// 	//use point to layer to create the points
		// 	pointToLayer: function (feature,latlng)
		// 	{
		// 	// look at the GeoJSON file - specifically at the properties - to see the earthquake magnitude and use a different marker depending on this value
		// 	// also include a pop-up that shows the place value of the earthquakes 
		// 	return L.marker(latlng, {icon:testMarkerRed}).bindPopup("<b>"+feature.properties.primary_type +"</b>");
		// },
		// }).addTo(map); 
		// map.fitBounds(layer.getBounds());
		console.log(data);
		console.log("success");
	})

}



