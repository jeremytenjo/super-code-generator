const cp = require('child_process')
const path = require('path')
const fs = require('fs')

// React component example
const reactComponent = {
  type: 'React Component',
  hooks: {
    onCreate: async ({ outputPath }) => {
      console.log(outputPath)
      cp.exec(`cd ${outputPath} && touch file_name.txt`)
    },
  },
  files: [
    {
      path: ({ name, helpers: { changeCase } }) => changeCase.paramCase(name) + '.jsx',
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
const cloudFunctionTemplate = {
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
const story = {
  type: 'Story',
  outputWithoutParentDir: true,
  files: [
    {
      path: ({ name, helpers: { changeCase } }) =>
        'stories/' + changeCase.paramCase(name) + '.stories.jsx',
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

module.exports = [reactComponent, cloudFunctionTemplate, story]
