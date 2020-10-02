/* eslint-env mocha */

const assert = require('assert').strict

const s = require('../../support')

describe('/join', () => {
  describe('the page has the correct elements', () => {
    // Arrange
    before(() => {
      ava.url('/join')
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

    it('labels', () => {
      // Assert
      const labels = ava.$$('label')

      const a = labels[0].getText()
      const b = labels[1].getText()
      const c = labels[2].getText()

      assert.equal(labels.length, 3)

      assert.equal(a, 'Enter your name...')
      assert.equal(b, 'Gamecode...')
      assert.equal(c, 'Password...')
    })

    it('inputs', () => {
      // Assert
      const inputs = ava.$$('input')

      const a = inputs[0].getAttribute('placeholder')
      const b = inputs[1].getAttribute('placeholder')
      const c = inputs[2].getAttribute('placeholder')

      assert.equal(inputs.length, 3)

      assert.equal(a, '...here')
      assert.equal(b, '...123-123')
      assert.equal(c, '...abc-abc')
    })

    it('\'Join\' button', () => {
      // Assert
      const button = ava.$('button.rubber').getText()

      assert.equal(button, 'Join')
    })

    it('paragraph', () => {
      // Assert
      const paragraph = ava.$('p').getText()

      assert.equal(paragraph, 'Once you have joined, use Copy link to invite people.')
    })

    it('\'Back\' link', () => {
      // Assert
      const link = ava.$('a.corner-link').getText()

      assert.equal(link, 'Back')
    })
  })

  describe('the page has the correct behaviours', () => {
    // Arrange
    let gamecode
    let joinUrl
    let password

    before(() => {
      s.createQuiz(ava)

      joinUrl = ava.getUrl()

      const split = joinUrl.split('/')

      gamecode = split[4]
      password = split[5]
    })

    beforeEach(() => {
      ava.url('/join')
    })

    context('Standard', () => {
      it('\'Join\' button (from link)', () => {
        // Arrange
        ava.url(joinUrl)

        const gamecodeReadonly = ava.$('input[name=gamecode]').getAttribute('readonly')
        const passwordReadonly = ava.$('input[name=password]').getAttribute('readonly')

        // Act
        ava.$('input[name=name]').setValue('Ava')
        ava.$('button.rubber').click()

        // Assert
        const url = ava.getUrl()

        assert.ok(gamecodeReadonly)
        assert.ok(passwordReadonly)

        assert.match(url, new RegExp(`/${gamecode}/host`))
      })

      it('\'Join\' button (with gamecode and password)', () => {
        // Act
        ava.$('input[name=name]').setValue('Ava')
        ava.$('input[name=gamecode]').setValue(gamecode)
        ava.$('input[name=password]').setValue(password)
        ava.$('button.rubber').click()

        // Assert
        const url = ava.getUrl()

        assert.match(url, new RegExp(`/${gamecode}/host`))
      })

      it('Re-joining changes the players name', () => {
        // Arrange
        s.joinQuiz(ava, joinUrl, 'Eve')

        const optionsBefore = ava.$$('option')

        const optionOneBefore = optionsBefore[1].getText()

        // Act
        s.joinQuiz(ava, joinUrl, 'Ava')

        // Assert
        const optionsAfter = ava.$$('option')

        const optionOneAfter = optionsAfter[1].getText()

        assert.equal(optionsBefore.length, 2)
        assert.equal(optionOneBefore, 'Eve')
        assert.equal(optionsAfter.length, 2)
        assert.equal(optionOneAfter, 'Ava')
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
      let seconds
      let span
      let spans

      beforeEach(() => {
        seconds = 0
      })

      it('Incorrect gamecode', () => {
        // Act
        do {
          ava.$('input[name=name]').setValue('Ava')
          ava.$('input[name=gamecode]').setValue('000-000')
          ava.$('input[name=password]').setValue(password)
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'Sorry, gamecode or password incorrect')
      })

      it('Incorrectly formatted gamecode', () => {
        // Act
        do {
          ava.$('input[name=name]').setValue('Ava')
          ava.$('input[name=gamecode]').setValue('abc-abc')
          ava.$('input[name=password]').setValue(password)
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'The gamecode format is 123-123')
      })

      it('Incorrect password', () => {
        // Act
        do {
          ava.$('input[name=name]').setValue('Ava')
          ava.$('input[name=gamecode]').setValue(gamecode)
          ava.$('input[name=password]').setValue('aaa-aaa')
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'Sorry, gamecode or password incorrect')
      })

      it('Incorrectly formatted password', () => {
        // Act
        do {
          ava.$('input[name=name]').setValue('Ava')
          ava.$('input[name=gamecode]').setValue(gamecode)
          ava.$('input[name=password]').setValue('123-123')
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'The password format is abc-abc')
      })

      it('Missing name', () => {
        // Act
        do {
          ava.$('input[name=gamecode]').setValue(gamecode)
          ava.$('input[name=password]').setValue(password)
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'All fields above are required')
      })

      it('Missing gamecode', () => {
        // Act
        do {
          ava.$('input[name=name]').setValue('Ava')
          ava.$('input[name=password]').setValue(password)
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'All fields above are required')
      })

      it('Missing password', () => {
        // Act
        do {
          ava.$('input[name=name]').setValue('Ava')
          ava.$('input[name=gamecode]').setValue(gamecode)
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'All fields above are required')
      })

      it('Multiple errors', () => {
        // Act
        do {
          ava.$('input[name=gamecode]').setValue('abc-abc')
          ava.$('input[name=password]').setValue(password)
          ava.$('button.rubber').click()

          s.pause()

          spans = ava.$$('span.error')

          ++seconds
        }
        while (spans.length === 0 && seconds < 10)

        // Assert
        const a = spans[0].getText()
        const b = spans[1].getText()

        assert.equal(spans.length, 2)

        assert.equal(a, 'All fields above are required')
        assert.equal(b, 'The gamecode format is 123-123')
      })
    })
  })
})
