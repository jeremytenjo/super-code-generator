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
    onCreate: async ({ outputPath }) => {
      console.log(outputPath)
      cp.exec(`cd ${outputPath} && touch file_name.txt`)
    },
  },
  files: [
    {
      path: ({ name, helpers: { changeCase } }) => changeCase.paramCase(name) + '.tsx',
      template: ({ name, helpers: { wrapInTemplateLiteral, changeCase } }) => `
      import React from 'react';
      import styles from './${changeCase.paramCase(name)}.css';
      
      export default function ${changeCase.pascalCase(name)}() {
        return (
          <div className={${wrapInTemplateLiteral('styles.wrapper')}}>
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
const functionsFolderPath = path.join(process.cwd(), 'functions')
const cloudFunction = {
  path: ({ name }) => path.join(functionsFolderPath, 'src', name, `${name}.ts`),
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
    onCreate: () => {
      const functionsFile = path.join(functionsFolderPath, 'src', 'functions.ts')
      fs.appendFileSync(functionsFile, 'data to append')
    },
  },
  options: {
    createNamedFolder: false,
  },
}

// Story example
const story: SuperCodeGeneratorTemplateSchema = {
  type: 'Story',
  outputWithoutParentDir: true,
  files: [
    {
      path: ({ name, helpers: { changeCase } }) =>
        'stories/' + changeCase.paramCase(name) + '.stories.tsx',
      template: ({ name, helpers: { wrapInTemplateLiteral, changeCase } }) => `
      import React from 'react';
      import styles from './${changeCase.paramCase(name)}.css';
      
      export default function ${changeCase.pascalCase(name)}() {
        return (
          <div className={${wrapInTemplateLiteral('styles.wrapper')}}>
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
