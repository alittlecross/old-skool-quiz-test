/* eslint-env mocha */

const assert = require('assert').strict
const clipboard = require('clipboardy')

const s = require('../../support')

describe('/question', () => {
  describe('the page has the correct elements', () => {
    // Arrange
    before(() => {
      s.createQuiz(ava)

      const joinUrl = ava.getUrl()

      s.joinQuiz(ava, joinUrl, 'Ava')
      s.selectHost(ava, 'Ava')

      s.askNextQuestion(ava)
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

    it('labels', () => {
      // Assert
      const labels = ava.$$('label')

      const a = labels[0].getText()
      const b = labels[1].getText()
      const c = labels[2].getText()
      const d = labels[3].getText()

      assert.equal(labels.length, 4)

      assert.equal(a, 'Enter the question...')
      assert.equal(b, 'Enter the answer...')
      assert.equal(c, 'Seconds to count down...')
      assert.equal(d, 'Enter a picture url...')
    })

    it('inputs', () => {
      // Assert
      const inputs = ava.$$('input')

      const a = ava.$('input[name=question]').getAttribute('placeholder')
      const b = ava.$('input[name=answer]').getAttribute('placeholder')
      const c = ava.$('input[name=seconds]').getAttribute('placeholder')
      const d = ava.$('input[name=picture]').getAttribute('placeholder')

      assert.equal(inputs.length, 4)

      assert.equal(a, '...here')
      assert.equal(b, '...here')
      assert.equal(c, '...0-60')
      assert.equal(d, '...here')
    })

    it('\'Submit\' button', () => {
      // Assert
      const button = ava.$('button.rubber').getText()

      assert.equal(button, 'Submit')
    })

    it('paragraph', () => {
      // Assert
      const paragraph = ava.$('p').getText()

      assert.equal(paragraph, 'Optional')
    })

    it('img-container (hidden)', () => {
      // Assert
      const container = ava.$('div.img-container')
      const containerHidden = container.getAttribute('hidden')

      assert.ok(containerHidden)
    })

    it('img-container-enlarged (hidden)', () => {
      // Assert
      const container = ava.$('div#img-container-enlarged')
      const containerHidden = container.getAttribute('hidden')

      assert.ok(containerHidden)
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

    before(() => {
      s.createQuiz(ava)

      joinUrl = ava.getUrl()

      const split = joinUrl.split('/')

      gamecode = split[4]
      password = split[5]

      s.joinQuiz(ava, joinUrl, 'Ava')
      s.joinQuiz(boo, joinUrl, 'Boo')
      s.selectHost(ava, 'Ava')
    })

    beforeEach(() => {
      ava.url(`/${gamecode}/question`)
    })

    context('Standard', () => {
      let div
      let seconds = 30

      it('\'Submit\' button', () => {
        // Arrange
        const containerBefore = boo.$('//*[@id="0"]')
        const containerExistsBefore = containerBefore.isExisting()

        // Act
        s.askQuestion(ava, false)

        // Assert
        do {
          s.pause()

          div = boo.$('div#countdown').getText()

          --seconds
        }
        while (div === '' && seconds > 0)

        s.endCountdown(ava)

        const containerAfter = boo.$('//*[@id="0"]')
        const containerExistsAfter = containerAfter.isExisting()

        assert.ok(!containerExistsBefore)
        assert.ok(containerExistsAfter)
      })

      it('The img-container is updated when the picture input is changed', () => {
        // Arrange
        const containerBefore = ava.$('div.img-container')
        const containerHiddenBefore = containerBefore.getAttribute('hidden')
        const imgBefore = ava.$('div.img-container img')
        const imgBeforeSrc = imgBefore.getAttribute('src')

        // Act
        ava.$('input[name=picture]').setValue(s.imgUrl)

        // Assert
        const containerAfter = ava.$('div.img-container')
        const containerHiddenAfter = containerAfter.getAttribute('hidden')
        const imgAfter = ava.$('div.img-container img')
        const imgAfterSrc = imgAfter.getAttribute('src')

        assert.ok(containerHiddenBefore)
        assert.equal(imgBeforeSrc, '')

        assert.ok(!containerHiddenAfter)
        assert.equal(imgAfterSrc, s.imgUrl)
      })

      it('The img-container is enlarged when clicked', () => {
        // Arrange
        const containerBefore = ava.$('div#img-container-enlarged')
        const containerHiddenBefore = containerBefore.getAttribute('hidden')
        const imgBefore = ava.$('div#img-container-enlarged img')
        const imgBeforeSrc = imgBefore.getAttribute('src')

        // Act
        ava.$('input[name=picture]').setValue(s.imgUrl)
        ava.$('div.img-container').click()

        // Assert
        const containerAfter = ava.$('div#img-container-enlarged')
        const containerHiddenAfter = containerAfter.getAttribute('hidden')
        const imgAfter = ava.$('div#img-container-enlarged img')
        const imgAfterSrc = imgAfter.getAttribute('src')

        assert.ok(containerHiddenBefore)
        assert.equal(imgBeforeSrc, '')

        assert.ok(!containerHiddenAfter)
        assert.equal(imgAfterSrc, s.imgUrl)
      })

      it('The img-container-enlarged is hidden when clicked', () => {
        // Arrange
        ava.$('input[name=picture]').setValue(s.imgUrl)
        ava.$('div.img-container').click()

        const containerBefore = ava.$('div#img-container-enlarged')
        const containerHiddenBefore = containerBefore.getAttribute('hidden')
        const imgBefore = ava.$('div#img-container-enlarged img')
        const imgBeforeSrc = imgBefore.getAttribute('src')

        // Act
        ava.$('div#img-container-enlarged').click()

        // Assert
        const containerAfter = ava.$('div#img-container-enlarged')
        const containerHiddenAfter = containerAfter.getAttribute('hidden')
        const imgAfter = ava.$('div#img-container-enlarged img')
        const imgAfterSrc = imgAfter.getAttribute('src')

        assert.ok(!containerHiddenBefore)
        assert.equal(imgBeforeSrc, s.imgUrl)

        assert.ok(containerHiddenAfter)
        assert.equal(imgAfterSrc, '')
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
      it('Cannot be reached if a question is still active', () => {
        // Arrange
        s.askQuestion(ava, false)

        // Act
        ava.url(`/${gamecode}/question`)

        // Assert
        const url = ava.getUrl()

        assert.match(url, new RegExp(`/${gamecode}/game`))

        s.endCountdown(ava)
      })

      it('Cannot be reached if the player hasn\'t yet joined', () => {
        // Act
        dot.url(`/${gamecode}/question`)

        // Assert
        const route = dot.getUrl().split('/')[3]

        assert.equal(route, '')
      })

      it('Cannot be reached by non-host players', () => {
        // Act
        boo.url(`/${gamecode}/question`)

        // Assert
        const url = boo.getUrl()

        assert.match(url, new RegExp(`/${gamecode}/game`))
      })
    })

    context('Validation Errors', () => {
      let seconds
      let span
      let spans

      beforeEach(() => {
        seconds = 0
      })

      it('Incorrect value seconds ', () => {
        // Act
        do {
          ava.$('input[name=question]').setValue('When?')
          ava.$('input[name=answer]').setValue('Now')
          ava.$('input[name=seconds]').setValue('90')
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'The seconds field accepts numbers from 0 to 60')
      })

      it('Incorrectly formatted seconds', () => {
        // Act
        do {
          ava.$('input[name=question]').setValue('When?')
          ava.$('input[name=answer]').setValue('Now')
          ava.$('input[name=seconds]').setValue('thirty')
          ava.$('button.rubber').click()

          s.pause()

          span = ava.$('span.error')

          ++seconds
        }
        while (!span.isExisting() && seconds < 10)

        // Assert
        const error = span.getText()

        assert.equal(error, 'The seconds field accepts numbers from 0 to 60')
      })

      it('Missing question', () => {
        // Act
        do {
          ava.$('input[name=answer]').setValue('Now')
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

      it('Missing answer', () => {
        // Act
        do {
          ava.$('input[name=question]').setValue('When?')
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

      it('Missing seconds', () => {
        // Act
        do {
          ava.$('input[name=question]').setValue('When?')
          ava.$('input[name=answer]').setValue('Now')
          ava.$('input[name=seconds]').setValue('')
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
          ava.$('input[name=answer]').setValue('Now')
          ava.$('input[name=seconds]').setValue('thirty')
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
        assert.equal(b, 'The seconds field accepts numbers from 0 to 60')
      })
    })
  })
})
