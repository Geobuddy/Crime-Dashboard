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