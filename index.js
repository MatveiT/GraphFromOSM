const { getOsmData } = require('./get-osm-data/get-osm-data.js');
const { osmDataToGraph } = require('./osm-data-to-graph/osm-data-to-graph.js');


const graphFromOsm = {
  getOsmData,                     // Make an OSM query and recieve OSM data (asynchrone)
  osmDataToGraph                  // Transform OSM data into geojson graph  (synchrone)
}



module.exports = graphFromOsm;
