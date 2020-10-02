/* eslint-env mocha */

const assert = require('assert').strict
const clipboard = require('clipboardy')

const s = require('../../support')

describe('/host', () => {
  describe('the page has the correct elements', () => {
    // Arrange
    before(() => {
      s.createQuiz(ava)

      const joinUrl = ava.getUrl()

      s.joinQuiz(ava, joinUrl, 'Ava')
    })

    it('title', () => {
      // Assert
      const title = ava.getTitle()

      assert.equal(title, 'Old Skool Quiz')
    })

    it('heading', () => {
      // Assert
      const heading = ava.$('div#heading').getText()

      assert.equal(heading, 'NorEasWorFroHomSoc')
    })

    it('sub-heading', () => {
      // Assert
      const subheading = ava.$('div.sub-heading').getText()

      assert.equal(subheading, 'Select the host...')
    })

    it('select', () => {
      // Assert
      const select = ava.$('select[name=id]').isExisting()

      assert.ok(select)
    })

    it('options', () => {
      // Assert
      const options = ava.$$('option')

      const a = options[0].getText()
      const b = options[1].getText()

      assert.equal(options.length, 2)

      assert.equal(a, 'Select')
      assert.equal(b, 'Ava')
    })

    it('\'Submit\' button', () => {
      // Assert
      const button = ava.$('button.rubber').getText()

      assert.equal(button, 'Submit')
    })

    it('paragraph', () => {
      // Assert
      const paragraph = ava.$('p').getText()

      assert.equal(paragraph, 'The host can change this between questions.')
    })

    it('\'Copy link\' link', () => {
      // Assert
      const link = ava.$('span.corner-link').getText()

      assert.equal(link, 'Copy link')
    })
  })

  describe('the page has the correct behaviours', () => {
    // Arrange
    let gamecode
    let joinUrl
    let password
    let span
    let seconds = 0

    beforeEach(() => {
      s.createQuiz(ava)

      joinUrl = ava.getUrl()

      const split = joinUrl.split('/')

      gamecode = split[4]
      password = split[5]

      s.joinQuiz(ava, joinUrl, 'Ava')
    })

    context('Standard', () => {
      it('\'Submit\' button', () => {
        // Act
        s.selectHost(ava, 'Ava')

        // Assert
        const host = ava.$('span#host').getText()
        const url = ava.getUrl()

        assert.equal(host, 'Ava')
        assert.match(url, new RegExp(`/${gamecode}/game`))
      })

      it('Is skipped when joining after a host has been selected', () => {
        // Act
        s.selectHost(ava, 'Ava')

        s.joinQuiz(boo, joinUrl, 'Boo')

        // Assert
        const url = boo.getUrl()

        assert.match(url, new RegExp(`/${gamecode}/game`))
      })

      it('It receives \'host selected\' messages', () => {
        // Arrange
        s.joinQuiz(boo, joinUrl, 'Boo')

        const urlBefore = boo.getUrl()

        // Act
        s.selectHost(ava, 'Ava')

        // Assert
        const urlAfter = boo.getUrl()

        assert.match(urlBefore, new RegExp(`/${gamecode}/host`))
        assert.match(urlAfter, new RegExp(`/${gamecode}/game`))
      })

      it('It receives \'update host options\' messages', () => {
        // Arrange
        const optionsBefore = ava.$$('option')
        const optionTwoExistsBefore = optionsBefore[2]

        // Act
        s.joinQuiz(boo, joinUrl, 'Boo')

        // Assert
        const optionsAfter = ava.$$('option')
        const optionTwoExistsAfter = optionsAfter[2].isExisting()

        assert.equal(optionsBefore.length, 2)
        assert.ok(!optionTwoExistsBefore)
        assert.equal(optionsAfter.length, 3)
        assert.ok(optionTwoExistsAfter)
      })

      it('\'Copy link\' link', () => {
        // Act
        s.copyLink(ava)

        // Assert
        const url = clipboard.readSync()

        assert.match(url, new RegExp(`/join/${gamecode}/${password}`))
      })
    })

    context('Security', () => {
      it('Cannot be reached if a host has already been selected', () => {
        // Arrange
        s.selectHost(ava, 'Ava')

        // Act
        ava.url(`/${gamecode}/host`)

        // Assert
        const url = ava.getUrl()

        assert.match(url, new RegExp(`/${gamecode}/game`))
      })

      it('Cannot be reached if the player hasn\'t yet joined', () => {
        // Act
        boo.url(`/${gamecode}/host`)

        // Assert
        const route = boo.getUrl().split('/')[3]

        assert.equal(route, '')
      })
    })

    context('Validation Errors', () => {
      it('Missing selection', () => {
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

        assert.equal(error, 'A selection is required')
      })
    })
  })
})
