/**
 * StylesheetHandler - service to
 */
export class StylesheetHandler implements IStylesheetHandler {
  private styleTag: HTMLStyleElement | undefined
  constructor(private document: Document, private componentHash: string) {}

  public insertRule(originalSelector: string, styleToSet: string, mediaQuery?: string) {
    const selector = `.${this.componentHash}${originalSelector}`
    if (!this.styleTag) {
      const styleTag =
        (this.document.getElementById(this.componentHash) as HTMLStyleElement) ||
        undefined ||
        this.createAndAddTag(this.componentHash)
      this.styleTag = styleTag
    }
    this.insertCssRule(selector, styleToSet, this.styleTag.sheet as CSSStyleSheet, mediaQuery)
  }

  public createFragment(css: string) {
    const fragStylesheet = this.document.createDocumentFragment()
    fragStylesheet.textContent = css
    return fragStylesheet
  }

  public createTagWithContent(cssContent: string) {
    const style = this.document.createElement('style')
    style.type = 'text/css'
    style.id = `${this.componentHash}-default-style`
    style.textContent = cssContent
    this.document.head.appendChild(style)
  }

  private createAndAddTag(styleTagId: string): HTMLStyleElement {
    const style = this.document.createElement('style')
    style.type = 'text/css'
    style.id = styleTagId
    this.document.head.appendChild(style)
    return style
  }

  private insertCssRule(selector: string, css: string, sheet: CSSStyleSheet, mediaQuery?: string) {
    const rule = this.buildCssRule(selector, css, mediaQuery)
    this.removeDuplicate(selector)
    this.appendRule(rule, sheet)
  }

  private removeDuplicate(selector: string) {
    const sheet = this.styleTag.sheet as CSSStyleSheet
    const rules = sheet.rules as CSSRuleList
    Object.entries(rules).forEach(([key, ruleDefinition]) => {
      if (key === 'length') {
        return
      }
      const rule = ruleDefinition as CSSPageRule
      if (rule.selectorText === selector) {
        const ruleIndex = parseInt(key, 10)
        sheet.deleteRule(ruleIndex)
      }
    })
  }

  private buildCssRule(selector: string, cssContent: string, mediaQuery?: string): string {
    const rule = `${selector} {${cssContent}}`
    if (mediaQuery) {
      return this.wrapWithMediaQuery(rule, mediaQuery)
    }

    return rule
  }

  private wrapWithMediaQuery(cssRule: string, mediaQuery: string): string {
    return `@media ${mediaQuery} {${cssRule}}`
  }

  private appendRule(rule: string, sheet: CSSStyleSheet) {
    const numberOfRules = sheet.rules.length
    return sheet.insertRule(rule, numberOfRules)
  }
}

/**
 * IStylesheetHandler
 */
export interface IStylesheetHandler {
  insertRule(selector: string, styleToSet: string, mediaQuery?: string): void
  createFragment(css: string): DocumentFragment
  createTagWithContent(cssContent: string): void
}
/**
 * IRuleIndices
 */
export interface IRuleIndices {
  [selector: string]: number
}
