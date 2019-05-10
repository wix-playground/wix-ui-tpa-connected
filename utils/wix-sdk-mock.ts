/* istanbul ignore file */
import { ETextStylePresets, IWixSDK } from './types'
/**
 * siteColors
 */
export const siteColors = [{ name: 'name', value: '#fff', reference: 'some-color-reference' }]

/**
 * userStyles
 */
export const userStyles = {
  booleans: {},
  numbers: {},
  fonts: {
    myMainFont: {
      displayName: 'font',
      editorKey: '',
      family: 'helvetica',
      fontStyleParams: false,
      preset: ETextStylePresets.BodyM,
      size: 12,
      value: 'something',
      style: {
        bold: false,
        italic: false,
        underline: false,
      },
    },
  },
  colors: {
    someSettingsColor: { value: 'red' },
  },
}

/**
 * defaultFontDefinition
 */
export const defaultFontDefinition = {
  editorKey: '',
  fontFamily: 'helvetica',
  lineHeight: '12px',
  size: '12px',
  value: 'stuff helvetica',
  weight: 'bold',
}

/**
 * siteTextPresets
 */
export const siteTextPresets = {
  'Body-L': defaultFontDefinition,
  'Body-M': {...defaultFontDefinition, value: 'font:normal normal normal 15px/1.4em proxima-n-w01-reg,sans-serif;'},
  'Body-S': defaultFontDefinition,
  'Body-XS': defaultFontDefinition,
  'Heading-L': defaultFontDefinition,
  'Heading-M': defaultFontDefinition,
  'Heading-S': defaultFontDefinition,
  'Heading-XL': defaultFontDefinition,
  'Page-title': defaultFontDefinition,
  'Title': defaultFontDefinition,
  'Menu': defaultFontDefinition,
}

/**
 * sdkMock
 */
export const sdkMock: IWixSDK = {
  Styles: {
    getSiteTextPresets: () => siteTextPresets,
    getSiteColors: () => siteColors,
    getStyleParams: () => userStyles,
  },
  // istanbul ignore next
  addEventListener: (e: string, callback: () => void) => 0,
  // istanbul ignore next
  removeEventListener: (e: string, id: number) => {
    // do nothing
  },
  Events: {
    STYLE_PARAMS_CHANGE: 'probably_style_change',
  },
}
