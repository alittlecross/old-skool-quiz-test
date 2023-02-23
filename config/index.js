exports.config = {

  baseUrl: 'https://old-skool-quiz-react.herokuapp.com',

  capabilities: {
    ava: {
      capabilities: {
        browserName: 'chrome'
      }
    },

    boo: {
      capabilities: {
        browserName: 'chrome'
      }
    },

    dot: {
      capabilities: {
        browserName: 'chrome'
      }
    },

    kit: {
      capabilities: {
        browserName: 'chrome'
      }
    }
  },

  data: {
    gamecode: '',
    password: ''
  },

  debug: true,

  framework: 'mocha',

  logLevel: 'error',

  maxInstances: 1,

  mochaOpts: { timeout: 300000 },

  reporters: ['spec'],

  seleniumLogs: './.selenium_output',

  services: ['selenium-standalone'],

  specs: [
    'test/post-join/game.test.js'
  ],

  before: (capabilities, specs) => {
    browser.setWindowSize(1600, 1000)
  }
}
