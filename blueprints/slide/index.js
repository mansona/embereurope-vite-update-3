'use strict';

const { readdirSync } = require('fs');
const { join } = require('path');
const Blueprint = require('layer-gen-blueprint');

// https://stackoverflow.com/a/18953446/690826
function round5(x) {
  return Math.ceil(x / 5) * 5;
}

module.exports = class AppBlueprint extends Blueprint {
  description = 'A simple blueprint to create a new slide markdown';

  fileMapTokens(options) {
    // Return custom tokens to be replaced in your files
    return {
      __number__() {
        if (options.locals.number) {
          return parseInt(options.locals.number, 10).toString().padStart(3, '0');
        }
        let existingFiles = readdirSync(join(process.cwd(), 'slides'));

        let numbers = existingFiles.map((filename) => {
          return parseInt(filename.split('-')[0]);
        });

        let highestNumber = Math.max(...numbers, -1);

        // we want to get the next highest number that is divisible by 5
        // this means that if you add slides one after another you will get slide
        // 005 010 015 which gives you some space to move slides into the gaps
        // and makes moving slides less tedious.
        return round5(highestNumber + 1)
          .toString()
          .padStart(3, '0');
      },
    };
  }

  locals(options) {
    return {
      title: options.entity.name,
      number: options.number,
    };
  }
};
