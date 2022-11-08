#!/usr/bin/env node
"use strict";
const { readFile, writeFile } = require("fs/promises");
const { join } = require("path");

const currDir = process.cwd();
const cssPath = process.argv?.[2];
const cssDir = cssPath.slice(0, cssPath.lastIndexOf("/"));
const cssFile = cssPath.slice(cssPath.lastIndexOf("/"));
const outPath = process.argv?.[3] || join(cssDir, "dist.min.css");

const pathToCSSFile = join(currDir, cssDir, cssFile);

let fileStr;
const opts = { encoding: "utf-8" };

(async () => {
  try {
    fileStr = await readFile(pathToCSSFile, opts);
    const oldSize = fileStr.length;
    fileStr = fileStr
      .replace(/\/\*[^]*?\*\//g, "") // remove comments
      .replace(/[\r\n]+/g, "") // remove newline
      .replace(/[^;]+?:\s?;/g, "") // remove no value properties
      .replace(/\s*([;,:{}])\s*/g, "$1"); // remove extra whitespace before after

    const newSize = fileStr.length;
    console.log(`Size Loss: ${(100 - (newSize / oldSize) * 100).toFixed(2)}%`);
    await writeFile(outPath, fileStr);
  } catch (error) {
    console.log(error);
  }
})();
