import {ISettingsChangeObserver, IWixSDK, IWixService} from './types'
import {WixService} from './WixService'

/**
 * SettingsChangeObserver
 */
export class SettingsChangeObserver implements ISettingsChangeObserver {
  private readonly wixService: IWixService
  private variablesToObserve: string[]
  constructor(wixSdk: IWixSDK) {
    console.log('wix sdk in settings change observer', wixSdk)
    this.wixService = new WixService(wixSdk)
  }

  public forVariables = (variableArray: string[]): SettingsChangeObserver => {
    this.variablesToObserve = variableArray
    return this
  }

  public updateOnChange = (updateCallback: (changedValues: {[variable: string]: string | undefined}) => void): void => {
    this.wixService.onStyleParamsChange(userSettings => {
      const updatedValues = this.variablesToObserve.reduce((variableMap, variable) => {
        return {...variableMap, [variable]: userSettings[variable]}
      }, {})
      updateCallback(updatedValues)
    })
  }
}

export default SettingsChangeObserver
