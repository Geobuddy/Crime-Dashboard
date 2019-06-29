// Filter offence by type 
// $(document).ready(function() {
// var offencetype;

//     // body...
//     $.ajax({
//     url: rawDataJSON,
//     type: "GET",
//     data: {
//       "$limit" : 200,
//     }
//     }).done(function(data) {
//     	var geoObject = JSON.parse(data);
// 		var features = [];

// 		features = geoObject.features;
// 		console.log(features);


//     });
// });


// // Source: http://csharp-video-tutorials.blogspot.com/2015/06/jquery-range-slider.html
// $(document).ready(function () {
//     var outputSpan = $('#spanOutput');
//     var sliderDiv = $('#slider');

//     sliderDiv.slider({
//         range: true,
//         min: 18,
//         max: 100,
//         values: [20, 30],
//         slide: function (event, ui) {
//             outputSpan.html(ui.values[0] + ' - ' + ui.values[1] + ' Years');
//         },
//         stop: function (event, ui) {
//             $('#txtMinAge').val(ui.values[0]);
//             $('#txtMaxAge').val(ui.values[1]);
//         }
//     });

//     outputSpan.html(sliderDiv.slider('values', 0) + ' - '
//         + sliderDiv.slider('values', 1) + ' Years');
//     $('#txtMinAge').val(sliderDiv.slider('values', 0));
//     $('#txtMaxAge').val(sliderDiv.slider('values', 1));
// });