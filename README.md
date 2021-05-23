# Quick Component Creator

Quickly create component using your own templates in VS Code

![image info](https://firebasestorage.googleapis.com/v0/b/useweb-lib.appspot.com/o/devtools%2Fplugins%2Fvscode%2Fquick-component-creator%2Fdemo.gif?alt=media&token=0565012e-97b4-48a8-8d47-4bce96646658)

1. Create `qcc.schema.js`

```js
module.exports = [
  {
    type: 'React component',
    files: [
      {
        path: ({ name, helpers: { changeCase } }) =>
          changeCase.paramCase(name) + '.jsx',
        template: ({
          name,
          helpers: { wrapInTemplateLiteral, changeCase }
        }) => `
        import React from 'react';
        import styles from './${changeCase.paramCase(name)}.css';

        export default function ${changeCase.pascalCase(name)}() {
          return (
            <div className={${wrapInTemplateLiteral('styles.wrapper')}}>
             ${name}
            </div>
          );
        }
          `
      },
      {
        path: ({ name, helpers: { changeCase } }) =>
          changeCase.paramCase(name) + '.css',
        template: () => `.wrapper {}`
      }
    ]
  }
]
```

2. Click right button in mouse and selected `Create Component`
3. Pick component type
4. Add component names
5. Profit! ✨

Creates the following component when selecting type `React component` and inputting name `button`

`button.jsx`

```js
import React from 'react'
import styles from './button.css'

export default function Button() {
  return <div className={`${styles.wrapper}`}>button</div>
}
```

`button.css`

```css
.wrapper {
}
```

## Component Type properties

Properties passed to `path` and `template` functions

```js
name: 'component name input by user',
helpers: {
  changeCase: 'function to change case of a string',
  wrapInTemplateLiteral: 'helps add templates literals within a template literal'
}
```

> Pro Tip: Add a perttier config file path to format your created files.
