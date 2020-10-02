/* eslint-env mocha */

const assert = require('assert').strict

describe('/index', () => {
  describe('the page has the correct elements', () => {
    // Arrange
    before(() => {
      ava.url('/')
    })

    it('title', () => {
      // Assert
      const title = ava.getTitle()

      assert.equal(title, 'Old Skool Quiz')
    })

    it('heading', () => {
      // Assert
      const heading = ava.$('div#heading').getText()

      assert.equal(heading, 'Old Skool Quiz')
    })

    it('\'Create\' link', () => {
      // Assert
      const link = ava.$$('a.rubber')[0].getText()

      assert.equal(link, 'Create')
    })

    it('\'Join\' link', () => {
      // Assert
      const link = ava.$$('a.rubber')[1].getText()

      assert.equal(link, 'Join')
    })

    it('\'Guide\' link', () => {
      // Assert
      const link = ava.$('a.corner-link').getText()

      assert.equal(link, 'Guide')
    })
  })

  describe('the page has the correct behaviours', () => {
    context('Standard', () => {
      // Arrange
      beforeEach(() => {
        ava.url('/')
      })

      it('\'Create\' link', () => {
        // Act
        ava.$$('a.rubber')[0].click()

        // Assert
        const url = ava.getUrl()

        assert.match(url, /\/create/)
      })

      it('\'Join\' link', () => {
        // Act
        ava.$$('a.rubber')[1].click()

        // Assert
        const url = ava.getUrl()

        assert.match(url, /\/join/)
      })

      it('\'Guide\' link', () => {
        // Act
        ava.$('a.corner-link').click()
        ava.switchWindow(/\/guide/)

        // Assert
        const url = ava.getUrl()

        assert.match(url, /\/guide/)
      })
    })
  })
})
