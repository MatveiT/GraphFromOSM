const { areSettingsCorrect } = require('./are-settings-correct.js');

/*
--------------------------------------------------------------------------------
Given a settings object, this function generates dynamically an OSM script that can
be used for an OSM query on https://overpass-turbo.eu or https://overpass-api.de/api/interpreter

- Input: settings object with properties bbox, highways, timeout and maxContentLength:
    - bbox: array of length 4 with float values: [longitude_1, latitude_1, longitude_2, latitude_2]
            where [longitude_1, latitude_1] is the bottom-left corner of the box and
            [longitude_2, latitude_2] is the top-right corner of the box.
            The 4 values should be valid geographical coordinates in degrees
            Ref: (https://en.wikipedia.org/wiki/Geographic_coordinate_system).
    - highways: a non-zero length array of string
    - timeout, maxContentLength: strictly positive integer
- Output: OSM data in JSON format with "way" and "node" type elements that are:
    - "way"-type elements that are inside the geographical region defined by settings.bbox and
       who pocess a tag "highway" with a values in settings.highways and that do not have a tag "area"
    - "node"-type objects that are the children of these ways
--------------------------------------------------------------------------------
*/


const generateOsmScript = (settings) => {
  if( areSettingsCorrect(settings) ){
    const bbox = `${settings.bbox[1]}, ${settings.bbox[0]}, ${settings.bbox[3]}, ${settings.bbox[2]}`;

    let highways;
    if(settings.highways === 'ALL'){
      highways = `\tway[highway][!area];\n`
    }else{
      highways = settings.highways.reduce(
        (concatenation, d) => concatenation + `\tway[highway=${d}][!area];\n`,
        ''
        ).slice(0, -1);
    }

    const osmScript = `
  // OSM script to execute on https://overpass-turbo.eu or https://overpass-api.de/api/interpreter
  // Author: Matsvei Tsishyn
  // Settings --------------------------------------------------------------------
  [out:json][bbox:${bbox}];

  // Find all way elements -------------------------------------------------------
  (
    ${highways}
  )->.ways;

  // Find all of their node children elements ------------------------------------
  .ways; node(w)->.nodes;

  // Take the union --------------------------------------------------------------
  (
    .ways;
    .nodes;
  )->.all;

  // Export ----------------------------------------------------------------------
  .all out;`.slice(1);
    return osmScript;
  }else{
    return null;
  }
}



module.exports = { generateOsmScript };
