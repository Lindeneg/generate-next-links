#!/usr/bin/env node

const { main } = require("./lib/index");
const { getConfig } = require("./lib/config");

main(getConfig(process.argv.slice(2)));
