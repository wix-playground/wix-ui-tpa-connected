import * as React from 'react'

/**
 * docs
 */
export const WutcContext = React.createContext(null)

/**
 * docs 2
 */
export const withWutc = (children: any) => (props: any) => {
  return React.createElement(WutcContext.Provider, {value: props}, React.createElement(children, props))
}
  // (<WutcContext.Provider value={{
  //   ...props,
  // }}>
  // {children}
  // </WutcContext.Provider>)

/**
 * docs 3
 */
export const getContext = (component: any) => React.forwardRef((props: any, ref: any) =>
  React.createElement(WutcContext.Consumer, {}, (wutcContext: any) => React.createElement(component, {
    ...props, ref, wutcContext,
  })),
)

/**
 * export const getContext = component => React.forwardRef((props, ref) => (
  <WutcContext.Consumer>
    {wutcContext =>
React.createElement(component, { ...props, wutcContext, ref })
    }
< /WutcContext.Consumer>
))

 */
