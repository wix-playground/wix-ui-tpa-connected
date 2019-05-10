
import {ColorProperty, FontFamilyProperty, FontSizeProperty, LineHeightProperty} from 'csstype'

/**
 * IWixService
 * {Function} getStyleParams - returns a promise that resolves to an array of 3 values
 *    SiteColors - array of site color definitions e.g. [{name: 'color_1', value: '#FFF', reference: 'white/black'},]
 *    SiteTextPresets - object of site text preset definitions e.g. {'Body-L': {editorKey: 'font_7', }}
 */
export interface IWixService {
  /**
   *   @param {getStyleParams} - returns a promise that resolves to an array of 3 values -
   *  SiteColors array, SiteTextPresets object, user defined style params object
   *  @param {onStyleParamsChange} - takes a callback function thats is called every time user
   *  settings are changed with new style params
   */
  getStyleParams(): [ISiteColor[], ISiteTextPresets, IStyleParams]
  onStyleParamsChange(callback: (data: IUserSettings) => void): void
}

/**
 * ISettingsChangeObserver
 */
export interface ISettingsChangeObserver {
  forVariables(variablesArray: string[]): ISettingsChangeObserver
  updateOnChange(updateCallback: (changedValues: {[variable: string]: string | undefined}) => void): void
}

/**
 * IWixSDK
 */
export interface IWixSDK {
  Styles: IWixSDKStyle
  Events: IWixEvents
  addEventListener(event: string, callback: () => void): number
  removeEventListener(event: string, listenerId: number): void
}
/**
 * IUserSettings
 */
export interface IUserSettings {
  [variable: string]: string
}

/**
 * IWixEvents
 */
export interface IWixEvents {
  STYLE_PARAMS_CHANGE: string
}

/**
 * IWixSdkStyle
 */
export interface IWixSDKStyle {
  getSiteTextPresets(): ISiteTextPresets
  getSiteColors(): ISiteColor[]
  getStyleParams(): IStyleParams
}

/**
 * ISiteColor
 */
export interface ISiteColor {
  name: string
  value: string
  reference: string
}

/**
 * ETextStylePresets
 */
export enum ETextStylePresets {
  /**
   * Body-L
   */
  BodyL = 'Body-L',
  /**
   * Body-M
   */
  BodyM = 'Body-M',
  /**
   * Body-S
   */
  BodyS = 'Body-S',
  /**
   * Body-XS
   */
  BodyXS = 'Body-XS',
  /**
   * Heading-L
   */
  HeadingL = 'Heading-L',
  /**
   * Heading-M
   */
  HeadingM = 'Heading-M',
  /**
   * Heading-S
   */
  HeadingS = 'Heading-S',
  /**
   * Heading-XL
   */
  HeadingXL = 'Heading-XL',
  /**
   * Page-title
   */
  PageTitle = 'Page-title',
  /**
   * Title
   */
  Title = 'Title',
  /**
   * Menu
   */
  Menu = 'Menu',
}

/**
 * ISiteTextPresets
 */
export interface ISiteTextPresets {
  [ETextStylePresets.BodyL]: ISiteFontDefinition
  [ETextStylePresets.BodyM]: ISiteFontDefinition
  [ETextStylePresets.BodyS]: ISiteFontDefinition
  [ETextStylePresets.BodyXS]: ISiteFontDefinition
  [ETextStylePresets.HeadingL]: ISiteFontDefinition
  [ETextStylePresets.HeadingM]: ISiteFontDefinition
  [ETextStylePresets.HeadingS]: ISiteFontDefinition
  [ETextStylePresets.HeadingXL]: ISiteFontDefinition
  [ETextStylePresets.PageTitle]: ISiteFontDefinition
  [ETextStylePresets.Title]: ISiteFontDefinition
  [ETextStylePresets.Menu]: ISiteFontDefinition
  [preset: string]: ISiteFontDefinition
}

/**
 * ISiteFontDefinition
 */
export interface ISiteFontDefinition {
  editorKey: string
  fontFamily: FontFamilyProperty
  lineHeight: LineHeightProperty<string>
  size: FontSizeProperty<string>
  value: string // value: font:normal normal normal 15px/1.4em proxima-n-w01-reg,sans-serif;
  weight: string
}

/**
 * IStyleParams
 */
export interface IStyleParams {
  booleans: IStyleParamWithValue // need to double check validity of this interface
  colors: IColorStyleParams
  fonts: IFontStyleParams
  numbers: IStyleParamWithValue // need to double check validity of this interface
  [key: string]: IStyleParamWithValue
}

/**
 * IValueParam
 */
export interface IValueParam {
  value: string
}

/**
 * IColorStyleParams
 */
export interface IColorStyleParams {
  [variableKey: string]: IColorValue | IThemedColorValue
}
/**
 * IStyleParamWithValue
 */
export interface IStyleParamWithValue {
  [variableKey: string]: IValueParam
}

/**
 * IColorValue
 */
export interface IColorValue {
  value: ColorProperty
}

/**
 * IThemedColorValue
 */
export interface IThemedColorValue extends IColorValue {
  themeName: string
}

/**
 * IFontStyleParams
 */
export interface IFontStyleParams {
  [variableKey: string]: IFontStyle
}

/**
 * IFontStyle
 */
export interface IFontStyle {
  displayName: string
  editorKey: string
  family: FontFamilyProperty
  fontStyleParams: boolean
  preset: ETextStylePresets
  size: number
  value: string
  style: IFontStyleFlags
}

/**
 * IFontStyleFlags
 */
export interface IFontStyleFlags {
  bold: boolean
  italic: boolean
  underline: boolean
}
