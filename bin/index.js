#!/usr/bin/env node

const path = require("path");
const iconic = require("../lib");

const dirs = process.argv.slice(2);

if (dirs.length) {
    dirs.forEach(d => iconic(path.join(process.cwd(), d)));
} else {
    iconic(process.cwd());
}
