var rawDataJSON = 'https://data.cityofchicago.org/resource/vwwp-7yr9.geojson?$limit=200';
var xField = 'date';
var yField = 'beat';

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

Plotly.d3.csv(rawDataJSON, function(err, rawData) {
    console.log(rawDataJSON)
    if(err) throw err;
    var data;
    $.each(rawData, function(i, obj){
        var data = prepData(obj)
    });
    var layout = {
        title: 'Crime Time-series',
        xaxis: {
            rangeselector: selectorOptions,
            rangeslider: {}
        },
        yaxis: {
            fixedrange: true
        }
    };

    // var data1 = [{
    //     type: 'bar',
    //     x: yField,
    //     y: xField,
    //     orientation: 'h'
    // }];
    // var layout1 = {
    //     title: 'Crime By Type'
    // }

    Plotly.plot('graph', data, layout, {showSendToCloud: true});
    // Plotly.plot('graph1', data1, layout1);
});

function prepData(obj) {
    var x = [];
    var y = [];

    // console.log(obj.length)

    $.each(obj,function(datum, i) {
        if(i % 100) return;

        x.push(new Date(datum[xField]));
        y.push(datum[yField]);
        console.log(datum[xField])
    });

    return [{
        mode: 'lines',
        x: x,
        y: y
    }];
}
