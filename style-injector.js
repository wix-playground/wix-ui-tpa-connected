const MOCK_STYLE_BINDINGS = {
  'settings-red': 'red',
  'settings-green': 'green',
  'font-comic': 'small-caps bold 24px/1 sans-serif',
}

function hash(str) {
  let hash = 0

  if (!str.length) {
    return hash
  }

  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    hash = (hash << 5) - hash + c
    hash = hash & hash
  }

  return hash.toString()
}

function getStyleVariables(props, variableSelectors) {
  const vars = {}
  const styleVars = Object.keys(variableSelectors)

  Object.entries(props).forEach(([varName, varValue]) => {
    if (styleVars.includes(varName)) {
      vars[varName] = varValue
    }
  })

  return vars
}

function getNonStyleVariables(props, variableSelectors) {
  const vars = {}
  const styleVars = Object.keys(variableSelectors)

  Object.entries(props).forEach(([varName, varValue]) => {
    if (!styleVars.includes(varName)) {
      vars[varName] = varValue
    }
  })

  return vars
}

function hashProps(props, variableSelectors, componentName) {
  return 'ns-' + hash(componentName + JSON.stringify(getStyleVariables(props, variableSelectors)))
}

function ensureStyleExists() {
  let styleTag = document.getElementById('magic-styles')

  if (!styleTag) {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.id = 'magic-styles'
    document.head.appendChild(style)
  }
}

function hashExists(hash) {
  const styleEl = document.getElementById('magic-styles')

  let exist = false

  for (let i = 0; i < styleEl.sheet.rules.length; i++) {
    if (styleEl.sheet.rules[i].selectorText.startsWith(`.${hash}`)) {
      exist = true
      break
    }
  }

  return exist
}

function injectStyle(value, variableSelectors, hash) {
  if (!MOCK_STYLE_BINDINGS[value]) {
    return
  }

  const styleEl = document.getElementById('magic-styles')

  variableSelectors.forEach(variableSelector => {
    const rule = `.${hash} ${variableSelector.selector.replace(/,/g, `, .${hash} `)} { ${
      variableSelector.declarationProperty
    }: ${MOCK_STYLE_BINDINGS[value]}; }`

    console.log('Injected: ', rule)

    // TODO: Remove existent rule if value changed

    styleEl.sheet.insertRule(rule)
  })
}

module.exports = {
  inject: function(props, variableSelectors, componentName) {
    ensureStyleExists()
    const hash = hashProps(props, variableSelectors, componentName)

    const vars = getStyleVariables(props, variableSelectors)

    if (!hashExists(hash)) {
      Object.entries(vars).forEach(([variableName, variableValue]) => {
        injectStyle(variableValue, variableSelectors[variableName], hash)
      })
    } else {
      console.log('Styles reused by one more component!')
    }
  },
  hashProps,
  getNonStyleVariables,
}
