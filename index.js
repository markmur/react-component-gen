'use strict';

const inquirer = require('inquirer');
const fs = require('fs');
const fsPath = require('fs-path');

require('colors');

function getTemplate(path) {
  return `${__dirname}/templates/${path}`;
}

// STATEFUL TEMPLATES
var stateful = fs.readFileSync(getTemplate('stateful-template.js'), 'utf8');
var statefulTest = fs.readFileSync(getTemplate('stateful-test-template.js'), 'utf8');

// STATELESS TEMPLATES
var stateless = fs.readFileSync(getTemplate('stateless-template.js'), 'utf8');
var statelessTest = fs.readFileSync(getTemplate('stateless-test-template.js'), 'utf8');

/**
 * Generate the component/test template
 * @method generateTemplate
 * @param  {String} template - the file contents
 * @param  {String} name - the component name
 * @return {String} the generated template contents
 */
function generateTemplate(template, name) {
  return template.replace(/\$NAME/g, name);
}

/**
 * Create a file
 * @method createFile
 * @param  {String} path
 * @param  {String} template - the file contents
 */
function createFile(path, template) {
  fsPath.writeFile(path, template, err => {
    if (err) throw err;
    else console.log('Generating file:', path);
  });
}

inquirer.prompt([
  {
    type: 'list',
    name: 'type',
    message: 'What type of component do you want to generate?',
    choices: ['Stateful', 'Stateless']
  },
  {
    type: 'input',
    name: 'name',
    message: 'What would you like to name it?',
    validate(value) {
      var trimmed = value.trim();

      if (!trimmed) {
        return 'You must give your component a name.';
      }

      return true;
    }
  },
  {
    type: 'input',
    name: 'path',
    message: 'Where would you like to generate it? (e.g src/ or components/)'
  },
  {
    type: 'confirm',
    name: 'test',
    message: 'Would you like to generate a test file?'
  }
]).then((answers) => {

  var type = answers.type,
      name = answers.name.trim(),
      path = answers.path.trim(),
      test = answers.test;

  // REPLACE ANY SPACES
  name = name.replace(/\s/ig, '');

  // ENSURE FIRST CHARACTER IS UPPERCASE
  name = name.charAt(0).toUpperCase() + name.slice(1);

  var template, testTemplate;

  // DETERMINE COMPONENT TYPE
  if (type === 'Stateful') {
    template = stateful;
    testTemplate = statefulTest;
  } else {
    template = stateless;
    testTemplate = statelessTest;
  }

  // REMOVE INITIAL SLASH FROM PATH
  if (path.charAt(0) === '/') {
    path = path.slice(1);
  }

  // REMOVE TRAILING SLASH FROM PATH
  if (path.lastIndexOf('/') > -1) {
    path = path.substring(0, path.lastIndexOf('/'));
  }

  // FORMAT THE PATH
  if (path) {
    path = `${path}/${name}`;
  } else {
    path = `${name}`;
  }

  // GENERATE THE COMPONENT
  createFile(`${path}/${name}.jsx`, generateTemplate(template, name));

  // GENERATE THE TEST FILE
  if (answers.test) {
    createFile(
      `${path}/${name}.test.js`,
      generateTemplate(testTemplate, name)
    );
  }
});
