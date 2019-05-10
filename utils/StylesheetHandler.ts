/**
 * StylesheetHandler - service to
 */
export class StylesheetHandler implements IStylesheetHandler {
  private ruleIndices: IRuleIndices = {}
  constructor(private document: Document, private componentHash: string) {}

  public insertRule(originalSelector: string, styleToSet: string, mediaQuery?: string) {
    const selector = `.${this.componentHash}${originalSelector}`
    const styleTagId = `${this.componentHash}`
    let styleTag: HTMLStyleElement =
      (this.document.getElementById(styleTagId) as HTMLStyleElement) || undefined
    if (!styleTag) {
      styleTag = this.createAndAddTag(styleTagId)
    }

    this.insertCssRule(selector, styleToSet, styleTag.sheet as CSSStyleSheet, mediaQuery)
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
    const ruleIndex = this.appendRule(rule, sheet)
    this.removeOldRule(selector, sheet)
    this.ruleIndices[selector] = ruleIndex
    this.syncIndices(sheet)
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

  private removeOldRule(selector: string, sheet: CSSStyleSheet): void {
    if (this.ruleIndices[selector] !== undefined) {
      const removedRuleIndex = this.ruleIndices[selector]
      sheet.deleteRule(removedRuleIndex)
    }
  }

  private syncIndices(sheet: CSSStyleSheet): void {
    const rules = sheet.rules as CSSRuleList
    Object.entries(rules).forEach(([key, value]) => {
      const rule = value as CSSPageRule
      if (this.ruleIndices[rule.selectorText] !== undefined) {
        this.ruleIndices[rule.selectorText] = parseInt(key, 10)
      }
    })
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
