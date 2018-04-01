#! /usr/bin/env node

const program = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");
const archiver = require("archiver");
const path = require("path");

program
  .arguments("<srcPath>")
  .arguments("<destFile>")
  .action((srcPath, destFile) => {
    if (srcPath.startsWith("/")) {
      srcPath = path.resolve(srcPath);
    } else {
      srcPath = path.resolve(__dirname, srcPath);
    }
    if (destFile.startsWith("/")) {
      destFile = path.resolve(destFile);
    } else {
      destFile = path.resolve(__dirname, destFile);
    }
    console.log('zipping files...');
    console.log('srcPath: ' + srcPath);
    console.log('destFile: ' + destFile);
    // create a file to stream archive data to.
    var output = fs.createWriteStream(destFile);
    var archive = archiver("zip", {
      zlib: { level: 9 } // Sets the compression level.
    });
    // pipe archive data to the file
    archive.pipe(output);
    if (fs.statSync(srcPath).isDirectory()) {
      var dirname = srcPath.replace(path.dirname(srcPath), '');
      // append files from a sub-directory and naming it `new-subdir` within the archive
      archive.directory(srcPath, dirname);
    } else {
      var filename = path.basename(srcPath);
      archive.file(srcPath, {name: filename});
    }
    archive.finalize();
  });

program.parse(process.argv);
