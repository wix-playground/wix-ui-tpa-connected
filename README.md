# WIX UI TPA Connected

Integrating WIX UI TPA components made simple.

This library carries a pre-bundled wrapped version of "wix-ui-tpa" components with additional ability to connect them to application settings using component props.

**Pros:**
* Much less boilerplate when consuming components.
* All properties and API of original "WIX UI TPA" is available.
* Dependency on Stylable becomes optional (i.e. to avoid using multiple style pre-processors in parallel).
* Ability to re-use or dynamically construct logic for connecting to settings.
* Works on iframes, OOI and SSR.

**Cons:**
* Complex build procedure which is currently likely to build a broken "wix-ui-tpa-connected" version.
* Possibly slightly larger bundle size. Since components are built separately, there is a chance of some code duplication in those bundles.
* There is a possibility that a fraction of components would not work properly. For example "Grid" currently also exports "Grid.Item" and "WIX UI TPA Connected" is not yet capable of exporting "Item" under "Grid" in this way.

**Best practices:**
* Use a fixed version of "WIX UI TPA Connected" in "package.json" for now. Should new version break some components, it would not impact your project.
* Should a certain component not work properly in "WIX UI TPA Connected", "WIX UI TPA" component can be used directly - usage of both libraries at the same time should not cause problems.
* It would be best not to import same component from both "WIX UI TPA Connected" and "WIX UI TPA" in different places of the same project in order not to increase bundle size unnecessarily.

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

- Create a definition file in "wix-ui-tpa" listing all components supported variables and use it instead of "wix-ui-tpa-analyser"
- Externalize Stylable variable analysis (where they appear in final CSS) to Stylable itself and remove double-build procedure
- Re-export constants from original "wix-ui-tpa"
- Add TS definition files and support TypeScript suggestions
- Create a regression testing solution to make sure that new versions do not miss any components or features from previous version
- Implement life-cycle publishing automation to publich "connected" library as soon as "wix-ui-tpa" is updated.
- Sync versions between WIX UI TPA and WIX UI TPA Connected allowing for independent fixes inside "wix-ui-tpa-connected". Probably need one additional npm package to allow that.
- Concentrate on optimizing dynamic style manipulations.
- Implement logging during build to make errors more clear
