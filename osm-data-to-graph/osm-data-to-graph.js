const { decomposeWaysToLinks, nodeToFeature, wayToFeature } = require('./tools');

/*
--------------------------------------------------------------------------------
A functrion that transforms raw OSM data into a geojson format.
Moreover, it restructurate the nodes and ways element in such a
way that they now are forming a graph.
The main point is to separate a way object each time there is a road intersection.
--------------------------------------------------------------------------------
*/

const osmDataToGraph = (osmData) => {
  // 0) Initialization ---------------------------------------------------------
  const graph = {
    type: 'FeatureCollection',
    metaData: {
      source: 'https://overpass-api.de/api/interpreter',
      version: osmData.version,
      generator: osmData.generator,
      osm3s: osmData.osm3s,
      generationCodeAuthor: 'Matsvei Tsishyn'
    },
    features: []
  }

  // 1) Initialize some new properties and separate in nodes and ways ----------
  const elements = osmData.elements;         // Array of nodes and ways OMS elements
  const nodes = [], ways = [];               // Separate arrays of respectively nodes and ways OSM elements
  const nodeId = new Map();                  // Map: node.id => node
  elements.forEach( element => {
    if(element.type === 'node'){
      element.coordinates = [element.lon, element.lat];
      element.adjLinksCount = 0              // adjLinksCount count how may OSM ways pass trough this node
      element.inGraph = false                // indicate if we need to import this OSM node as a node in the graph
      nodes.push(element);
      nodeId.set(element.id, element)
    }else if(element.type === 'way'){
      ways.push(element);
    }
  })

  // 2) Update the adjLinksCount of nodes --------------------------------------
  ways.forEach( way => {
    way.nodes.forEach( node => {
      nodeId.get(node).adjLinksCount ++;
    })
  })

  // 3) Decompose way elements in links ----------------------------------------
  const links = decomposeWaysToLinks(ways, nodeId);

  // 4) Transform OSM nodes and links into geojson feature and add to graph
  const pointFeatures = nodes.filter( d => d.inGraph ).map( d => nodeToFeature(d) );
  const lineStringFeatures = links.map( d => wayToFeature(d, nodeId) );
  graph.features = pointFeatures.concat(lineStringFeatures);

  return graph;
}

module.exports = { osmDataToGraph };
