# WIX UI TPA Connected

Integrating WIX UI TPA components made simple.

This library carries a pre-bundled wrapped version of "wix-ui-tpa" components with additional ability to connect them to application settings using component props.

## Component Usage

Library contains wrappers for all components available inside "wix-ui-tpa". Component documentation can be found here:
https://wix-wix-ui-tpa.surge.sh

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

in settings panel (e.g. using editor-uI-lib)

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

## Next Steps for Contributors

- Support for frameless and SSR (WIP)
- Allow adding custom values to component variables.
- Re-export constants from original "wix-ui-tpa"
- TypeScript suggestions
- Regression testing
- Life-cycle publishing automation
- Various optimizations
- Logging during build to make errors more clear
- Ability to provide custom configuration for non standard component file structures
