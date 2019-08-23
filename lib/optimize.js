'use strict';

const fs = require('fs');
const path = require('path');
const SVGO = require('svgo');
const svgo = new SVGO({
    plugins: [{
        cleanupAttrs: true,
    }, {
        removeDoctype: true,
    }, {
        removeXMLProcInst: true,
    }, {
        removeComments: true,
    }, {
        removeMetadata: true,
    }, {
        removeTitle: true,
    }, {
        removeDesc: true,
    }, {
        removeUselessDefs: true,
    }, {
        removeEditorsNSData: true,
    }, {
        removeEmptyAttrs: true,
    }, {
        removeHiddenElems: true,
    }, {
        removeEmptyText: true,
    }, {
        removeEmptyContainers: true,
    }, {
        removeViewBox: false,
    }, {
        cleanupEnableBackground: true,
    }, {
        convertStyleToAttrs: true,
    }, {
        convertColors: true,
    }, {
        convertPathData: true,
    }, {
        convertTransform: true,
    }, {
        removeUnknownsAndDefaults: true,
    }, {
        removeNonInheritableGroupAttrs: true,
    }, {
        removeUnusedNS: true,
    }, {
        cleanupNumericValues: true,
    }, {
        moveGroupAttrsToElems: true,
    }, {
        collapseGroups: true,
    }, {
        removeRasterImages: false,
    }, {
        mergePaths: true,
    }, {
        convertShapeToPath: true,
    }, {
        sortAttrs: true,
    }, {
        removeDimensions: true,
    }, {
        removeAttrs: { attrs: ['style', 'color', 'stroke.*', 'font.*', 'overflow.*'] },
    }]
});

/**
 *
 * @param {string} dirPath path to a directory that contains svg files
 */
function optimize(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.filter(file => file.endsWith('.svg')).forEach(file => optimizeFile(path.join(dirPath, file)));
}

/**
 *
 * @param {string} filePath path to a svg file
 */
function optimizeFile(filePath) {
    console.log(filePath);
    fs.readFile(filePath, 'utf8', function (err, data) {

        if (err) {
            throw err;
        }

        // #000 or currentColor will be removed because they are default values
        // so we escape it with a random value
        const escapedData = data.replace(/#0{3,6}/g, '#123456');

        svgo.optimize(escapedData).then(function (result) {
            const newFilePath = filePath.replace(/\.src\.svg$/, '.svg');
            const unescapedData = result.data.replace('#123456', 'currentColor');
            fs.writeFile(newFilePath, unescapedData, function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log("okay");
            });
        });

    });
}

module.exports = optimize


