module.exports = {
  extension: 'jsx',
  template: ({ componentName, wrapInTemplateLiteral }) => `
  import React from 'react';
  import styles from './${componentName.raw}.css';
  
  export default function ${componentName.pascalCase}() {
    return (
      <div className={${wrapInTemplateLiteral('styles.wrapper')}}>
       ${componentName.raw}
      </div>
    );
  }
    `,
};
