/* eslint-env mocha */

const assert = require('assert').strict

const s = require('../../support')

describe('/create', () => {
  describe('the page has the correct elements', () => {
    // Arrange
    before(() => {
      ava.url('/create')
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

    it('label', () => {
      // Assert
      const label = ava.$('label').getText()

      assert.equal(label, 'Set the quiz name...')
    })

    it('name input', () => {
      // Assert
      const input = ava.$('input[name=name]').getAttribute('placeholder')

      assert.equal(input, '...it will replace Old Skool Quiz')
    })

    it('\'Create\' button', () => {
      // Assert
      const button = ava.$('button.rubber').getText()

      assert.equal(button, 'Create')
    })

    it('\'Back\' link', () => {
      // Assert
      const link = ava.$('a.corner-link').getText()

      assert.equal(link, 'Back')
    })
  })

  describe('the page has the correct behaviours', () => {
    // Arrange
    beforeEach(() => {
      ava.url('/create')
    })

    context('Standard', () => {
      it('\'Create\' button', () => {
        // Act
        ava.$('input').setValue('NorEasWorFroHomSoc')
        ava.$('button.rubber').click()

        // Assert
        const url = ava.getUrl()

        assert.match(url, /\/join\/[0-9]{3}-[0-9]{3}\/[a-z]{3}-[a-z]{3}/)
      })

      it('\'Back\' link', () => {
        // Act
        ava.$('a.corner-link').click()

        // Assert
        const route = ava.getUrl().split('/')[3]

        assert.equal(route, '')
      })
    })

    context('Validation Errors', () => {
      let seconds = 0
      let span

      it('Missing name', () => {
        // Act
        do {
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'This field is required')
      })
    })
  })
})
