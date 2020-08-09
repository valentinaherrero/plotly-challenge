function buildMetaData(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;

     // object.entries to get key value pairs from data in sample
     // add key and value pair in panel body 
     
     Object.entries(data).forEach(([key, value]) => {
         PANEL.append("h6").text(`${key}: ${value}`);
         console.log(key, value);
     });
         
     });
    }

    // build bubble chart and pie chart, use d3 json, get data from sample data in app.py

    function buildCharts(sample) {
        d3.json(`/samples/${sample}`).then((data) => {
            const otu_ids = data.otu_ids;
            const otu_labels = data.otu_labels;
            const sample_values = data.sample_values;
            console.log(otu_ids, otu_labels, sample_values);

            // bubble chart 

            var bubbleStructure = {
                margin: {t: 0},
                hovermode: "closest",
                xaxis: {title: "OTU ID"}
            };

            // passing x and y values 
            var bubbleData = [
                { x: otu_ids,
                  y: sample_values,
                  text: otu_labels,
                  mode: "markers",
                  marker: {
                      size: sample_values,
                      color: otu_ids,
                      colorscale: "Earth"
                  }
                }
            ];

            // plot chart
            Plotly.plot("bubble", bubbleData, bubbleStructure);
        
        // pie chart 

        var pieData = [
            {
                values: sample_values.slice(0,10), // using top 10 so using slice
                labels: otu_ids.slice(0,10),
                hovertext: otu_labels.slice(0,10),
                hoverinfo: "hovertext",
                type: "pie" // id element
            }
        ];

        var pieLayout = {
            margin: {t:0, l:0}
        };

        // plot chart 
        Plotly.plot("pie", pieData, pieLayout);

    });
}

function init() {
    var selector = d3.select("#selDataset"); // selecting an element from dropdown
    d3.json("/names").then((sampleNames) => { // dropdown options
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetaData(firstSample);
    });
}

function optionChanged(newSample) { // when selecting new samples, populate chart from  new sample data
    buildCharts(newSample);
    buildMetaData(newSample);
}

init();

