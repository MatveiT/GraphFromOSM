const { lengthOfLineString } = require('./distances.js');

/*
--------------------------------------------------------------------------------
Here we define several functions that will be used in OsmToGraph function to
convert OSM raw data into geojson graph.
--------------------------------------------------------------------------------
*/


// -----------------------------------------------------------------------------
/*
Decompose each OSM way-type objects into potentially multiple links
  EXAMPLE: (the * are the raod intersections)
  Initial OSM way object        *------*----------*-------*------*
                          ==>
  Decomposition in 4 links      *------* + *----------* + *-------* + *------*
*/

const decomposeWaysToLinks = (ways, nodeId) => {
  const links = [];
  ways.forEach( way => {
    const nodesOfWay = way.nodes;

    // 1) First node of the way processing -------------------------------------
    let firstNodeId = nodesOfWay[0];
    nodeId.get(firstNodeId).inGraph = true;   // First node of a link always need to be in the graph

    // 2) Middle nodes of the way processing -----------------------------------
    let nodes = [firstNodeId];
    for( let i = 1; i < nodesOfWay.length - 1; i ++ ){
      const currentNodeId = way.nodes[i];
      const currentNode = nodeId.get(currentNodeId);
      nodes.push(currentNodeId);
      if( currentNode.adjLinksCount > 1 ){
        currentNode.inGraph = true;           // Nodes with more that 1 adjacent links are roads intersections and so in the graph
        const link = { ...way };
        link.nodes = nodes;
        link.src = firstNodeId;
        link.tgt = currentNodeId;
        links.push(link);
        nodes = [currentNodeId];
        firstNodeId = currentNodeId;
      }
    }

    // 3) Last node of the way processing -------------------------------------
    const lastNodeId = nodesOfWay[nodesOfWay.length - 1];
    nodeId.get(lastNodeId).inGraph = true;    // Last node of a link always need to be in the graph
    nodes.push(lastNodeId);
    const link = { ...way };
    link.nodes = nodes;
    link.src = firstNodeId;
    link.tgt = lastNodeId;
    links.push(link);

  })
  return links;
}


// -----------------------------------------------------------------------------
// Transforms a node OSM element to a geojson "Point" feature ------------------
const nodeToFeature = (node) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: node.coordinates
    },
    properties: {
      dataId: node.id
    }
  }
}


// -----------------------------------------------------------------------------
// Transforms a way OSM element to a geojson "Point" feature -------------------
const wayToFeature = (link, nodeId) => {
  const coordinates = link.nodes.map( d => nodeId.get(d).coordinates);
  return out = {
    type: 'Feature',
    src: link.src,
    tgt: link.tgt,
    geometry: {
      type: 'LineString',
      coordinates: coordinates
    },
    properties: {
      dataId: link.id,
      length: lengthOfLineString(coordinates)
    }
  }
}

module.exports = { decomposeWaysToLinks, nodeToFeature, wayToFeature };
