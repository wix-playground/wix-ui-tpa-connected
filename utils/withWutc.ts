import * as React from 'react'

/**
 * Context to pass style props in Out of IFrame components to WUTC components
 */
export const WutcContext = React.createContext(null)

/**
 * HOC to consume style props - consumed by WUTC user
 */
export const withWutc = (children: any) => (props: any) => {
  return React.createElement(WutcContext.Provider, {value: props}, React.createElement(children, props))
}
/**
 * HOC to pass style props to WUT wrapper only. Not used by WUTC consumer
 */
export const getContext = (component: any) => React.forwardRef((props: any, ref: any) =>
  React.createElement(WutcContext.Consumer, {}, (wutcContext: any) => React.createElement(component, {
    ...props, ref, wutcContext,
  })),
)
