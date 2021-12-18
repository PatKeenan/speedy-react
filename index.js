#!/usr/bin/env node

const fs = require("fs");
const { argv } = require("process");
const { configTemplate } = require("./configFile");

/////// CLI Messages ///////

const noArgs = `No arguments received. Use --help to see all available options.
`;

const help = `

npx speedy --init
Create a config file needed for the codegen to work properly.


npx speedy --generate-component <componentName>
Create a component(s) based on the templates and output location set in the config file. Spaces will be considered a new component. 
Alias: npx arc --gc <compName>


`;

//////// Functional Helpers ////////
const compose = (f, g) => (x) => f(g(x));

//Strings
const split = (str, sep = " ") => str.split(sep);

const lower = (str) => str.toLocaleLowerCase();

const upper = (str) => str.toUpperCase();

const capitalize = (str) => str.replace(str.charAt(0), upper(str.charAt(0)));

const camelCase = (str, sep = " ", join = "") => {
  const arr = split(str, sep);
  const newStr = map((i) => upper(i.charAt(0)) + i.substring(1), arr).join(
    join
  );
  return newStr.replace(newStr.charAt(0), lower(newStr.charAt(0)));
};

const capitalCamel = compose(capitalize, camelCase);

// Arrays
const length = (data) => {
  if (!data) return 0;
  return data.length;
};

const head = (array) => {
  if (isNull(array)) return array;
  return array[0];
};

const tail = (array) => {
  if (isNull(array)) return array;
  return array.slice(1);
};

const map = (fn, array) => {
  if (isNull(array)) return [];
  return [fn(head(array))].concat(map(fn, tail(array)));
};

// Generals
const isNull = (data) => {
  if (data && typeof data === "object") {
    return isNull(length(Object.keys(data)));
  }
  return !data || length(data) === 0;
};
//only for strings
const combine = (...args) => {
  let str = "";
  map((i) => (str += i), args);
  return str;
};

const decide = (defaultCase, ...args) => {
  if (args && !isNull(args[0])) {
    return args[0];
  } else if (args) {
    const valid = [];
    map((i) => (i && !isNull(i) ? valid.push(i) : ""), args);
    return decide(defaultCase, valid[0]);
  }
  return defaultCase;
};

const appendToFile = (file, data) => fs.appendFileSync(file, data());

//////// Generators ////////

function curryGen(path) {
  return function (compName, ext, data) {
    return fs.writeFileSync(combine(path, "/", compName, ext), data);
  };
}

function generateFiles(generator, config, comp) {
  map(
    (file) =>
      generator(
        capitalize(comp),
        file.ext,
        file.template ? file.template(comp) : ""
      ),
    config.components.files
  );
  if (config.exportFile && config.exportFile.template) {
    appendToFile(
      combine(config.exportFile.path, "/", `index${config.exportFile.type}`),
      config.exportFile.template ? config.exportFile.template(comp) + "\n" : ""
    );
  }
}

function generateComps(comps, configFile) {
  map((comp) => {
    const path = combine(configFile.components.output, "/", capitalize(comp));
    const generate = curryGen(path);
    fs.mkdirSync(path);
    generateFiles(generate, configFile, comp);
  }, comps);
}

//////// Main Function ////////

(() => {
  const comps = argv.slice(2);
  if (isNull(comps)) {
    return console.log(noArgs);
  } else if (comps.includes("--help")) {
    return console.log(help);
  } else if (comps[0] === "--init") {
    return fs.writeFileSync(`speedy.config.js`, configTemplate);
  } else if (comps[0] === ("--gc" || "--generate-component")) {
    const configFile = require(`../../speedy.config.js`) || "";
    if (isNull(configFile)) {
      return "No config file found. Use npx speedy --init to create one.";
    } else {
      generateComps(comps.slice(1), configFile);
    }
  } else {
    return "Something went wrong. Use npx speedy --help to see instructions";
  }
})();

module.exports = { capitalCamel };
