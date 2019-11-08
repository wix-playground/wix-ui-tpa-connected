# WIX UI TPA Connected

Integrating WIX UI TPA components made simple.

This library carries a pre-bundled wrapped version of "wix-ui-tpa" components with additional ability to connect them to application settings using component props.

**Current state summary:**

- Build script is only available as a CLI tool (_wix-ui-tpa-connected-css-builder_) - WebPack plugin is not yet implemented.
- Components are usable.
- Other todos are listed at the bottom of this page.

**Pros:**

- Much less boilerplate when consuming components.
- All properties and API of original "WIX UI TPA" is available.
- Dependency on Stylable becomes optional (i.e. to avoid using multiple style pre-processors in parallel).
- Ability to re-use rules for connecting to settings.
- All heavy-lifting is performed at built time - there is no runtime logic except for automatically adding a namespace class to the component.

**Cons:**

- Complex build procedure which is currently likely to build a broken "wix-ui-tpa-connected" version.
- Possibly slightly larger bundle size. Since components are built separately, there is a chance of some code duplication in those bundles.
- There is a possibility that a fraction of components would not work properly. For example "Grid" currently also exports "Grid.Item" and "WIX UI TPA Connected" is not yet capable of exporting "Item" under "Grid" in this way.

**Best practices:**

- Use a fixed version of "WIX UI TPA Connected" in "package.json" for now. Should new version break some components, it would not impact your project.
- Should a certain component not work properly in "WIX UI TPA Connected", "WIX UI TPA" component can be used directly - usage of both libraries at the same time should not cause problems.
- It would be best not to import **same** component from both "WIX UI TPA Connected" and "WIX UI TPA" in different places of the same project in order not to increase bundle size unnecessarily.

---

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

```JavaScript
<Text settings="myConnection" />
```

In order for above code to work, "myConnection" needs to be specified in a JSON config file inside a project. Path and name to this file can be configured at build time. However, for consistency reasons it is advised to use: "someProject/settings-panel.json".

Example of JSON including "myConnection" rule:

```json
{
  "Text": {
    "myConnection": {
      "MainTextColor": "\"color(--myTextColor)\""
    },
    "someOtherConnection": {
      "MainTextColor": "green"
    }
  }
}
```

"MainTextColor" is connected to "eventLinkColor" key using "wix-style-processor" syntax.

Things like ugly double quotes which enable style processor parsing could be removed in the future by adding some additional magic into the build script. This is left for future improvements.

JSON structure above should be understood as follows:

| Level | Meaning         | Explanation                                                                                                         |
| ----- | --------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1st   | TPA Component   | Corresponds to `<Text />`                                                                                           |
| 2nd   | Connection Name | Developer-provided string which will be used in "settings" property like this: `<Text settings="connectionName" />` |
| 3rd   | Variable Name   | Stylable variable name supported in original "wix-ui-tpa" library                                                   |

**Important!** In order for settings rules to be operational, project must be built using "wix-ui-tpa-connected-css-builder" tool.

_Stylable_ variable names can be found in "wix-ui-tpa" documentation:
https://wix-wix-ui-tpa.surge.sh/?path=/story/components--text

Look for similar code example there:

```css
:import {
  -st-from: 'wix-ui-tpa/Text/Text.st.css';
  -st-default: TPAText;
}

.root {
  -st-mixin: TPAText(MainTextColor '"--textColor"', MainTextFont '"--textFont"');
}
```

Based on code fragment above - there are 2 variables available: "MainTextColor" and "MainTextFont".

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

## Next Steps for Contributors

- Create a definition file in "wix-ui-tpa" listing all components, where they are defined and how they are exported. For example grid item needs to be exported as "Grid.Item".
- Externalize Stylable variable analysis to Stylable itself and remove double-build procedure. Stylable could provide meta information about what variables have been used and where their values landed.
- Re-export constants from original "wix-ui-tpa".
- Add TS definition files and support TypeScript suggestions.
- Create a regression testing solution to make sure that new versions do not miss any components or features from previous version.
- Implement life-cycle publishing automation to publish "connected" library as soon as "wix-ui-tpa" is updated.
- Sync versions between WIX UI TPA and WIX UI TPA Connected allowing for independent fixes inside "wix-ui-tpa-connected". Probably need one additional npm package to allow that.
- Implement logging during build to make errors more clear.
