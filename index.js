#!/usr/bin/env node

const { main, getConfig } = require("./dist/index");

main(getConfig(process.env.PWD || "", process.argv));
