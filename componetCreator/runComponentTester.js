// const creator = require('./componentCreator/creator.js');

// const componentName = 'filter-button';
// const outputPath = '';

// creator({ componentName, outputPath });

const userFuction = require('./testApp/componentTemplates/component/[componentName].js');

function wrapInTemplateLiteral(string) {
  const stringWrappedInTemplateLiteral = `${'`${'}${string}${'}`'}`;

  return stringWrappedInTemplateLiteral;
}

const componentName = {
  raw: 'filter-button',
  pascalCase: 'FilterButton',
};

const userFuctionRes = userFuction.template({
  componentName,
  wrapInTemplateLiteral,
});

console.log(userFuctionRes);
