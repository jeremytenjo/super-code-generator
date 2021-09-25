module.exports = [
  {
    type: 'React component',
    hooks: {
      onCreate: ({ outputPath }) => {
        console.log(outputPath)
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
  },
]
