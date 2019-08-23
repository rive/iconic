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
    const files = fs.readdirSync(dirPath);
    files
        .filter(file => file.endsWith(".svg"))
        .forEach(file => iconicFile(path.join(dirPath, file), file));
}

/**
 *
 * @param {string} svgFilePath path to a svg file
 */
function iconicFile(svgFilePath, svgFileName) {
    fs.readFile(svgFilePath, "utf8", function(err, data) {
        if (err) {
            throw err;
        }

        const escapedData = data.replace(/#0{3,6}/g, "currentColor");

        svgo.optimize(escapedData).then(function(result) {
            // save optimized svg
            fs.writeFile(svgFilePath, result.data, function(err) {
                if (err) {
                    throw err;
                }
                console.log(svgFilePath + " done");
            });

            const dom = new JSDOM(result.data);
            const svg = dom.window.document.querySelector("svg");
            const paths = dom.window.document.querySelectorAll("path");

            const jsonFilePath = svgFilePath.replace(/\.svg$/, ".json");

            const jsonData = {
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
                jsonData.paths.push(p);
            }

            const jsonString = JSON.stringify(jsonData);

            // save json
            fs.writeFile(jsonFilePath, jsonString, function(err) {
                if (err) {
                    throw err;
                }
                console.log(jsonFilePath + " done");
            });

            const jsFilePath = svgFilePath.replace(/\.svg$/, ".js");
            const jsString = "export default " + jsonString + ";";

            fs.writeFile(jsFilePath, jsString, function(err) {
                if (err) {
                    throw err;
                }
                console.log(jsFilePath + " done");
            });
        });
    });
}

module.exports = iconic;
