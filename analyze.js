const fs = require('fs')

const files = [
  'double_decker_bus/dd-1.json',
  'double_decker_bus/dd-2.json',
  'office/office-1.json',
  'office/office-2.json',
  'office/office-3.json',
  'outside/bbq-1.json',
  'outside/bbq-2.json',
  'outside/bbq-3.json',
  'pub/pub-1.json',
  'pub/pub-2.json',
  'pub/pub-3.json',
  'single_decker_bus/bus-1.json',
  'single_decker_bus/bus-2.json',
  'single_decker_bus/bus-3.json'
]

const avg = numbers => {
  const sum = numbers.reduce((a, b) => a + b)
  return sum / numbers.length
}

files
  .forEach(file => {
    const contents = fs.readFileSync(file).toString()
    const obj = JSON.parse(contents)

    const allEWs = obj.participants
      .reduce((allEWs, participant) => {
        return participant.results
          .reduce((allEWs, result) => {
            return result.counterparts
              .reduce((allEWs, counterpart) => {
                return allEWs.concat(counterpart.exposureWindows)
              }, allEWs)
          }, allEWs)
      }, [])
    
    const allMinAttenuation = allEWs
      .reduce((allMinAttenuation, ew) => {
        return ew.scanInstances
          .reduce((allMinAttenuation, si) => {
            return allMinAttenuation.concat(si.minAttenuationDb)
          }, allMinAttenuation)
      }, [])
    const allTypicalAttenuation = allEWs
      .reduce((allTypicalAttenuation, ew) => {
        return ew.scanInstances
          .reduce((allTypicalAttenuation, si) => {
            return allTypicalAttenuation.concat(si.typicalAttenuationDb)
          }, allTypicalAttenuation)
      }, [])

    console.log(file)
    console.log('  min attenuation (avg)', avg(allMinAttenuation))
    console.log('  typ attenuation (avg)', avg(allTypicalAttenuation))
  })