	// ---------- PLOT CLUSTER MAP ---------------
var clusters;

function clusterLayer(data){ //Inherited from AJAX in heatmapLayer
	if(clusters){
		map.removeLayer(clusters);
	}
	geoJsonLayer = new L.geoJson(data,{
			pointToLayer: function(feature, latlng){
				return L.marker(latlng)
			},
        });

	clusters = new L.markerClusterGroup({ disableClusteringAtZoom: 15 });

    clusters.addLayer(geoJsonLayer);
	map.addLayer(clusters);
};

// Hide and Show Heatmap
$("#Btn3").click(function() {
    	$(".marker-cluster").toggle();
    });