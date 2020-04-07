const { generateOsmScript } = require('./get-osm-data/generate-osm-script.js');
const { runOsmQuery } = require('./get-osm-data/run-osm-query.js');
const { osmDataToGraph } = require('./osm-data-to-graph/osm-data-to-graph.js');




const graphFromOsm = {
  generateOsmScript,               // Generates an OSM script from settings    (1)
  runOsmQuery,                     // Make an OSM query from a script          (2)
  osmDataToGraph                   // Transform OSM data into geojson graph    (3)
}



module.exports = graphFromOsm;
