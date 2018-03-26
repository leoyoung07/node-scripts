#! /usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

program
  .description('say hello')
  .arguments('<name>')
  .action(name => {
    console.log('hello, ' + name)
  });

program.parse(process.argv);
