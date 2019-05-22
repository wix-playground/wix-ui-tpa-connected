import * as sinon from 'sinon'
import styleProcessor from 'wix-style-processor'
import {
  MockDocument,
} from './MockDocument'
import {
  StyleInjector,
} from './StyleInjector'
describe('StyleInjector', () => {
  describe('addInitialCss()', () => {
    it('should pass in initial css to style processor to do its magic', () => {
      const stub = sinon.stub(styleProcessor, 'init').callsFake(() => Promise.resolve())
      const injector = new StyleInjector({} as any, 'hash')
      injector.addInitialCss('some initial css styles')
      expect(stub.callCount).toBe(1)
      stub.restore()
    })
  })

  describe('updateComponentStyle()', () => {
    it('should inject new css rules into a stylesheet from provided configuration', () => {
      const documentMock = new MockDocument()
      const injector = new StyleInjector(documentMock as any, 'hash')
      injector.updateComponentStyle({
        color: 'textColor',
        something: 'unknown',
      }, {
        color: [{
          selector: '.component-class',
          declaration: 'color',
          mediaQuery: 'only screen and (max-width:600px)',
        } ],
        something: [{
          selector: '.other-selector[data-property="smthng"]',
          declaration: 'font-size',
        }],
      }, {
        textColor: 'red',
      })

      const styleData = documentMock.getAddedElements()[0]
      expect(styleData.sheet.rules[0].css)
        .toBe('@media only screen and (max-width:600px) {.hash.component-class {color: red}}')
    })
  })
})
