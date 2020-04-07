const { generateOsmScript } = require('./get-osm-data/generate-osm-script.js');
const { runOsmQuery } = require('./get-osm-data/run-osm-query.js');
const { osmDataToGraph } = require('./osm-data-to-graph/osm-data-to-graph.js');



// Returns Raw OSM data --------------------------------------------------------
// Just execute generateOsmScript and then runOsmQuery
const generateOsmData = async (settings) => {
  return await runOsmQuery(generateOsmScript(settings));
}

// Returns Graph from OSM data -------------------------------------------------
// Just execute generateOsmScript then runOsmQuery and then osmDataToGraph
const generateGraph = async (settings) => {
  const osmData = await runOsmQuery(generateOsmScript(settings));
  return osmDataToGraph(osmData);
}

const graphFromOsm = {
  generateOsmScript,               // Generates an OSM script from settings    (1)
  runOsmQuery,                     // Make an OSM query from a script          (2)
  osmDataToGraph,                  // Transform OSM data into geojson graph    (3)
  generateOsmData,                 // Make an OSM query from settings          (1) + (2)
  generateGraph                    // Generate a geojson graph from settings   (1) + (2) + (3)
}



module.exports = graphFromOsm;
