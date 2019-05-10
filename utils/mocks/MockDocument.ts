/* istanbul ignore file */
import {
  MockCssStylesheet
} from './MockCssStylesheet'
/**
 * window.document for tests to interact with stylesheets
 */
export class MockDocument {
  public head = {
    appendChild: (item: IItemWithId) => {
      const id = item.id
      this.documentsWithIds.push({
        id,
        item,
      })
    },
  }
  private documentsWithIds: IItemWithId[] = []
  public getElementById(id: string) {
    return this.documentsWithIds.reduce((res, element) => {
      if (!res && element.id === id) {
        return element.item
      }

      return res
    }, undefined)
  }

  public createDocumentFragment() {
    return {
      textContent: '',
    }
  }

  public createElement(elementType: string) {
    switch (elementType) {
      case 'style':
        return {
          sheet: new MockCssStylesheet()
        }
    }
  }
  public getAddedElements() {
    return this.documentsWithIds.map(i => i.item)
  }
}

interface IItemWithId {
  id: string
  item: any
}