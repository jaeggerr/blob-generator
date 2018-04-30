"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the list of coordinates of a blob.
 * More information of the algorithm here: https://gamedev.stackexchange.com/a/64266
 * @export
 * @param {object} options The options to generate the blob.
 */
function blob(options) {
    var pointsList = [];
    for (var point = 0; point < options.points; point++) {
        var angle = ((2 * Math.PI) / options.points) * point;
        var radiusAtAngle = 1; // Normalized radius
        for (var i = 0; i < options.totalWaves; i++) {
            // Add angle variation
            var weight = options.weights[i] * options.maxWaveWeight; // Normalize weight between 0 and maxWaveWeight
            radiusAtAngle += options.maxWaveWeight * weight * Math.sin((1 + i) * angle + 2 * Math.PI * options.tetas[i]);
        }
        radiusAtAngle *= options.radius;
        pointsList.push({
            x: Math.cos(angle) * radiusAtAngle,
            y: Math.sin(angle) * radiusAtAngle
        });
    }
    return pointsList;
}
exports.blob = blob;
/**
 * Generates a random blob and returns its list of coordinates.
 * @export
 * @param {object} options The options to generate the blob.
 * @returns {Point[]} The list of points representing the coordinates of the blob.
 */
function randomBlob(options) {
    var minWaves = options.minWaves || 2;
    var maxWaves = options.maxWaves || 5;
    var maxWaveWeight = options.maxWaveWeight || 0.25;
    var totalWaves = Math.floor(Math.random() * maxWaves) + minWaves;
    var weights = [];
    var tetas = [];
    for (var i = 0; i < totalWaves; i++) {
        weights[i] = Math.random();
        tetas[i] = Math.random();
    }
    return blob({
        points: options.points,
        radius: options.radius,
        totalWaves: totalWaves,
        maxWaveWeight: maxWaveWeight,
        weights: weights,
        tetas: tetas
    });
}
exports.randomBlob = randomBlob;
