"use strict";

const fs = require("fs");
const path = require("path");
const SVGO = require("svgo");
const svgo = new SVGO({
    plugins: [
        {
            cleanupAttrs: true
        },
        {
            removeDoctype: true
        },
        {
            removeXMLProcInst: true
        },
        {
            removeComments: true
        },
        {
            removeMetadata: true
        },
        {
            removeTitle: true
        },
        {
            removeDesc: true
        },
        {
            removeUselessDefs: true
        },
        {
            removeEditorsNSData: true
        },
        {
            removeEmptyAttrs: true
        },
        {
            removeHiddenElems: true
        },
        {
            removeEmptyText: true
        },
        {
            removeEmptyContainers: true
        },
        {
            removeViewBox: false
        },
        {
            cleanupEnableBackground: true
        },
        {
            convertStyleToAttrs: true
        },
        {
            convertColors: true
        },
        {
            convertPathData: true
        },
        {
            convertTransform: true
        },
        {
            removeUnknownsAndDefaults: true
        },
        {
            removeNonInheritableGroupAttrs: true
        },
        {
            removeUnusedNS: true
        },
        {
            cleanupNumericValues: true
        },
        {
            moveGroupAttrsToElems: true
        },
        {
            collapseGroups: true
        },
        {
            removeRasterImages: false
        },
        {
            mergePaths: true
        },
        {
            convertShapeToPath: true
        },
        {
            sortAttrs: true
        },
        {
            removeAttrs: {
                attrs: ["style", "color", "stroke.*", "font.*", "overflow.*"]
            }
        }
    ]
});

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

/**
 *
 * @param {string} dirPath path to a directory that contains svg files
 */
function iconic(dirPath) {
    fs.stat(dirPath, function(err, stats) {
        if (err) {
            throw err;
        }
        if (!stats.isDirectory()) {
            return;
        }
        const files = fs.readdirSync(dirPath);
        files.forEach(file => {
            if (file.endsWith(".svg")) {
                iconicFile(path.join(dirPath, file), file);
            } else {
                iconic(path.join(dirPath, file));
            }
        });
    });
}

/**
 *
 * @param {string} svgFilePath path to a svg file
 */
function iconicFile(svgFilePath, svgFileName) {
    const jsonFilePath = svgFilePath.replace(/\.svg$/, ".json");
    const jsFilePath = svgFilePath.replace(/\.svg$/, ".js");

    fs.readFile(svgFilePath, "utf8", function(err, data) {
        if (err) {
            throw err;
        }

        const escapedData = data.replace(/#0{3,6}/g, "currentColor");

        svgo.optimize(escapedData).then(function(result) {
            const svgFileData = result.data;
            writeIfDifferent(svgFilePath, svgFileData);

            const dom = new JSDOM(svgFileData);
            const svg = dom.window.document.querySelector("svg");
            const paths = dom.window.document.querySelectorAll("path");

            const iconObject = {
                name: svgFileName.substring(0, svgFileName.length - 4),
                width: parseInt(svg.getAttribute("width")),
                height: parseInt(svg.getAttribute("height")),
                paths: []
            };

            for (let path of paths) {
                const p = {
                    d: path.getAttribute("d"),
                    fill: path.getAttribute("fill")
                };
                iconObject.paths.push(p);
            }

            const jsonFileData = JSON.stringify(iconObject);
            const jsFileData = "export default " + jsonFileData + ";";

            writeIfDifferent(jsonFilePath, jsonFileData);
            writeIfDifferent(jsFilePath, jsFileData);
        });
    });
}

function writeIfDifferent(filePath, fileData) {
    fs.stat(filePath, function(err, stats) {
        if (err) {
            throw err;
        }
        if (stats.isFile()) {
            // if file exists, compare data
            fs.readFile(filePath, "utf8", function(err, data) {
                if (err) {
                    throw err;
                }
                // save json
                if (data !== fileData) {
                    fs.writeFile(filePath, fileData, function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log(filePath + " done");
                    });
                }
            });
        } else {
            // if file doesn't exist, write data
            fs.writeFile(filePath, fileData, function(err) {
                if (err) {
                    throw err;
                }
                console.log(filePath + " done");
            });
        }
    });
}

module.exports = iconic;
