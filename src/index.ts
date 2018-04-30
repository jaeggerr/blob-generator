/**
 * 2D coordinates
 */
export interface Point {
  x: number
  y: number
}

/**
 * Returns the list of coordinates of a blob.
 * More information of the algorithm here: https://gamedev.stackexchange.com/a/64266
 * @export
 * @param {object} options The options to generate the blob.
 */
export function blob (options: {
  /**
   * The number of points of the blob that should be returned.
   */
  points: number,
  /**
   * The radius of the blob if it was a perfect circle.
   */
  radius: number,
  /**
   * The number of waves the blob should have.
   */
  totalWaves: number,
  /**
   * The maximum weight of the waves. The bigger, the highest the waves will be, as if they were attracted outside the blob.
   */
  maxWaveWeight: number,
  /**
   * Normalized weight of each wave, between 0 and 1.
   */
  weights: number[],
  /**
   * Starting angle of each wave around the circle, between 0 and 1.
   */
  tetas: number[]
}): Point[] {
  const pointsList: Point[] = []
  for (let point = 0; point < options.points; point ++) {
    const angle = ((2 * Math.PI) / options.points) * point
    let radiusAtAngle = 1 // Normalized radius
    for (let i = 0; i < options.totalWaves; i++) {
      // Add angle variation
      const weight = options.weights[i] * options.maxWaveWeight // Normalize weight between 0 and maxWaveWeight
      radiusAtAngle += options.maxWaveWeight * weight * Math.sin((1 + i) * angle + 2 * Math.PI * options.tetas[i])
    }
    radiusAtAngle *= options.radius

    pointsList.push({
      x: Math.cos(angle) * radiusAtAngle,
      y: Math.sin(angle) * radiusAtAngle
    })
  }
  return pointsList
}

/**
 * Generates a random blob and returns its list of coordinates.
 * @export
 * @param {object} options The options to generate the blob.
 * @returns {Point[]} The list of points representing the coordinates of the blob.
 */
export function randomBlob (options: {
  /**
   * The number of points of the blob that should be returned.
   */
  points: number,
  /**
   * The radius of the blob if it was a perfect circle.
   */
  radius: number,
  /**
   * The minimum amount of waves. Default is 2.
   */
  minWaves?: number,
  /**
   * The maximum amount of waves. Default is 5.
   */
  maxWaves?: number,
  /**
   * The maximum weight of the waves. The bigger, the highest the waves will be, as if they were attracted outside the blob.
   * Default is 0.25
   */
  maxWaveWeight?: number
}): Point[] {
  const minWaves = options.minWaves || 2
  const maxWaves = options.maxWaves || 5
  const maxWaveWeight = options.maxWaveWeight || 0.25
  const totalWaves = Math.floor(Math.random() * maxWaves) + minWaves
  const weights: number[] = []
  const tetas: number[] = []
  for (let i = 0; i < totalWaves; i++) {
    weights[i] = Math.random()
    tetas[i] = Math.random()
  }
  return blob({
    points: options.points,
    radius: options.radius,
    totalWaves: totalWaves,
    maxWaveWeight: maxWaveWeight,
    weights: weights,
    tetas: tetas
  })
}
