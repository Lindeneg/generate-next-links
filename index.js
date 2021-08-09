#!/usr/bin/env node

const { main } = require("./dist/index");
const { getConfig } = require("./dist/config");

main(getConfig(process.env.PWD || "", process.argv));
