const postcss = require("postcss");
const cssnano = require("cssnano");
const postcssPresetEnv = require("postcss-preset-env");
// const obfuscator = require("postcss-obfuscator");

// const isObfscMode = process.env.NODE_ENV === 'obfuscation';

//postcss.config.js / postcss.config.cjs
module.exports = {
//   map: { annotation: false },
  // other plugins
  plugins: [
    cssnano({  //minimize file
      preset: 'default'
    }),
    postcssPresetEnv({ }),  //converts the css to compatible css that the browser can read
    // obfuscator({  //obfuscate file + minimize file
    //   /* options */
    //   enable: isObfscMode, // Only runs when mode is set to 'obfuscation'
    //   srcPath: "./views",      // Source directory of your html/js files
    //   desPath: "./out",      // Where the obfuscated files will be saved
    //   extensions: ['.html', '.js'], // Files to scan for class replacements when obfuscating the css
    // //   formatJson: true     // Formats the mapping JSON for readability
    //     callBack: function () {
    //         process.env.NODE_ENV = "production"; // to make sure postcss-obfuscator doesn't re-run.
    //     },
    // }),
  ],
};