/** @format */

const defaultConfig = require("../app.json");

const webOutput = process.env.EXPO_WEB_OUTPUT || "static";

module.exports = {
  ...defaultConfig.expo,
  web: {
    ...defaultConfig.expo.web,
    output: webOutput,
  },
};
