/* istanbul ignore file */
/**
 * mock for style
 */
export class MockCssStylesheet {
  public cssRules: ICssRules = {
    length: 0,
  }
  public rules: ICssRules = {
    length: 0,
  }

  public deleteRule(index: number) {
    delete this.rules[index]
    delete this.cssRules[index]
    Object.entries(this.rules).forEach(([key, value]) => {
      const i = parseInt(key, 10)
      if (key !== 'length' && i > index) {
        const newKey = i - 1
        this.rules[newKey] = value
        delete this.rules[i]
      }
    })
    Object.entries(this.cssRules).forEach(([key, value]) => {
      const i = parseInt(key, 10)
      if (key !== 'length' && i > index) {
        const newKey = i - 1
        this.cssRules[newKey] = value
        delete this.cssRules[i]
      }
    })

    this.rules.length--
    this.cssRules.length--
  }

  public insertRule(rule: string, index: number) {
    const selector = rule.split('{')[0].trim()
    this.rules[index] = { css: rule, selectorText: selector }
    this.rules.length++

    this.cssRules[index] = {css: rule, selectorText: selector}
    this.cssRules.length++

    return index
  }
}

interface ICssRules {
  length: number
  [ruleIndex: number]: {
    selectorText: string,
    css: string,
  }
}
