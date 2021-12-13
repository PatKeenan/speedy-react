# Speedy React

Speedy React is a code generator which creates components based on a predefined structure.

## Getting Started

```
npm i react-speedy
```

## Usage

### **Create a configuration file**:

```
npx speedy --init
```

The config file will have predefined templates and paths where the components will be outputted.

```js
const capitalize = (str) => str.replace(str.charAt(0), upper(str.charAt(0)));

// Jsx template
const jsxTemplate = (comp) => {
  const compName = capitalize(comp);
  return `import * as React from 'react'

function ${compName}(props){
    return <div>${compName} working!</div>
}

export {${compName}}
    `;
};
// Typescript template
function tsxTemplate(comp) {
  const compName = capitalize(comp);
  return `import * as React from 'react'

type ${compName}Props = {
    children: React.ReactNode
}  

function ${compName}({children}: ${compName}Props){
    return <div>${compName} working!</div>
}

export {${compName}
    `;
}

// Stories
function storiesTemplate(comp) {
  const compName = capitalize(comp);
  return `import * as React from 'react'

function ${compName}(props){
    return <div>${compName} working!</div>
}

export {${compName}}
    `;
}

// Export Components
const exportTemplate = (compName) =>
  `export * from './${capitalize(compName)}/${capitalize(compName)}'`;

module.exports = {
  components: {
    output: "./src/components", // destination folder of the components
    // file generation pattern. Add or remove any files from the list below.
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
```

### **Create Components**

**It's Important that the output path for the files is created before entering the following commands**

```
npx speedy --gc myComponent
```

or create several at once by separating them with spaces.

```
npx speedy --gc button nav navItem card
```

## **Creating Templates**

Templates can be defined anywhere in a project but must always meet the following criteria.

1. The must take only one argument.
2. They must return a string.
