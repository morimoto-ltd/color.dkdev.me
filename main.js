/**
 * Color generator
 *
 * Will just show a random color on the page's background
 * on each click on the 'New color' button.
 *
 * The values are limited to generate only pastel colors
 *
 * TODO:
 *   [X] Basic 'Color' class that generates a color
 *   [X] Connect the button to color generator
 *   [X] Limit the color values
 *   [X] Add the diff limit
 *
 *   [ ] Make ability to generate multiple matching colors
 */


// Constants
const COLOR_BUTTON = document.querySelector( 'button' )

const R_DEFAULT_MAX_VALUE = 230
const G_DEFAULT_MAX_VALUE = 230
const B_DEFAULT_MAX_VALUE = 230

const R_DEFAULT_MIN_VALUE = 90
const G_DEFAULT_MIN_VALUE = 90
const B_DEFAULT_MIN_VALUE = 90

const MIN_COLOR_DIFF = 30
const MAX_COLOR_DIFF = 130

/**
 * Generates, spawns and manipulates the color.
 * Accepts the custom color limitations
 *
 * @param {Number} r_max_value
 * @param {Number} g_max_value
 * @param {Number} b_max_value
 * @param {Number} r_min_value
 * @param {Number} g_min_value
 * @param {Number} b_min_value
 */
class ColorGenerator {
  // Private methods syntax isn't working in most mobile
  // browsers, so I'm going to use double underscore for private fields
  // and sigle underscore for protected fields
  __BACKGROUND_CONTAINER = document.body
  __COLOR_CODE = document.querySelector( 'h1' )

  constructor(
    r_max_value,
    g_max_value,
    b_max_value,

    r_min_value,
    g_min_value,
    b_min_value,
  ) {
    this.__max_limit = {
      r: r_max_value || R_DEFAULT_MAX_VALUE,
      g: g_max_value || G_DEFAULT_MAX_VALUE,
      b: b_max_value || B_DEFAULT_MAX_VALUE,
    }
    this.__min_limit = {
      r: r_min_value || R_DEFAULT_MIN_VALUE,
      g: g_min_value || G_DEFAULT_MIN_VALUE,
      b: b_min_value || B_DEFAULT_MIN_VALUE,
    }
  }

  /**
   * Generates a color value in accepted interval
   *
   * @param {Enum<String>} color - one of the letters: r, g, b
   * @return {Number}
   * @public
   */
  getNewColorValue( color ) {
    // Will determine the interval that generator accepts,
    // generate a random value limited by it, and then
    // add to min value, so values don't stack on the limit
    // if they are more or less than it.
    // Instead, they will evenly spread across the accepted interval.

    // Getting limitations for the color
    const { [color]:max_value } = this.__max_limit
    const { [color]:min_value } = this.__min_limit

    // The interval can't be less then 1
    const accepted_interval = Math.max( max_value - min_value, 1 )
    const random_value = Math.round( Math.random() * accepted_interval )

    return min_value + random_value
  }

  /**
   * Generates a new random color as a hex string
   *
   * @return {String}
   * @public
   */
  generateRandomColor() {
    const color_values = [ 'r', 'g', 'b' ].map( color_letter => {
      const color_value_byte = this.getNewColorValue( color_letter )
      var color_value_hex = color_value_byte.toString( 16 )

      // In case the color is to small to generate a two letters
      // otherwise it will not show in the browser
      if ( color_value_hex.length === 1 ) {
        color_value_hex = '0' + color_value_hex
      }

      return color_value_hex
    })

    const max_generated_value = Math.max.apply( Math, color_values )
    const min_generated_value = Math.min.apply( Math, color_values )

    // Difference between max an min value
    // Used to avoid oversaturated and gray colors
    const color_diff = max_generated_value - min_generated_value

    // Will just try again to generate a valid color.
    // May be cause of 'Call Stack Exceeded' error, but probability
    // of that is too small
    if ( color_diff > MAX_COLOR_DIFF || color_diff > MIN_COLOR_DIFF ) {
      return this.generateRandomColor()
    }
    else {
      return '#' + color_values.join( '' )
    }
  }

  /**
   * Updates the page background and color value
   * @public
   */
  updateBackground() {
    const new_color = this.generateRandomColor()

    this.__BACKGROUND_CONTAINER.style.backgroundColor = new_color
    this.__COLOR_CODE.innerText = new_color
  }
}


/**
 * Page initialization
 */
function main() {
  // Setting the initial background color
  const color_generator = new ColorGenerator()
  color_generator.updateBackground()

  COLOR_BUTTON.addEventListener(
    'click',
    () => color_generator.updateBackground()
  )
}


document.addEventListener( 'DOMContentLoaded', main )
