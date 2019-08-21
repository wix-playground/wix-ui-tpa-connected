import {ISiteColor, ISiteTextPresets, IStyleParams, IUserSettings, IWixSDK, IWixService} from './types'

/**
 * WixService
 */
export class WixService implements IWixService {
  public listenToStyleParamsChange = this.onStyleParamsChange
  private eventListenerId: number = null
  constructor(private readonly WixSdk: IWixSDK) {}

  public getStyleParams(): Promise<[ISiteColor[], ISiteTextPresets, IStyleParams]> {
    return Promise.all([this.getSiteColors(), this.getTextPresets(), this.getUserStyles()])
  }

  public onStyleParamsChange(callback: (data: IUserSettings) => void) {
    if (this.eventListenerId !== null) {
      this.WixSdk.removeEventListener(this.WixSdk.Events.STYLE_PARAMS_CHANGE, this.eventListenerId)
    }

    this.eventListenerId = this.WixSdk.addEventListener(this.WixSdk.Events.STYLE_PARAMS_CHANGE, () => {
      this.callWithStyleValueMap(callback)
    })
    this.callWithStyleValueMap(callback)
  }

  public isEditorMode(): boolean {
    return this.WixSdk.Utils.getViewMode() === 'editor'
  }

  public isPreviewMode(): boolean {
    return this.WixSdk.Utils.getViewMode() === 'preview'
  }

  public isStandaloneMode(): boolean {
    return this.WixSdk.Utils.getViewMode() === 'standalone'
  }

  public shouldRunAsStandalone(): boolean {
    return this.isStandaloneMode() || this.withoutStyleCapabilites()
  }

  public withoutStyleCapabilites(): boolean {
    return !this.WixSdk.Styles
  }

  private readonly callWithStyleValueMap = (callback: (styleValues: IUserSettings) => void) => {
    this.getStyleParams().then(([siteColors, siteTextPresets, userStyleData]) => {
      if (userStyleData) {
        const flattenedUserStyleParams = this.extractUserStyleValues(userStyleData)([
          'fonts',
          'colors',
          'numbers',
          'booleans',
        ])
        const siteColorMap = this.extractSiteColorValues(siteColors)
        const siteFontsMap = this.extractSiteFontValues(siteTextPresets)
        callback({...flattenedUserStyleParams, ...siteColorMap, ...siteFontsMap})
      }
    })
  }

  private readonly extractSiteColorValues = (siteColors: ISiteColor[]) => {
    return siteColors.reduce(
      (siteColorsMap, colorDefinition) => {
        return {
          ...siteColorsMap,
          [colorDefinition.name]: colorDefinition.value,
          [colorDefinition.reference]: colorDefinition.value,
        }
      },
      {black: '#000000', white: '#FFFFFF'},
    )
  }

  private readonly extractSiteFontValues = (siteFonts: ISiteTextPresets) => {
    return Object.keys(siteFonts).reduce((siteFontsMap, key) => {
      return {...siteFontsMap, [key]: this.removeFontPrefixIfExists(siteFonts[key].value)}
    }, {})
  }
  private readonly extractUserStyleValues = (valueObject: IStyleParams) => (styleProperties: string[]) =>
    styleProperties.reduce((flattenedUsersValues, property) => {
      return {
        ...flattenedUsersValues,
        ...Object.keys(valueObject[property]).reduce((userSettingsMap, key) => {
          const fontInfo = valueObject[property][key] as any
          const fontStyle = fontInfo.style
          let fontString = valueObject[property][key].value

          if (!fontString) {
            const fontStringParts = [
              fontStyle.italic ? 'italic' : 'normal',
              'normal',
              fontStyle.bold ? 'bold' : 'normal',
              `${fontInfo.size}px/1.4em`,
              `${fontInfo.family},sans-serif`,
            ]

            fontString = 'font:' + fontStringParts.join(' ') + ';'
          }

          return {...userSettingsMap, [key]: this.removeFontPrefixIfExists(fontString)}
        }, {}),
      }
    }, {})

  private readonly removeFontPrefixIfExists = (styleValue: string) => {
    if (styleValue.includes('font')) {
      return styleValue.replace(/^font\s*:\s*/, '')
    }

    return styleValue
  }

  private readonly getSiteColors = (): ISiteColor[] => this.WixSdk.Styles.getSiteColors()
  private readonly getTextPresets = (): ISiteTextPresets => this.WixSdk.Styles.getSiteTextPresets()
  private readonly getUserStyles = (): IStyleParams => this.WixSdk.Styles.getStyleParams()
}
