#!/usr/bin/env node

const { exit } = require('process');
const { main } = require('./dist/bundle.min.js');

main(process.argv.slice(2))
    .then(() => exit(0))
    .catch(() => exit(1));
