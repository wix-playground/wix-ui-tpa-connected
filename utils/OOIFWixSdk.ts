import { IWixSDK } from './types'
// tslint:disable-next-line
interface ICallback { (data: any): void }

interface IListener {
  [eventName: string]: {
    [id: number]: ICallback,
  }
}
/**
 * "Fake WixSdk for Out Of IFrame context"
 */
export class OOIFWixSdk implements IWixSDK {
  public Utils = {
    getViewMode: () => this.viewMode,
  }

  public Styles = {
    getSiteColors: () => this.styles.siteColors,
    getSiteTextPresets: () => this.styles.siteTextPresets,
    getStyleParams: () => this.styles.styleParams,
  }

  public Events = {
    STYLE_PARAMS_CHANGE: 'STYLE_PARAMS_CHANGE',
  }
  private listeners: IListener = {}
  private eventId = 1

  constructor(private styles: any, private viewMode: string) {}

  public addEventListener(event: string, callback: (data: any) => void): number {
    this.listeners[event] = {}
    this.listeners[event][this.eventId] = callback
    return this.eventId++
  }

  public removeEventListener(event: string, eventId: number): void {
    delete this.listeners[event][eventId]
  }

  public triggerStyleChange(styles: any): any {
    for (const listener in this.listeners[this.Events.STYLE_PARAMS_CHANGE]) {
      if (listener) {
        this.listeners[this.Events.STYLE_PARAMS_CHANGE][listener]([
          styles.siteColors,
          styles.siteTextPresets,
          styles.styleParams,
        ])
      }
    }
  }
}
