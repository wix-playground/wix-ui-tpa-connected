import {StyleInjector} from './StyleInjector'

describe('StyleInjector', () => {
  describe('updateStyles', () => {
    it('works?', () => {
      const injector = new StyleInjector({} as any, 'hash')
      expect(!!injector).toBe(true)
    })
  })
})
