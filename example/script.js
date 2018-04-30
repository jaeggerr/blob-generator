/* global PIXI, $, blob */

/**
 * Rotation angle per second (in degrees)
 */
const ROTATION_SPEED = 180

/**
 * The asteroid should rotate
 */
let asteroidShouldRotate = false

/**
 * The asteroid PIXI container
 */
let asteroid = null

// Setup PIXI
let app = new PIXI.Application(800, 600, {
  antialias: true,
  backgroundColor: 0x070a19
})
document.body.appendChild(app.view)

// Setup asteroid rotation
app.ticker.add(function (delta) {
  if (asteroid && asteroidShouldRotate) {
    asteroid.rotation += (ROTATION_SPEED / (1000 / app.ticker.elapsedMS)) * Math.PI / 180
  }
})

function randomBlob (graphicsList, radius, totalWaves, maxWaveWeight) {
  const w = []
  const teta = []
  for (let i = 0; i < totalWaves; i++) {
    w[i] = randomWeights[i]
    teta[i] = randomTetas[i]
  }
  for (let graphics of graphicsList) {
    const points = blob({
      points: 360,
      radius: radius,
      totalWaves: totalWaves,
      maxWaveWeight: maxWaveWeight,
      weights: w,
      tetas: teta
    })
    drawBlob(graphics, points)
  }
}

function drawBlob (graphics, points) {
  for (var i = 0; i < points.length; i++) {
    const point = points[i]
    if (i === 0) graphics.moveTo(point.x, point.y)
    else graphics.lineTo(point.x, point.y)
  }
}

function intersect (x0, y0, r0, x1, y1, r1) {
  return Math.hypot(x0 - x1, y0 - y1) <= (r0 + r1)
}

let randomTetas = []
let randomWeights = []

function shuffleWeightsAndTetas (params) {
  randomTetas = []
  randomWeights = []
  for (let i = 0; i < 1000; i++) {
    randomTetas[i] = Math.random()
    randomWeights[i] = Math.random()
  }
}

function generateAsteroid () {
  const asteroidFillColor = 0xd2d3d5
  const radius = 100
  const maxWaveLength = $('#maxWaveLength').val()
  const totalWaves = $('#waves').val()
  const maxCraters = $('#craters').val()

  let asteroidInner = new PIXI.Graphics()
  let asteroidMask = new PIXI.Graphics()
  asteroidMask.isMask = true
  asteroidInner.beginFill(asteroidFillColor)
  asteroidMask.beginFill(0xff0000)
  let asteroidShadow = new PIXI.Graphics()
  asteroidShadow.beginFill(0xb2b4b3)
  randomBlob([asteroidInner, asteroidMask, asteroidShadow], radius, totalWaves, maxWaveLength)
  asteroidInner.endFill()
  asteroidMask.endFill()
  asteroidShadow.endFill()

  const asteroid = new PIXI.Container()
  asteroid.addChild(asteroidMask)
  asteroid.mask = asteroidMask
  asteroid.addChild(asteroidShadow)
  asteroid.addChild(asteroidInner)
  asteroidInner.x = 20

  // Add craters
  let previousCraters = []
  for (let i = 0; i < maxCraters; i++) {
    const craterRadius = radius / 4
    const actualCrater = new PIXI.Container()
    let craterInnerShadow = new PIXI.Graphics()
    craterInnerShadow.beginFill(0x6f7c82)

    let craterOuterShadow = new PIXI.Graphics()
    craterOuterShadow.beginFill(0xb4b6b5)

    let craterInside = new PIXI.Graphics()
    craterInside.beginFill(0xb2b4b3)

    const craterBorder = new PIXI.Graphics()
    craterBorder.lineStyle(5, asteroidFillColor, 1)

    let craterMask = new PIXI.Graphics()
    craterMask.isMask = true
    craterMask.beginFill(0xff0000)

    randomBlob([craterInside, craterInnerShadow, craterOuterShadow, craterMask, craterBorder], craterRadius, totalWaves, 0.15)

    craterMask.endFill()
    craterInnerShadow.endFill()
    craterInside.endFill()
    craterOuterShadow.endFill()

    const crater = new PIXI.Container()
    crater.addChild(craterMask)
    crater.addChild(craterInnerShadow)
    craterInside.x -= 8
    crater.addChild(craterInside)
    crater.mask = craterMask

    actualCrater.addChild(craterOuterShadow)
    craterOuterShadow.x -= 8
    actualCrater.addChild(crater)
    actualCrater.addChild(craterBorder)

    function setRandomPosition () {
      let randomSign = () => { return Math.random() >= 0.5 ? -1 : 1 }
      actualCrater.x = Math.random() * radius * randomSign()
      actualCrater.y = Math.random() * radius * randomSign()
    }

    function intersectWithPreviousCrater () {
      for (let previousCrater of previousCraters) {
        if (intersect(
          previousCrater.x,
          previousCrater.y,
          Math.max(previousCrater.width / 2, previousCrater.height / 2),
          actualCrater.x,
          actualCrater.y,
          Math.max(actualCrater.width / 2, actualCrater.height / 2)
        )) return true
      }
      return false
    }

    let couldAddCrater = true
    if (previousCraters.length > 0) {
      const maxTries = 500
      let tries = 0
      while (intersectWithPreviousCrater()) {
        if (tries >= maxTries) {
          console.log('Could not add one more crater')
          couldAddCrater = false
          break
        }
        setRandomPosition()
        tries++
      }
      if (couldAddCrater) console.log(`Could find crater spot after ${tries} tries`)
    } else {
      setRandomPosition()
    }

    if (couldAddCrater) {
      asteroid.addChild(actualCrater)
      previousCraters.push(actualCrater)
    } else {
      break
    }
  }

  return asteroid
}

function onAsteroidSettingInputChange () {
  if ($('#liveGeneration').prop('checked')) {
    recreateAsteroid()
  }
}

function recreateAsteroid () {
  if (asteroid && asteroid.parent) {
    asteroid.parent.removeChild(asteroid)
  }
  asteroid = generateAsteroid()
  asteroid.x = 400
  asteroid.y = 300
  app.stage.addChild(asteroid)
}

function generateRandomAsteroid () {
  const minWaves = 2
  const maxWaves = 5
  const totalWaves = Math.floor(Math.random() * (maxWaves - 1)) + minWaves
  $('#waves').val(totalWaves)
  $('#maxWaveLength').val(Math.random() * 0.5)
  $('#craters').val(Math.floor(Math.random() * 5) + 2)
  recreateAsteroid()
}

shuffleWeightsAndTetas()
recreateAsteroid()
