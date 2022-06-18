#!/usr/bin/env node

const { main } = require('./dist/bundle.min.js');

main(process.argv.slice(2));
