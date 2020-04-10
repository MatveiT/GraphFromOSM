const { generateOsmScript, runOsmQuery, osmDataToGraph } = require('./index.js');
const fs = require('fs')


const settings = JSON.parse(fs.readFileSync('./settings.json'))
const script = generateOsmScript(settings)




const data = runOsmQuery(script).then(result => {
  return result
})

const graph = osmDataToGraph(data)
console.log(graph)
