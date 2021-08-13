#!/usr/bin/env node

const { main } = require("./lib/index");
const { getConfig } = require("./lib/config");

main(getConfig(process.env.PWD || "", process.argv));
