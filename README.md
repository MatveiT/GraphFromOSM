# Graph From OSM

## Introduction

Here is a minimalistic (npm) JavaScript module that can dynamically generate a script to perform OSM queries (to https://overpass-api.de/api/interpreter) and download data about the routing-network. Then it transforms it to a **Graph-structured** data in [geoJSON](https://en.wikipedia.org/wiki/GeoJSON) format. It is possible to **specify the geographical region** and the **type of roads** to download.

- What is a geoJSON format?
  It is a common JSON based format to represent geographical data with large ecosystem of libraries and softwares able to work with it. It can be easily visualized for example on [geojson.io](https://geojson.io/) or on softwares such as [Q-GIS](https://qgis.org/fr/site/).

- What is Graph-structured?
  By graph structured I refer to a mathematical (directed) [graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)) structure, which is basically a set of nodes (also called vertices) connected by links (also called edges). So, in this case, each **road is a link** and each **intersection is a node**.

Here is a visualization of the result,
<img src="https://user-images.githubusercontent.com/43819287/79017980-f085a500-7b72-11ea-8be8-d2c678a6e2a8.PNG" alt="graph" style="width:100%"/>
(image generated with [geojson.io](https://geojson.io/))

## I. Usage as a npm module

#### 1) Installation
```bash
$ npm install graph-from-osm
```

#### 2) Usage
This module expose the object `graphFromOsm` which contains two functions `getOsmData` (asynchrone) and `generateGraph` (synchrone). Here is an **example** of how to use them:

```js
const graphFromOsm = require('graph-from-osm');              // Import module

const mySettings = {                                         // Define my settings
  bbox: [4.3841, 50.8127, 4.3920, 50.8182],                          // Geographical rectangle
  highways: ["primary", "secondary", "tertiary", "residential"],     // Type of roads to consider
  timeout: 600000000, maxContentLength: 1500000000                   // OSM query parameters
}

const generateGraph = async (settings) => {
  const osmData = await graphFromOsm.getOsmData(settings);   // Import OSM raw data
  const graph = graphFromOsm.osmDataToGraph(osmData)         // Here is your graph
  console.log("Your graph contains " + graph.features.length + " nodes ans links.");
}

generateGraph(mySettings);                                   // Execution

```

## II. Usage as a node.js app

#### 1) Installation

1) First you have to install [node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/get-npm) on your computer.
2) Download this project in a local directory.
3) Then initialize (it installs all the dependencies) the module with the command
```bash
$ npm install
```

#### 2) Usage
Just run the command
```bash
$ npm run generate
```

Congratulation, you have obtained you graph!!
- OSM script in ``./data/script.txt``
- OSM raw data in ``./data/osm-raw-data.json``
- graph in ``./data/graph.json``

### Make your own query

By modifying the file ``settings.json``, you can specify:

#### 1) The geographical region

Represented as a **bbox** (bounding box), which is an array of length 4 with float values:
``settings.bbox = [longitude_1, latitude_1, longitude_2, latitude_2]``
where ``[longitude_1, latitude_1]`` is the **bottom-left corner** of the box and ``[longitude_2, latitude_2]`` is the **top-right corner** of the box. The 4 values should be valid [geographical coordinates](https://en.wikipedia.org/wiki/Geographic_coordinate_system) in degrees.

For example, the following bbox is defined by the array ``[4.3777, 50.8132, 4.3969, 50.8223]``.
<img src="https://user-images.githubusercontent.com/43819287/79017969-e82d6a00-7b72-11ea-871f-50487e2309d1.PNG" alt="bbox" style="width:100%"/>
(image generated with [geojson.io](https://geojson.io/))


#### 2) The type of roads

OSM data is based on a [system of tags](https://wiki.openstreetmap.org/wiki/Tags). Each data element possess a set of tags which is a system of key-value pairs. The tag key used to "identify any kind of road, street or path" is [highway](https://wiki.openstreetmap.org/wiki/Key:highway). So, by defining the value of the highway tag, you can choose the type of roads you need in your data. For example, you can consider only high speed highways for car with that tag ``highway: motorway``. Refer to the previous web link to determine what king or highway tag you need.
So ``settings.highways`` should be a non-zero-length array of strings or ``="ALL"``.

Here is an **example of query** (or you can just see the template in ``./settings.json``)

````
{
  bbox: [ 4.3772, 50.8106, 4.3945, 50.8200 ],
  highways: [ "primary", "secondary", "tertiary" ],
  timeout: 600000000,
  maxContentLength: 1500000000
}
````

#### 3) The timeout and maxContentLength

There are time and size limitations for the query.
Note that the smaller are these number, the higher is the priority of your query for OSM.


## Graph structure

In the ``geojson`` format, the **nodes** of the graph are represented as **"Point"**-type features and the **links** are represented as **"LineString"**-type features.  
Each link has properties ``src`` and ``tgt`` which indicate respectively its source node and target node id. This defines the topology of the graph.  
Note that the roads can be bidirectional or non-bidirectional (for cars traffic) but they are never duplicated in the graph file.  
For example if you want your graph to be **undirected** consider the ``src`` and ``tgt`` tags as equivalent.  
On the other hands, if you want your graph to be **directed** consider to duplicate links in both directions ``src -> tgt`` and ``tgt -> src`` when needed. In general, when an OSM way object can be used by a car in only one direction it is tagged as ``"oneway": "yes"`` (more information [here](https://wiki.openstreetmap.org/wiki/Key:oneway)). In our graph format, it is stored as ``link.properties.tags.oneway``.  

The **OSM tags are intentionally never used to construct the graph structure** in this module (execpt when filtering the type of roads to be imported). So that the user is free to choose the way to use them.


## Remarks

#### 1) OSM raw data do not have a graph structure

In OSM raw data, a node element do not always corresponds to an intersection of roads. Moreover, a link can possess multiple intersection in its middle, which should not be the case in a graph. In order to give to the data a graph structure, these links should be separated in multiples links whose two extremities corresponds to its only intersections. This is one thing that this module do.
So, the graph data file possess generally fewer nodes and more links than the OMS raw data file.
Here you can see an illustration of this transformation.

<img src="https://user-images.githubusercontent.com/43819287/79017977-ec598780-7b72-11ea-8b93-b3a8aaf1ecf4.PNG" alt="bbox" style="width:100%"/>
(image generated with Q-GIS)

#### 2) Id system of the graph data

Due to the remark (1), the OSM links ids of the graph may not be unique, so a new system of ids is generated for this data (access id by `myFeature.id`). The old OSM ids are still saved in `myFeature.properties.osmId`.

#### 3) Reconstruct the graph topology

In order to reconstruct the graph structure of the geojson graph data (`./data/graph.json`). Each link (LineString-type geojson object) possess properties `.src` and `.tgt` which reference the id of a node in ``.id``. This information defines the topology of the graph. Note that in roads networks, a node can be linked to itself (`link.src = link.tgt`) and two nodes can be related by multiples links (`link_1.id != link_2.id` but still `link_1.src = link_2.src` and `link_1.tgt = link_2.tgt`).

#### 4) OSM tags

Note that in graph data (`./data/graph.json`), the features keep the initial OSM tags in `.properties.tags` so that you can infer additional information about this feature form its OSM tags (maximal speed, incline, one ways, ...).


## Warning

For the sake of simplicity and minimalism and in order to limit the number of dependencies, this module do not uses any DataBase or other tool to manage memory. Consequently, if the amount of data you want to download exceeds you node.js capacity, the execution will crash.


**Author**: Matsvei Tsishyn (matvei.tsishyn@gmail.com)
