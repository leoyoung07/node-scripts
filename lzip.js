#! /usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
var fs = require('fs');
var archiver = require('archiver');


program
  .arguments('<srcPath>')
  .arguments('<destFile>')
  .action((srcPath, destFile) => {
    console.log(srcPath, destFile);
    // create a file to stream archive data to.
    var output = fs.createWriteStream(__dirname + '/' + destFile);
    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    // pipe archive data to the file
    archive.pipe(output);
    // append files from a sub-directory and naming it `new-subdir` within the archive
    archive.directory(srcPath, srcPath);
    archive.finalize();
  });

program.parse(process.argv);
