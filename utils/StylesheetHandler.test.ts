import {MockDocument} from './lib/mocks'
import {IStylesheetHandler, StylesheetHandler} from './StylesheetHandler'

describe('StylesheetHandler: service to interact with stylesheets in the DOM', () => {
  let documentMock: any
  let hash: string
  let stylesheetHandler: IStylesheetHandler
  let stylesheetId: string
  beforeEach(() => {
    documentMock = new MockDocument()
    hash = 'uniqueHash'
    stylesheetHandler = new StylesheetHandler(documentMock as any, hash)
    stylesheetId = 'test-stylesheet'
  })
  describe('insertRule()', () => {
    it('should create a stylesheet with unique ID if it doesnt exist on the DOM when adding css rule', () => {
      const selector = '.selector'
      const cssRule = 'color: red'
      stylesheetHandler.insertRule(selector, cssRule)
      const styleData = documentMock.getAddedElements()[0]

      expect(styleData.id).toBe(`${hash}`)
      expect(styleData.sheet.rules.length).toEqual(1)
      expect(styleData.sheet.rules[0].css).toEqual(`.${hash}${selector} {${cssRule}}`)
    })

    it('should replace old rules when inserting new one on the same selector', () => {
      const selector = '.selector'
      const cssRule = 'color: red'
      stylesheetHandler.insertRule(selector, cssRule)

      const updatedRule = 'color: blue'
      stylesheetHandler.insertRule(selector, updatedRule)

      const styleData = documentMock.getAddedElements()[0]
      expect(styleData.sheet.rules.length).toEqual(1)
      expect(styleData.sheet.rules[0].css).toEqual(`.${hash}${selector} {${updatedRule}}`)
    })

    it('should properly update rules, even when they are with different selectors', () => {
      const selector1 = '.selector'
      const rule1 = 'color: red'

      const selector2 = '.another'
      const rule2 = 'background: blue'

      const selector3 = '.third'
      const rule3 = 'border: 1px solid green'
      stylesheetHandler.insertRule(selector1, rule1)
      stylesheetHandler.insertRule(selector2, rule2)
      stylesheetHandler.insertRule(selector3, rule3)

      const styleData = documentMock.getAddedElements()[0]
      expect(styleData.sheet.rules.length).toBe(3)
      expect(styleData.sheet.rules[0].css).toBe(`.${hash}${selector1} {${rule1}}`)
      expect(styleData.sheet.rules[1].css).toBe(`.${hash}${selector2} {${rule2}}`)
      expect(styleData.sheet.rules[2].css).toBe(`.${hash}${selector3} {${rule3}}`)

      stylesheetHandler.insertRule(selector3, rule1)
      stylesheetHandler.insertRule(selector1, rule2)
      stylesheetHandler.insertRule(selector2, rule3)

      const updatedStyleData = documentMock.getAddedElements()[0]
      expect(updatedStyleData.sheet.rules.length).toBe(3)
      expect(updatedStyleData.sheet.rules[0].css).toBe(`.${hash}${selector3} {${rule1}}`)
      expect(updatedStyleData.sheet.rules[1].css).toBe(`.${hash}${selector1} {${rule2}}`)
      expect(updatedStyleData.sheet.rules[2].css).toBe(`.${hash}${selector2} {${rule3}}`)
    })

    it('should wrap given css with @media if its provided', () => {
      const selector = '.selector'
      const cssRule = 'color: red'
      const mediaQuery = 'only screen and (max-width:600px)'

      stylesheetHandler.insertRule(selector, cssRule, mediaQuery)

      const stylesheet = documentMock.getAddedElements()[0].sheet
      expect(stylesheet.rules[0].css).toBe(`@media ${mediaQuery} {.${hash}${selector} {${cssRule}}}`)
    })
  })

  describe('createTagWithContent()', () => {
    it('should create a style tag with given content for default styles', () => {
      const cssContent = '.selector1 { color: red } .selector2 {background: green }'

      stylesheetHandler.createTagWithContent(cssContent)
      const style = documentMock.getAddedElements()[0]
      expect(style.textContent).toBe(cssContent)
      expect(style.id).toBe(`${hash}-default-style`)
    })
  })

  describe('createFragment()', () => {
    it('should create a document fragment with given css string as content', () => {
      const cssContent = '.selector1 { color: red } .selector2 {background: green }'
      const fragment = stylesheetHandler.createFragment(cssContent)
      expect(fragment.textContent).toBe(cssContent)
    })
  })
})
