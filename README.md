# Quick Component Creator

## Features

Quickly create component using your own templates

## Example

![image info](https://firebasestorage.googleapis.com/v0/b/useweb-lib.appspot.com/o/devtools%2Fplugins%2Fvscode%2Fquick-component-creator%2Fdemo.gif?alt=media&token=9f2080d3-f87a-49f7-a91b-28d95796add9)

`qcc.config.js`

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
