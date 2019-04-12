const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')
const {find: findNodeModule} = require('./node-modules')

const OUTPUT_RELATIVE_PATH = 'cache/styles'
const COMPONENT_SCAN_PATH = 'dist/stories'

const COMPONENT_NAME_DIR_REGEXP = /^[A-Z][^.]/
const STYLABLE_FILE_REGEXP = /\.st\.css$/

const VARIABLE_NAME_REGEXP = /^\s*([A-Za-z0-9]+)/

const walkDirRecursive = dir => {
  let files = []

  fs.readdirSync(dir).forEach(fileName => {
    const fullPath = path.resolve(dir, fileName)
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(walkDirRecursive(fullPath))
    } else {
      files.push(fullPath)
    }
  })

  return files
}

const getWixUiTpaRoot = () => {
  return `${findNodeModule(path.resolve(__dirname), 'wix-ui-tpa')}/wix-ui-tpa`
}

const getComponentNames = () => {
  const componentScanPath = path.resolve(getWixUiTpaRoot(), COMPONENT_SCAN_PATH)
  return fs.readdirSync(componentScanPath).filter(item => item.match(COMPONENT_NAME_DIR_REGEXP))
}

const getComponentStyleFilePaths = componentName => {
  const scanPath = path.resolve(getWixUiTpaRoot(), COMPONENT_SCAN_PATH, componentName)
  return walkDirRecursive(scanPath).filter(item => item.match(STYLABLE_FILE_REGEXP))
}

const getVariableBlockExtractionRegexp = componentName =>
  new RegExp(`${componentName}[\\s\\n\\r]*\\(((.|[\\r\\n])*)\\);`)

const extractStyleFileVariables = (styleFilePath, componentName) => {
  const styleFileContent = fs.readFileSync(styleFilePath, {encoding: 'utf8'})
  const blockRegexp = getVariableBlockExtractionRegexp(componentName)

  const matches = styleFileContent.match(blockRegexp)

  if (!matches) {
    return ''
  }

  return matches[1]
    .replace(/\n\r/g, '\n')
    .replace(/\r\n/, '/n')
    .split('\n')
    .map(line => {
      const lineMatch = line.match(VARIABLE_NAME_REGEXP)
      return lineMatch && lineMatch[1]
    })
    .filter(Boolean)
}

const extractComponentVariables = componentName => {
  const styleFilePaths = getComponentStyleFilePaths(componentName)
  let variables = []

  styleFilePaths.forEach(styleFilePath => {
    variables = variables.concat(extractStyleFileVariables(styleFilePath, componentName))
  })

  return variables
}

const getComponentVariableMap = () => {
  const componentNames = getComponentNames()

  const map = {}

  componentNames.forEach(name => {
    map[name] = extractComponentVariables(name)
  })

  return map
}

const generateStylableFile = (componentName, variables, targetDirectory) => {
  const variableLines = []

  variables.forEach(variable => {
    variableLines.push(`				${variable} '--variable-${componentName}-${variable}'`)
  })

  const fileContent = `
		:import {
			-st-from: "wix-ui-tpa/dist/src/components/${componentName}/${componentName}.st.css";
			-st-default: TPAMixin;
		}

		.root {
			-st-mixin: TPAMixin(
				${variableLines.join(',\n').replace(/^\s+/, '')}
			);
		}
	`

  fs.writeFileSync(path.resolve(targetDirectory, `${componentName}.st.css`), fileContent, {encoding: 'utf-8'})
}

const generateTemporaryWrapperComponents = componentVariableMap => {
  Object.entries(componentVariableMap).forEach(([componentName, variables]) => {
    const targetDirectory = path.resolve(__dirname, `../${OUTPUT_RELATIVE_PATH}`, componentName)
    mkdirp.sync(targetDirectory)
    generateStylableFile(componentName, variables, targetDirectory)
  })
}

const generateIndexFile = componentVariableMap => {
  Object.entries(componentVariableMap).forEach(([componentName, variables]) => {
    const targetDirectory = path.resolve(__dirname, `../${OUTPUT_RELATIVE_PATH}`, `${componentName}.js`)
    fs.writeFileSync(targetDirectory, `require('./${componentName}/${componentName}.st.css')\n`, {encoding: 'utf8'})
  })
}

const generateFakeProject = () => {
  const componentVariableMap = getComponentVariableMap()
  generateTemporaryWrapperComponents(componentVariableMap)
  generateIndexFile(componentVariableMap)
}

generateFakeProject()
