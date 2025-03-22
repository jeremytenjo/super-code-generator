import cp from 'child_process'
import path from 'path'
import fs from 'fs'

import type {
  SuperCodeGeneratorConfigSchema,
  SuperCodeGeneratorTemplateSchema,
} from '@jeremytenjo/super-code-generator'

// React component example
const reactComponent: SuperCodeGeneratorTemplateSchema = {
  type: 'React Component',
  hooks: {
    onCreate: async ({ outputPath, componentName }) => {
      // do things here
    },
  },
  params:{
    hello: 'string'
  },
  files: [
    {
      path: ({ name, helpers: { changeCase } }) => changeCase.paramCase(name) + '.tsx',
      template: ({ name, helpers: { wrapInTemplateLiteral, changeCase } }) => `
      import React from 'react';
      import styles from './${changeCase.paramCase(name)}.css';
      
      export default function ${changeCase.pascalCase(name)}() {
        return (
          <div className={${wrapInTemplateLiteral({text: 'styles.wrapper'})}}>
           ${name}
          </div>
        );
      }
        `,
    },
    {
      path: ({ name, helpers: { changeCase } }) => changeCase.paramCase(name) + '.css',
      template: () => `.wrapper {}`,
    },
  ],
}

// Cloud function example
const cloudFunction = {
  path: ({ name }) => path.join('functions', 'src', name, `${name}.ts`),
  template: ({ name, helpers }) => `
  export default function ${helpers.changeCase.pascalCase(name)}() {
    return 'hello'
  }
    `,
}
const cloudFunctionTemplate: SuperCodeGeneratorTemplateSchema = {
  type: 'Cloud Function',
  files: [cloudFunction],
  hooks: {
    onCreate: ({outputPath, componentName}) => {
      const functionsFile = path.join(outputPath, 'functions', 'src', 'functions.ts')
      fs.appendFileSync(functionsFile, `export * as ${componentName} from "./${componentName}/${componentName}.js"\n`)
    },
  },
  options: {
    createNamedFolder: false,
    outputInRootFolder: true,
  },
}

// Story example
const story: SuperCodeGeneratorTemplateSchema = {
  type: 'Story',
  outputWithoutParentDir: false,
  files: [
    {
      path: ({ name, helpers: { changeCase } }) =>
        'stories/' + changeCase.paramCase(name) + '.stories.tsx',
      template: ({ name, helpers: { wrapInTemplateLiteral, changeCase } }) => `
      import React from 'react';
      import styles from './${changeCase.paramCase(name)}.css';
      
      export default function ${changeCase.pascalCase(name)}() {
        return (
          <div className={${wrapInTemplateLiteral({text: 'styles.wrapper'})}}>
           ${name}
          </div>
        );
      }
        `,
    },
    {
      path: ({ name, helpers: { changeCase } }) =>
        'stories/' + changeCase.paramCase(name) + '.css',
      template: () => `.wrapper {}`,
    },
  ],
}

const config: SuperCodeGeneratorConfigSchema = [
  reactComponent,
  cloudFunctionTemplate,
  story,
]

export default config
