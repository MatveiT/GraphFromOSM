/*
--------------------------------------------------------------------------------
Verify if the input settings of the function generateOsmScript are correct and
have the right structure.
--------------------------------------------------------------------------------
*/



// -----------------------------------------------------------------------------
// Example of correct settings for printing error message ----------------------
const exampleOfCorrectSettings = {
  bbox: [4.3841, 50.8127,	4.3920, 50.8182],
  highways: ["primary", "secondary", "tertiary", "residential"],
  timeout: 600000000,
  maxContentLength: 1500000000
}

// Function to print error -----------------------------------------------------
const printError = (message) => {
  console.log('\n------------------------------------------------------------------------')
  console.log("ERROR in Graph-From-OSM: Invalid settings.\n")
  console.log(message + '\n')
  console.log('Example of correct settings: \n ')
  console.log(exampleOfCorrectSettings)
  console.log('------------------------------------------------------------------------\n')
}



// -----------------------------------------------------------------------------
// Tests -----------------------------------------------------------------------
const areSettingsCorrect = (settings = {}) => {
  // Pocess right properties ---------------------------------------------------
  if( !(settings.hasOwnProperty('bbox') && settings.hasOwnProperty('highways') && settings.hasOwnProperty('timeout') && settings.hasOwnProperty('maxContentLength')) ){
    printError('Settings object should pocess properties "bbox", "highways", "timeout" and "maxContentLength".');
    return false;
  }
  const { bbox, highways, timeout, maxContentLength } = settings;

  // bbox is ok ----------------------------------------------------------------
  if( !(Array.isArray(bbox) && bbox.length === 4) ){
    printError('bbox should be an array of length 4.');
    return false;
  }

  if( !( (-180 <= bbox[0]) && (bbox[0] < 180) && (-180 <= bbox[2]) && (bbox[2] < 180)  ) ){
    const line1 = 'Longitude of bbox (bbox[0] and bbox[2]) should be a valid\n'
    const line2 = 'geographical longitude between -180 and 180.'
    printError(line1 + line2);
    return false;
  }

  if( !( (-90 <= bbox[1]) && (bbox[1] < 90) && (-90 <= bbox[3]) && (bbox[3] < 90)  ) ){
    const line1 = 'Latitude of bbox (bbox[1] and bbox[3]) should be a valid\n'
    const line2 = 'geographical latitude between -90 and 90.'
    printError(line1 + line2);
    return false;
  }


  // highways is valid ---------------------------------------------------------
  if( highways !== 'ALL'){
    if( !(Array.isArray(highways) && highways.length > 0) ){
      printError('highways should be a non-zero length array or highways = "ALL".');
      return false;
    }

    let allstrings = true;
    highways.forEach( highway => {
      if(typeof highway !== 'string'){ allstrings = false }
    })
    if( !allstrings ){
      printError('All elements of highways should be strings or highways = "ALL".');
      return false;
    }
  }


  // timeout and maxContentLength are valid ------------------------------------
  if( !(Number.isInteger(timeout) && timeout > 0) ){
    printError("timeout should be a strictly positive integer");
    return false;
  }

  if( !(Number.isInteger(maxContentLength) && maxContentLength > 0) ){
    printError("maxContentLength should be a strictly positive integer");
    return false;
  }

  // All is correct :) ---------------------------------------------------------
  return true;
}


module.exports = { areSettingsCorrect };
