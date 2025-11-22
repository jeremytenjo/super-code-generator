import path from 'path'
import fs from 'fs'
import {
  SuperCodeGeneratorConfigSchema,
  SuperCodeGeneratorTemplateSchema,
} from '../../src'

// React component example
const reactComponent: SuperCodeGeneratorTemplateSchema<any> = {
  type: 'React Component',
  hooks: {
    onCreate: async ({ outputPath, componentName }) => {
      // do things here
      console.log({
        outputPath,
        componentName,
      })
    },
  },
  params: [
    {
      name: 'hello',
      description: 'hello world',
      type: 'input',
    },
  ],
  files: [
    {
      path: ({ name, helpers: { changeCase } }) => changeCase.paramCase(name) + '.tsx',
      template: ({ name, helpers: { wrapInTemplateLiteral, changeCase } }) => `
      import React from 'react';
      import styles from './${changeCase.paramCase(name)}.css';
      
      export default function ${changeCase.pascalCase(name)}() {
        return (
          <div className={${wrapInTemplateLiteral({ text: 'styles.wrapper' })}}>
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
    onCreate: ({ outputPath, componentName }) => {
      const functionsFile = path.join(outputPath, 'functions', 'src', 'functions.ts')
      fs.appendFileSync(
        functionsFile,
        `export * as ${componentName} from "./${componentName}/${componentName}.js"\n`,
      )
    },
  },
  options: {
    createNamedFolder: false,
    outputInRootFolder: true,
  },
}

// Story example
const story: SuperCodeGeneratorTemplateSchema<any> = {
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
          <div className={${wrapInTemplateLiteral({ text: 'styles.wrapper' })}}>
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

// Component with file selection example
const componentWithFile: SuperCodeGeneratorTemplateSchema<any> = {
  type: 'Component with Config',
  params: [
    {
      name: 'configFile',
      description: 'Select a configuration file',
      type: 'file',
    },
  ],
  files: [
    {
      path: ({ name, helpers: { changeCase } }) => changeCase.paramCase(name) + '.tsx',
      template: ({ name, helpers: { changeCase }, params }) => `
      import React from 'react';
      // Configuration from: ${params?.configFile || 'no file selected'}
      
      export default function ${changeCase.pascalCase(name)}() {
        return <div>${name}</div>;
      }
        `,
    },
  ],
}

// Component with tags selection example
// Define the params schema for proper typing
type ComponentWithTagsParams = {
  tags: { name: string }[]
}

const componentWithTags: SuperCodeGeneratorTemplateSchema<any, ComponentWithTagsParams> =
  {
    type: 'Component with Tags',
    params: [
      {
        name: 'tags',
        description: 'Select tags for the component',
        type: 'input',
        tags: [
          {
            name: 'admin',
          },
        ],
      },
    ],
    files: [
      {
        path: ({ name, helpers: { changeCase } }) => changeCase.paramCase(name) + '.tsx',
        template: ({ name, helpers: { changeCase }, params }) => {
          // Now params.tags is properly typed as { name: string }[] | undefined
          const tagsList = params?.tags
            ? params.tags.map((tag) => tag.name).join(', ')
            : 'no tags'
          return `
      import React from 'react';
      // Tags: ${tagsList}
      
      export default function ${changeCase.pascalCase(name)}() {
        return <div>${name}</div>;
      }
        `
        },
      },
    ],
  }

// Type the config array - when templates have different param types, use a union type or 'any'
// For full type safety on individual templates, type each template separately (as shown above)
const config: SuperCodeGeneratorConfigSchema<any> = [
  reactComponent,
  cloudFunctionTemplate,
  story,
  componentWithFile,
  componentWithTags,
]

export default config
