# WIX UI TPA Connected

Integrating WIX UI TPA components made simple.

This library carries a pre-bundled wrapped version of "wix-ui-tpa" components with additional ability to connect them to application settings using component props.

---

## Component Usage

Library contains wrappers for all components available inside "wix-ui-tpa". Component documentation can be found here:
https://wix-wix-ui-tpa.surge.sh

In order to run "wix-ui-tpa-connected" on OOI/SSR environment in Wix one needs to wrap root component of their app or widget with a HOC:

```javascript
import {withWutc} from 'wix-ui-tpa-connected/withWutc'

class RootComponent...

export default withWutc(RootComponent)
```

Component integration example:

```javascript
import {Text} from 'wix-ui-tpa-connected/Text'

class SomeComponent extends React.Component {
  render() {
    return (
      <div className="App">
        <Text>Some stunning text 1</Text>
        <Text>Some stunning text 2</Text>
        <Text>Some stunning text 3</Text>
        <Text>Some stunning text 4</Text>
      </div>
    )
  }
}
```

Example of connection to settings:

```javascript
<Text settings={{MainTextColor: 'someSettingsKey'}} />
```

Keys of settings correspond to Stylable variable names available for this component in the original "wix-ui-tpa" library. For example - documentation about available variables for Text can be found here:
https://wix-wix-ui-tpa.surge.sh/?path=/story/components--text

Look for similar code example in documentation:

```
:import {
    -st-from: "wix-ui-tpa/Text/Text.st.css";
    -st-default: TPAText;
}

.root {
    -st-mixin: TPAText(
            MainTextColor '"--textColor"',
            MainTextFont '"--textFont"'
    );
}
```

Based on code fragment above - there are 2 variables available: "MainTextColor" and "MainTextFont". These can be connected to settings.

Connected components also support all additional props which are available in original "wix-ui-tpa" components:

```javascript
<Text typography="largeTitle" />
```

Notice that typography is derived from original "wix-ui-tpa" component.

---

## Interaction API Through Reference

Some WIX UI TPA components may have APIs exposed through reference. In "WIX UI TPA Connected" this reference can be obtained using "getApi" method:

```javascript
<StatesButton
  disabled={false}
  ref={this.statesButtonRef}
  onClick={() => {
    this.statesButtonRef.current.getApi().onProgressReset()
  }}
  text="My States Button"
/>
```

Above example code differs from original "WIX UI TPA" components only by usage of "getApi()". All remaining code is identical.

---

## Forced Style Override And Customization

Sometimes situations occur when components need to be customized by providing custom variable values. Example of such values:

- Fixed styles which cannot be achieved using supported component attributes and their values.
- Connection to settings with non-standard default value to be used if settings are not yet defined in settings panel.

**Important:** Providing customs styles may cause inconsistent style on site and may also break component should styles of original component change.

Before choosing to override styles it should be attempted to:

- Raise with UX that design is not consistent with what is supported by TPA components.
- Extend TPA components with missing design.

Syntax example for overriding:

```javascript
<Text
  forcedStyleOverride={{
    MainTextFont: `"fallback(font(--pageTitleFonts), font({theme: 'Page-title', size: '26px'}))"`,
    MainTextColor: 'red',
  }}
/>
```

Values provided under "forcedStyleOverride" are parsed using "Wix Style Processor" (if needed) and then injected directly into CSS. When using "Wix Style Processor" syntax, whole expression needs to be wrapped with additional double quotes.

**Important:** Same variable should never be provided both under "settings" and "forcedStyleOverride".

---

## Next Steps for Contributors

- Re-export constants from original "wix-ui-tpa"
- TypeScript suggestions
- Regression testing
- Life-cycle publishing automation
- Various optimizations
- Logging during build to make errors more clear
- Ability to provide custom configuration for non standard component file structures
