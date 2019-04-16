const fs = require('fs')
const path = require('path')
const cssTree = require('css-tree')
const mkdirp = require('mkdirp')

const BUILT_STYLES_ROOT = path.resolve(__dirname, '../built-styles')
const FINAL_COMPONENT_ROOT = path.resolve(__dirname, '../components')

const VARIABLE_PARTS_REGEXP = /\-\-variable\-([A-Za-z0-9]+)\-([A-Za-z0-9]+)/

const getComponentNames = () =>
  fs
    .readdirSync(BUILT_STYLES_ROOT)
    .filter(fileName => fileName.match(/\.js$/))
    .map(fileName => fileName.substring(0, fileName.length - 3))

const getComponentStyles = () => {
  let styles = ''

  getComponentNames().forEach(componentName => {
    styles = styles.concat(
      '\n' + fs.readFileSync(path.resolve(BUILT_STYLES_ROOT, `${componentName}.bundle.css`), {encoding: 'utf-8'}),
    )
  })

  return styles
}

const getStylesAst = () => cssTree.parse(getComponentStyles())

const getVariableSelectors = () => {
  const variableSelectors = {}

  const ast = getStylesAst()

  let selectorList = null
  let declarationProperty = null

  cssTree.walk(ast, {
    enter: node => {
      if (node.type === 'SelectorList') {
        selectorList = node
      } else if (node.type === 'Declaration') {
        declarationProperty = node.property
      } else if (node.type === 'String' && node.value.includes('--variable')) {
        const referenceAst = cssTree.parse('.test {}')

        // @ts-ignore
        referenceAst.children.head.data.prelude = selectorList

        const selector = cssTree.generate(referenceAst).replace(/\{\}$/, '')

        const [, componentName, variableName] = node.value.match(VARIABLE_PARTS_REGEXP)

        variableSelectors[componentName] = variableSelectors[componentName] || {}
        variableSelectors[componentName][variableName] = variableSelectors[componentName][variableName] || []
        variableSelectors[componentName][variableName].push({selector, declarationProperty})
      }
    },
    leave: node => {
      if (node.type === 'Rule') {
        selectorList = null
      } else if (node.type === 'Declaration') {
        declarationProperty = null
      }
    },
  })

  return variableSelectors
}

// TODO: test with wix-style-processor

const generateComponent = (componentName, variableSelectors) => {
  const targetFile = path.resolve(FINAL_COMPONENT_ROOT, `${componentName}.js`)

  const componentCode = `
		"use strict";

		function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

		var React = require('react');

		var ${componentName}_ui_tpa = require('../built-styles/${componentName}.js');
		var inject = require('../style-injector.js').inject
		var hashProps = require('../style-injector.js').hashProps
		var getNonStyleVariables = require('../style-injector.js').getNonStyleVariables

		function ${componentName}(props) {
			React.Component.constructor.call(this);
			var self = this;

			self.variableSelectors = ${JSON.stringify(variableSelectors)};

			self.render = function() {
				return React.createElement("div", {
					className: hashProps(self.props, self.variableSelectors, '${componentName}')
				}, React.createElement(${componentName}_ui_tpa, getNonStyleVariables(self.props, self.variableSelectors)));
			}

			self.updateStyles = function(props) {
				inject(props, self.variableSelectors, '${componentName}')
			}

			self.componentWillMount = function() {
				self.updateStyles(self.props)
			}

			self.componentWillReceiveProps = function() {
				self.updateStyles(self.props)
			}
		}

		${componentName}.prototype = Object.create(React.Component.prototype);

		module.exports = ${componentName};
	`

  fs.writeFileSync(targetFile, componentCode, {encoding: 'utf8'})
}

const generateComponents = () => {
  const variableSelectors = getVariableSelectors()

  mkdirp.sync(FINAL_COMPONENT_ROOT)

  getComponentNames().forEach(componentName => {
    generateComponent(componentName, variableSelectors[componentName])
  })
}

generateComponents()
