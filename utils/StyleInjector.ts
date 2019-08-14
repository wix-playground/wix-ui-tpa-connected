import wixStyleProcessor from 'wix-style-processor'
import {DomServiceFactory} from './DomService'
import {IStylesheetHandler, StylesheetHandler} from './StylesheetHandler'
import {WixService} from './WixService'
/**
 * StyleInjector
 */
export class StyleInjector implements IStyleInjector {
  private styleSheetHandler: IStylesheetHandler
  constructor(
    private readonly document: Document,
    private readonly componentHash: string, // hash props here locally
    private readonly wixSdk?: any,
  ) {
    this.styleSheetHandler = new StylesheetHandler(this.document, this.componentHash)
  }

  public addInitialCss(stylesheetContent: string): Promise<void> {
    /**
     *  since domService isn't directly exposed - write a test to check if such import succeeds:
     *  check that import statement returns a proper object with expected methods - better break at build than runtime
     */
    const domService = new DomServiceFactory(this.styleSheetHandler).buildNewDomService(stylesheetContent)

    if (this.wixSdk) {
      return wixStyleProcessor.init({}, domService, new WixService(this.wixSdk))
    } else {
      return wixStyleProcessor.init({}, domService)
    }
  }

  public updateComponentStyle(
    componentProps: IVariableMap,
    componentVariables: IComponentVariables,
    resolvedStyles: IVariableMap,
  ) {
    const rulesToInject = this.createCssRules(componentProps, componentVariables, resolvedStyles)
    rulesToInject.forEach((rule: ICssInjection) => {
      this.styleSheetHandler.insertRule(rule.selector, rule.cssContent, rule.mediaQuery)
    })
  }

  public generateComponentStyle(
    componentProps: IVariableMap,
    componentVariables: IComponentVariables,
    resolvedStyles: IVariableMap,
  ) {
    let style = ''

    const rulesToInject = this.createCssRules(componentProps, componentVariables, resolvedStyles)
    rulesToInject.forEach((rule: ICssInjection) => {
      style += this.styleSheetHandler.buildCssRule(rule.selector, rule.cssContent, rule.mediaQuery)
    })

    return style
  }

  public readonly createCssRules = (
    componentProps: IVariableMap,
    componentVariables: IComponentVariables,
    resolvedStyles: IVariableMap,
  ): ICssInjection[] => {
    return Object.entries(componentProps).reduce((res, [prop, variable]) => {
      const userStyle = resolvedStyles[variable]

      if (!componentVariables[prop]) {
        return res
      }

      const rulesDefinitions = componentVariables[prop]
        .map((variableDeclaration: IVariableStructure) => {
          if (userStyle) {
            return this.buildRule(variableDeclaration, userStyle)
          }

          return false
        })
        .filter(i => !!i)
      return [...res, ...rulesDefinitions]
    }, [])
  }

  private readonly buildRule = (variableDeclaration: IVariableStructure, resolvedStyle: string): ICssInjection => {
    return {
      selector: variableDeclaration.selector,
      cssContent: `${variableDeclaration.declaration}: ${resolvedStyle}`,
      mediaQuery: variableDeclaration.mediaQuery,
    }
  }
}

/**
 * IStyleInjector
 */
export interface IStyleInjector {
  addInitialCss(stylesheetContent: string): Promise<void>
  updateComponentStyle(
    componentProps: IVariableMap,
    componentVariables: IComponentVariables,
    resolvedStyles: IVariableMap,
  ): void
}

/**
 * IComponentVariables
 */
export interface IComponentVariables {
  [componentProp: string]: IVariableStructure[]
}

/**
 * IVariableStructure
 */
export interface IVariableStructure {
  mediaQuery?: string
  selector: string
  declaration: string
}

/**
 * IVariableMap
 */
export interface IVariableMap {
  [variable: string]: string
}
/**
 * IVariableMap
 */
export interface ICssInjection {
  selector: string
  cssContent: string
  mediaQuery?: string
}
