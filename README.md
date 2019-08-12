# WIX UI TPA Connected

Integrating WIX UI TPA components made simple.

This library carries a pre-bundled wrapped version of "wix-ui-tpa" components with additional ability to connect them to application settings using component props.

## Component Usage

Library contains wrappers for all components available inside "wix-ui-tpa". Component documentation can be found here:
https://wix-wix-ui-tpa.surge.sh

In order for components to work in OOI and SSR, please use provided HOC (see "Frameless support" below).

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

In settings panel (e.g. using editor-uI-lib)

```javascript
<UI.colorPickerInput wix-param={'someSettingsKey'} />
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

## APIs through ref

Some WIX UI TPA components may have APIs exposed through ref. For example:

```javascript
<StatesButton
	disabled={false}
	ref={this.statesButtonRef}
	onClick={() => {
		this.statesButtonRef.current.onProgressReset()
	}}
	text="My States Button"
/>
```

This API is forwarded to "WIX UI TPA Connected" via "getApi" method:

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

## Frameless support

In order to run "wix-ui-tpa-connected" on frameless environment in Wix one needs to wrap root component of their app or widget with a HOC:

```javascript
import {withWutc} from 'wix-ui-tpa-connected/withWutc'

class RootComponent...

export default withWutc(RootComponent)
```

## Next Steps for Contributors

- Allow adding custom values to component variables.
- Re-export constants from original "wix-ui-tpa"
- TypeScript suggestions
- Regression testing
- Life-cycle publishing automation
- Various optimizations
- Logging during build to make errors more clear
- Ability to provide custom configuration for non standard component file structures
