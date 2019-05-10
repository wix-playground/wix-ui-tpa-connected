const fs = require('fs')

const generatorPackage = JSON.parse(
  fs.readFileSync('./node_modules/wix-ui-tpa-connected-generator/package.json', {encoding: 'utf8'}),
)

const currentPackage = JSON.parse(fs.readFileSync('./package.json', {encoding: 'utf8'}))

console.log(currentPackage)

currentPackage.name = generatorPackage.name
currentPackage.version = generatorPackage.version

fs.writeFileSync('./package.json', JSON.stringify(currentPackage, null, 2), {encoding: 'utf8'})
