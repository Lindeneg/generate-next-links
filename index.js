#!/usr/bin/env node

const { init } = require('./dist/index');

init(process.argv.slice(2));
