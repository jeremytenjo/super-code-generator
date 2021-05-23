# Quick Component Creator

## Features

Quickly create component using your own templates

## Examaple

![image info](https://firebasestorage.googleapis.com/v0/b/useweb-lib.appspot.com/o/devtools%2Fplugins%2Fvscode%2Fquick-component-creator%2Fdemo.gif?alt=media&token=3183d6ec-4d96-48e2-ad77-4d669ce5b44e)

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

## Component Type properties

Propoerties passed to `path` and `template` properies

### name

### helpers

#### changeCase

#### wrapInTemplateLiteral
