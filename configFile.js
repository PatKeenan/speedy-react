const configTemplate = `const upper = (str) => str.toUpperCase();
const capitalize = (str) => str.replace(str.charAt(0), upper(str.charAt(0)));

// Jsx template
const jsxTemplate = (comp) => {
  const compName = capitalize(comp);
  return \`import * as React from 'react'

function \${compName}(props){
    return <div>\${compName} working!</div>
}

export {\${compName}}
    \`;
};
// Typescript template
const tsxTemplate = (comp) => {
  const compName = capitalize(comp);
  return \`import * as React from 'react'

type \${compName}Props = {
    children: React.ReactNode
}  

function \${compName}({children}: \${compName}Props){
    return <div>\${compName} working!</div>
}

export {\${compName}
    \`;
}

// Stories
const storiesTemplate = (comp) => {
  const compName = capitalize(comp);
  return \`import * as React from 'react'

function \${compName}(props){
    return <div>\${compName} working!</div>
}

export {\${compName}}
    \`;
}

// Export Components
const exportTemplate = (compName) =>
  \`export * from './\${capitalize(compName)}/\${capitalize(compName)}'\`;

module.exports = {
  components: {
    output: "./src/components", // destination folder of the components
    // file generation pattern
    files: [
      {
        ext: ".jsx",
        template: jsxTemplate,
      },
      { ext: ".module.css" },
      { ext: ".spec.jsx" },
      { ext: ".stories.jsx" },
    ],
  },
  exportFile: {
    path: "./src/components",
    type: ".js",
    template: exportTemplate,
  },
};
`;

module.exports = { configTemplate };
