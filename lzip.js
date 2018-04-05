#! /usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const progress = require('progress');

program
  .arguments('<srcPath>')
  .arguments('<destFile>')
  .action((srcPath, destFile) => {
    if (path.isAbsolute(srcPath)) {
      srcPath = path.resolve(srcPath);
    } else {
      srcPath = path.resolve(__dirname, srcPath);
    }
    if (path.isAbsolute(destFile)) {
      destFile = path.resolve(destFile);
    } else {
      destFile = path.resolve(__dirname, destFile);
    }
    console.log('zipping files...');
    console.log(' src: ' + srcPath);
    console.log(' dest: ' + destFile);
    // create a file to stream archive data to.
    let output = fs.createWriteStream(destFile);
    let archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    // progress bar
    let bar;
    let totalFiles = 0;
    archive.on('progress', progressData => {
      if (!bar || totalFiles < progressData.entries.total) {
        totalFiles = progressData.entries.total;
        bar = new progress(' progress: [:bar] :percent :elapsed s', {
          width: 20,
          total: totalFiles,
          clear: true
        });
      }
      bar.tick();
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on('close', function() {
      console.log('\n ' + archive.pointer() + ' total bytes');
      console.log('done.')
    });

    // pipe archive data to the file
    archive.pipe(output);
    if (fs.statSync(srcPath).isDirectory()) {
      let dirname = srcPath.replace(path.dirname(srcPath), '');
      // append files from a sub-directory and naming it `new-subdir` within the archive
      archive.directory(srcPath, dirname);
    } else {
      let filename = path.basename(srcPath);
      archive.file(srcPath, { name: filename });
    }
    archive.finalize();
  });

program.parse(process.argv);
