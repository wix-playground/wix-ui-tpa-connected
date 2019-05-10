import domService from 'wix-style-processor/dist/src/domService'
import {IStylesheetHandler} from './StylesheetHandler'

/**
 * DomServiceFactory
 */
export class DomServiceFactory {
  constructor(private readonly stylesheetHandler: IStylesheetHandler) {}

  public buildNewDomService(css: string) {
    const newDomService = {
      ...domService,
    }
    newDomService.getAllStyleTags = () => {
      const style = this.stylesheetHandler.createFragment(css)
      return ([style] as unknown) as NodeListOf<
        Element>
    }

    newDomService.overrideStyle = (tag, newCss) => {
      this.stylesheetHandler.createTagWithContent(newCss)
    }

    return newDomService
  }
}
