/**
 * 2D coordinates
 */
export interface Point {
    x: number;
    y: number;
}
/**
 * Returns the list of coordinates of a blob.
 * More information of the algorithm here: https://gamedev.stackexchange.com/a/64266
 * @export
 * @param {object} options The options to generate the blob.
 */
export declare function blob(options: {
    /**
     * The number of points of the blob that should be returned.
     */
    points: number;
    /**
     * The radius of the blob if it was a perfect circle.
     */
    radius: number;
    /**
     * The number of waves the blob should have.
     */
    totalWaves: number;
    /**
     * The maximum weight of the waves. The bigger, the highest the waves will be, as if they were attracted outside the blob.
     */
    maxWaveWeight: number;
    /**
     * Normalized weight of each wave, between 0 and 1.
     */
    weights: number[];
    /**
     * Starting angle of each wave around the circle, between 0 and 1.
     */
    tetas: number[];
}): Point[];
/**
 * Generates a random blob and returns its list of coordinates.
 * @export
 * @param {object} options The options to generate the blob.
 * @returns {Point[]} The list of points representing the coordinates of the blob.
 */
export declare function randomBlob(options: {
    /**
     * The number of points of the blob that should be returned.
     */
    points: number;
    /**
     * The radius of the blob if it was a perfect circle.
     */
    radius: number;
    /**
     * The minimum amount of waves. Default is 2.
     */
    minWaves?: number;
    /**
     * The maximum amount of waves. Default is 5.
     */
    maxWaves?: number;
    /**
     * The maximum weight of the waves. The bigger, the highest the waves will be, as if they were attracted outside the blob.
     * Default is 0.25
     */
    maxWaveWeight?: number;
}): Point[];
