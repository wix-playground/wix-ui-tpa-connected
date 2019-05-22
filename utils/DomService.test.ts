import domService from 'wix-style-processor/dist/src/domService'
import {DomServiceFactory} from './DomService'
import {StylesheetHandler} from './StylesheetHandler'
describe('DomServiceFactory', () => {

  it('should have access to wix-style-processor\'s DomService to override it', () => {
    expect(!!domService.getAllStyleTags).toBeTruthy()
    expect(!!domService.overrideStyle).toBeTruthy()
  })
  describe('buildNewDomService()', () => {
    it ('should return wix-style-processor compliant domService object with overwritten functions', () => {
      const domServiceFactory = new DomServiceFactory(new StylesheetHandler({} as any, 'hash'))
      const customDomService = domServiceFactory.buildNewDomService('some initial css styles')
      expect(!!customDomService.getAllStyleTags).toBeTruthy()
      expect(!!customDomService.overrideStyle).toBeTruthy()
    })
  })
})
