import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import './App.js';
import reportWebVitals from './reportWebVitals';

import logo from './logo.svg';
import './App.css';



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
console.log("You are in the app.js file");

function initDashboard() {
    console.log("initDashboard() called");

    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);

        var sampleNames = data.names;

        // Populate the selector with the IDs
        sampleNames.forEach((id) => {
            selector.append("option")
                .text(id)
                .property("value", id);
        });
        var initialId = sampleNames[0];
        console.log("Starting sample ID: ", initialId);

        // call functions to set initial state of components
        drawBarGraph(initialId);
        drawBubbleChart(initialId);
        fillDemographicData(initialId);
    });
}

function drawBarGraph(id) {
    console.log(`drawBarGraph() called with: ${id}`);

    d3.json("samples.json").then((data) => {
        // get samples data
        var samples = data.samples;
        // filter on requested id
        var filterSamplesArray = samples.filter((s) => s.id == id);
        // only one match for each ID so grab index 0:
        var result = filterSamplesArray[0];

        // get the stuff for this id
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0, 10).map((otuId) => `OTU ${otuId}`).reverse();

        var barData = {
            x: sample_values.slice(0, 10).reverse(),
            y: yticks,
            type: "bar",
            text: otu_labels.slice(0, 10).reverse(),
            orientation: "h"
        }

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        }

        Plotly.newPlot("bar", [barData], barLayout);
    });
}

function drawBubbleChart(id) {
    console.log(`drawBubbleChart() called with: ${id}`);

    d3.json("samples.json").then((data) => {
        // get samples for this id
        var samples = data.samples;
        // filter on requested id
        var filterSamplesArray = samples.filter((s) => s.id == id);
        // only one match for each ID so grab index 0:
        var result = filterSamplesArray[0];
        //console.log(result)

        // get the stuff for this id
        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        // set a max bubble size for bubble scaling
        var maxSize = 60;

        var bubbleData = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            text: otu_labels,
            marker: {
                size: sample_values,
                color: otu_ids,
                sizeref: 2.0 * Math.max(...sample_values) / (maxSize**2),
                sizemode: 'area'
            }
        }

        var barLayout = {
            title: "Samples",
            xaxis: { 
                title: { 
                    text: "OTU id"
                }
            },
            margin: {t: 30, l: 150}
        }

        Plotly.newPlot("bubble", [bubbleData], barLayout);
    });
}

function fillDemographicData(id) {
    console.log(`fillDemographicData() called with: ${id}`);

    d3.json("samples.json").then((data) => {

        var metaData = data.metadata;
        var filteredDataArray = metaData.filter((d) => d.id == id);
        result = filteredDataArray[0];

        var metaDataArea = d3.select('#sample-metadata');
        metaDataArea.html("");

        Object.entries(result).forEach(([key, value]) => {
            metaDataArea.append("h6").text(`${key}: ${value}`);
        });
    });
}

function optionChanged(newId) {
    console.log(`optionChanged(${newId})`);
    drawBarGraph(newId);
    drawBubbleChart(newId);
    fillDemographicData(newId);
}

initDashboard()
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          
        </a>
      </header>
    </div>
  );
}

export default App;
