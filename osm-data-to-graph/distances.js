/*
--------------------------------------------------------------------------------
Here we define a set of functions to manage distances between geographic coordinates
--------------------------------------------------------------------------------
*/

// -----------------------------------------------------------------------------
// Conversion function from degree° to radians ---------------------------------
/*
Input: float value in degrees
Output: float value in radians
*/
const degToRad = deg => {
  return (deg * Math.PI) / 180;
};



// -----------------------------------------------------------------------------
// Compute the exact distance between two coordinates points -------------------
/*
Input: array of two coordinate points
Note: a coordinate point is an array of length 2 with float values in respectively longitude and latitude (the order is important !!!)
Output: float value in meters
Reference: https://en.wikipedia.org/wiki/Haversine_formula
*/

const EARTH_DIAMETER = 12742e3;
const haversine = ([lg1, lt1], [lg2, lt2]) => {
  const phi1 = degToRad(lt1);
  const phi2 = degToRad(lt2);
  const dphi = phi2 - phi1;
  const dlambda = degToRad(lg2 - lg1);
  return (
    EARTH_DIAMETER *
    Math.asin(
      Math.sqrt(
        Math.sin(dphi / 2) ** 2 +
          Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2
      )
    )
  );
};



// -----------------------------------------------------------------------------
// Compute the length of a LineString ------------------------------------------
/*
Input: LineString, which is and array of length greater or equal to 2, whose elements are coordinate points
Note: LineString feature according to the geojson format: https://en.wikipedia.org/wiki/GeoJSON
Output: float value in meters
*/

const lengthOfLineString = (lineString) => {
  let len = 0;
  for(let i = 1, n = lineString.length; i < n; i ++){
    len += haversine(lineString[i-1], lineString[i]);
  }
  return len;
}



module.exports = { haversine, lengthOfLineString };
