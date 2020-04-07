// -----------------------------------------------------------------------------
// Imports ---------------------------------------------------------------------
const fs = require('fs');   // "fs" for "files system"
const { generateOsmScript, runOsmQuery, osmDataToGraph } = require('./index.js');

// -----------------------------------------------------------------------------
// Read and write functions ----------------------------------------------------

// Write text file
const write = (directory, string) => {
  fs.writeFileSync(directory, string);
};

// Write JSON file
const writeJSON = (directory, json) => {
  fs.writeFileSync(directory, JSON.stringify(json, null, '  '));
};

// Read JSON file
const readJSON = (fileName) => {
  return JSON.parse(fs.readFileSync(fileName));
};


// -----------------------------------------------------------------------------
// Main function ---------------------------------------------------------------

const generateData = async (settings) => {
  const t0 = new Date();
  console.log("\n-------------------------------------------------------------")
  console.log('Graph-From-OSM is generating data ...\n')
  const dataDirectory = './data/';
  const scriptDir = dataDirectory + 'osm-script.txt';
  const rawDataDir = dataDirectory + 'raw-osm-data.json';
  const graphDir = dataDirectory + 'graph.json';

  // 1) Generate script --------------------------------------------------------
  const osmScript = generateOsmScript(settings);
  write(scriptDir, osmScript);
  console.log('   - OSM script generated.')


  // 2) OSM query --------------------------------------------------------------
  console.log('   - OSM query sended ...')
  let t1 = new Date();
  const data = await runOsmQuery(osmScript);
  writeJSON(rawDataDir, data);
  let t2 = new Date();
  console.log('   - OSM data recieved (' + ((t2-t1)/1000) +' s).')

  // 3) OSM to graph -----------------------------------------------------------
  console.log('   - Processing of OSM data to graph ...')
  let t3 = new Date();
  const graph = osmDataToGraph(data);
  writeJSON(graphDir, graph)
  let t4 = new Date();
  console.log('   - Processing done (' + ((t4-t3)/1000) +' s).')

  console.log('\nGraph-From-OSM Run Done in ' + ((t4-t0)/1000) + ' seconds.')

  // Print information ---------------------------------------------------------
  console.log('\n\nData source: https://overpass-api.de/api/interpreter')
  console.log('Copyright: The data included in this document is from')
  console.log('www.openstreetmap.org. The data is made available under ODbL.\n\n')

  console.log("You can find your data in: ")
  console.log("   - OSM script:              " + scriptDir)
  console.log("   - OSM raw data:            " + rawDataDir)
  console.log("   - Graph in geoJSON:        " + graphDir)
  console.log("-------------------------------------------------------------\n")
}




// -----------------------------------------------------------------------------
// Execution -------------------------------------------------------------------


const settings = readJSON('./settings.json');
generateData(settings);
