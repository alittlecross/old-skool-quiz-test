/* eslint-env mocha */

const assert = require('assert').strict
const clipboard = require('clipboardy')

const s = require('../../support')

describe('/game', () => {
  describe('the page has the correct elements', () => {
    // Arrange
    let gamecode

    before(() => {
      s.createQuiz(ava)

      const joinUrl = ava.getUrl()
      const split = joinUrl.split('/')

      gamecode = split[4]

      s.joinQuiz(ava, joinUrl, 'Ava')
      s.joinQuiz(boo, joinUrl, 'Boo')
      s.selectHost(ava, 'Ava')
    })

    it('title', () => {
      // Assert
      const title = ava.getTitle()

      assert.equal(title, 'Old Skool Quiz')
    })

    it('heading', () => {
      // Assert
      const div = ava.$('div#heading').getText()

      assert.equal(div, 'NorEasWorFroHomSoc')
    })

    it('sub-heading', () => {
      // Assert
      const div = ava.$('div.sub-heading').getText()

      assert.equal(div, 'Asking the questions is... Ava')
    })

    it('host', () => {
      // Assert
      const span = ava.$('span#host').getText()

      assert.equal(span, 'Ava')
    })

    it('answer input not present', () => {
      // Assert
      const div = ava.$$('div#answer')

      assert.equal(div.length, 0)
    })

    it('\'End countdown\' button not present', () => {
      // Assert
      const div = ava.$$('div#end-countdown')

      assert.equal(div.length, 0)
    })

    it('points-table', () => {
      // Assert
      const table = ava.$('table#points-table')
      const tableHidden = table.getAttribute('hidden')

      const names = table.$$('tr.names td')
      const nameBoo = names[0]
      const nameBooId = nameBoo.getAttribute('data-id')
      const nameBooText = nameBoo.getText()
      const points = table.$$('tr#points td')
      const pointsBoo = points[0]
      const pointsBooId = pointsBoo.getAttribute('data-id')
      const pointsBooText = pointsBoo.getText()

      assert.ok(!tableHidden)

      assert.equal(nameBooId, pointsBooId)
      assert.equal(nameBooText, 'Boo')
      assert.equal(pointsBooText, '0')
    })

    it('switch host table not present', () => {
      // Assert
      const table = ava.$$('table#switch-host-table')

      assert.equal(table.length, 0)
    })

    it('bonus points table not present', () => {
      // Assert
      const table = ava.$$('table#bonus-points-table')

      assert.equal(table.length, 0)
    })

    it('merge players table not present', () => {
      // Assert
      const table = ava.$$('table#merge-players-table')

      assert.equal(table.length, 0)
    })

    it('remove player table not present', () => {
      // Assert
      const table = ava.$$('table#remove-player-table')

      assert.equal(table.length, 0)
    })

    it('\'Guide\' link', () => {
      // Assert
      const link = ava.$('a.corner-link').getText()

      assert.equal(link, 'Guide')
    })

    it('\'Copy link\' link', () => {
      // Assert
      const link = ava.$('span.corner-link').getText()

      assert.equal(link, 'Copy link')
    })

    it('other divs not present', () => {
      // Assert
      const game = ava.$$('div#game')
      const merge = ava.$$('div#merge')

      assert.equal(game.length, 0)
      assert.equal(merge.length, 0)
    })

    context('Host', () => {
      it('\'Ask next question\' link', () => {
        // Assert
        const link = ava.$('#ask-next-question')
        const linkHidden = link.getAttribute('hidden')
        const linkText = link.$('a.rubber').getText()

        assert.ok(!linkHidden)
        assert.equal(linkText, 'Ask next question')
      })

      it('menu', () => {
        // Assert
        const div = ava.$('div#menu')
        const divHidden = div.getAttribute('hidden')

        const bonusPoints = ava.$('span#bonus-points').getText()
        const mergePlayers = ava.$('span#merge-players').getText()
        const removePlayer = ava.$('span#remove-player').getText()
        const switchHost = ava.$('span#switch-host').getText()

        assert.ok(!divHidden)

        assert.equal(bonusPoints, 'Bonus points...')
        assert.equal(mergePlayers, 'Merge players...')
        assert.equal(removePlayer, 'Remove player...')
        assert.equal(switchHost, 'Switch host...')
      })
    })

    context('Player', () => {
      it('\'Ask next question\' link not present', () => {
        // Assert
        const link = boo.$$('#ask-next-question')

        assert.equal(link.length, 0)
      })

      it('menu not present', () => {
        // Assert
        const div = boo.$$('div#menu')

        assert.equal(div.length, 0)
      })
    })
  })

  describe('the page has the correct behaviours', () => {
    // Arrange
    const blank = ['', '']
    const edgar = ['Edgar Boo', 'Edgar Dot']
    const wright = ['Boo Wright', 'Dot Wright']

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
      s.joinQuiz(dot, joinUrl, 'Dot')
      s.selectHost(ava, 'Ava')
    })

    context('Standard', () => {
      let avaStart
      let avaEnd
      let booStart
      let booEnd
      let dotStart
      let dotEnd
      let seconds = 30

      context('Before Question', () => {
        it('\'Ask next question\' link', () => {
          // Act
          s.askNextQuestion(ava)

          // Assert
          const url = ava.getUrl()

          assert.match(url, new RegExp('/game/question'))
        })

        it('\'Copy link\' link', () => {
          // Act
          s.copyLink(boo)

          // Assert
          const url = clipboard.readSync()

          assert.match(url, new RegExp(`/join/${gamecode}/${password}`))
        })
      })

      context('During Question', () => {
        it.only('The page is updated when new questions are added', () => {
          // Arrange
          const assertBefore = client => {
            // Assert
            const container = client.$('//*[@id="0"]')
            const containerExists = container.isExisting()

            assert.ok(!containerExists)
          }

          const assertAfter = (client, host) => {
            // Assert
            const answerDiv = client.$$('div#answer')
            const askNextQuestion = client.$$('#ask-next-question')
            const endCountdown = client.$$('div#end-countdown')
            const pointsTable = client.$$('table#points-table')
            const menu = client.$$('div#menu')

            const container = client.$('//*[@id="0"]')
            const containerExists = container.isExisting()
            const question = container.$('div.question').getText()

            const answer = container.$('div.question span')
            const answerExists = answer.isExisting()
            const picture = container.$('img')
            const pictureSrc = picture.getAttribute('src')

            const table = container.$('table')

            const answers = table.$$('tr.answers td')
            const answerBoo = answers[0]
            const answerBooId = answerBoo.getAttribute('data-id')
            const answerDot = answers[1]
            const answerDotId = answerDot.getAttribute('data-id')
            const names = table.$$('tr.names td')
            const nameBoo = names[0]
            const nameBooId = nameBoo.getAttribute('data-id')
            const nameBooText = nameBoo.getText()
            const nameDot = names[1]
            const nameDotId = nameDot.getAttribute('data-id')
            const nameDotText = nameDot.getText()

            assert.equal(answerDiv.length, host ? 0 : 1)
            assert.equal(askNextQuestion.length, 0)
            assert.equal(endCountdown.length, host ? 1 : 0)
            assert.equal(pointsTable.length, 0)
            assert.equal(menu.length, 0)

            assert.ok(containerExists)
            assert.equal(question, '1. Who directed this film?')

            assert.ok(!answerExists)
            assert.equal(pictureSrc, s.imgUrl)

            assert.equal(nameBooId, answerBooId)
            assert.equal(nameBooText, 'Boo')
            assert.equal(nameDotId, answerDotId)
            assert.equal(nameDotText, 'Dot')
          }

          // Assert
          assertBefore(ava, true)
          assertBefore(boo)
          assertBefore(dot)

          // Act
          s.askQuestion(ava)

          // Assert
          assertAfter(ava, true)
          assertAfter(boo)
          assertAfter(dot)
        })

        it('The page is updated when new answers are added', () => {
          // Assert
          s.assertAnswers(ava, 'Ava', blank, 0)
          s.assertAnswers(boo, 'Boo', blank, 0)
          s.assertAnswers(dot, 'Dot', blank, 0)

          // Act
          s.addAnswer(boo, edgar[0])
          s.addAnswer(dot, edgar[1])

          // Assert
          s.assertAnswers(ava, 'Ava', edgar)
          s.assertAnswers(boo, 'Boo', edgar)
          s.assertAnswers(dot, 'Dot', edgar)
        })

        it('The page is updated when answers are updated', () => {
          // Act
          s.addAnswer(boo, wright[0])
          s.addAnswer(dot, wright[1])

          // Assert
          s.assertAnswers(ava, 'Ava', wright)
          s.assertAnswers(boo, 'Boo', wright)
          s.assertAnswers(dot, 'Dot', wright)
        })

        it('The img-container is enlarged when clicked', () => {
          // Assert
          s.assertEnlargedImage(boo)

          // Act
          s.enlargeImage(boo)
          s.enlargeImage(dot) // <-- later test setup

          // Assert
          s.assertEnlargedImage(boo, null, s.imgUrl)
          s.assertEnlargedImage(dot, null, s.imgUrl) // <-- later test setup
        })

        it('The img-container-enlarged is hidden when clicked', () => {
          // Act
          s.hideImage(boo)

          // Assert
          s.assertEnlargedImage(boo)
        })

        it('The timer counts down', () => {
          // Act
          do {
            s.pause()

            avaStart = ava.$('div#countdown').getText()
            booStart = boo.$('div#countdown').getText()
            dotStart = dot.$('div#countdown').getText()

            --seconds
          }
          while ((avaStart === '' || booStart === '' || dotStart === '') && seconds > 0)

          do {
            s.pause()

            avaEnd = ava.$('div#countdown').getText()
            booEnd = boo.$('div#countdown').getText()
            dotEnd = dot.$('div#countdown').getText()

            --seconds
          }
          while ((avaStart === avaEnd || booStart === booEnd || dotStart === dotEnd) && seconds > 0)

          // Assert
          assert.ok(seconds > 20)
        })

        it('\'End countdown\' button', () => {
          // Act
          s.endCountdown(ava)

          do {
            s.pause()

            avaEnd = ava.$('div#countdown').getText()
            booEnd = boo.$('div#countdown').getText()
            dotEnd = dot.$('div#countdown').getText()

            --seconds
          }
          while ((avaEnd !== '' || booEnd !== '' || dotEnd !== '') && seconds > 0)

          // Assert
          assert.ok(seconds > 20)
        })
      })

      context('After Question', () => {
        it('The answers are revealed when the timer runs down', () => {
          // Assert
          s.assertAnswers(ava, 'Ava', wright, 0, true)
          s.assertAnswers(boo, 'Boo', wright, 0, true)
          s.assertAnswers(dot, 'Dot', wright, 0, true)
        })

        it('The img-container-enlarged is hidden when the timer runs down', () => {
          // Assert
          s.assertEnlargedImage(dot)
        })

        it('The page is updated when the timer runs down', () => {
          // Arrange
          const assertAfter = (client, host) => {
            // Assert
            const answerDiv = client.$('div#answer')
            const answerDivHidden = answerDiv.getAttribute('hidden')
            const askNextQuestion = client.$('#ask-next-question')
            const askNextQuestionHidden = askNextQuestion.getAttribute('hidden')
            const endCountdown = client.$('div#end-countdown')
            const endCountdownHidden = endCountdown.getAttribute('hidden')
            const pointsTable = client.$('table#points-table')
            const pointsTableHidden = pointsTable.getAttribute('hidden')
            const menu = client.$('div#menu')
            const menuHidden = menu.getAttribute('hidden')

            assert.ok(answerDivHidden)
            assert.ok(host ? !askNextQuestionHidden : askNextQuestionHidden)
            assert.ok(endCountdownHidden)
            assert.ok(!pointsTableHidden)
            assert.ok(host ? !menuHidden : menuHidden)
          }

          // Assert
          assertAfter(ava, true)
          assertAfter(boo)
          assertAfter(dot)
        })

        it('\'Switch host...\' toggle', () => {
          // Act
          ava.$('span#switch-host').click()

          const tableBefore = ava.$('table#switch-host-table')
          const tableBeforeHidden = tableBefore.getAttribute('hidden')

          ava.$('span#switch-host').click()

          // Assert
          const tableAfter = ava.$('table#switch-host-table')
          const tableAfterHidden = tableAfter.getAttribute('hidden')

          assert.ok(!tableBeforeHidden)
          assert.ok(tableAfterHidden)
        })

        it('\'Switch host...\' function', () => {
          // Arrange
          const assertVisible = (client, host) => {
            // Assert
            const askNextQuestion = client.$('#ask-next-question')
            const askNextQuestionHidden = askNextQuestion.getAttribute('hidden')
            const menu = client.$('div#menu')
            const menuHidden = menu.getAttribute('hidden')

            assert.ok(host ? !askNextQuestionHidden : askNextQuestionHidden)
            assert.ok(host ? !menuHidden : menuHidden)
          }

          // Assert
          assertVisible(ava, true)
          assertVisible(boo)

          // Act
          ava.$('span#switch-host').click()
          ava.$$('table#switch-host-table span.sign')[0].click()

          s.pause()

          // Assert
          assertVisible(ava)
          assertVisible(boo, true)

          // Act
          boo.$('span#switch-host').click()
          boo.$$('table#switch-host-table span.sign')[0].click()

          s.pause()
        })

        it('\'Bonus points...\' toggle', () => {
          // Act
          ava.$('span#bonus-points').click()

          const tableBefore = ava.$('table#bonus-points-table')
          const tableBeforeHidden = tableBefore.getAttribute('hidden')

          ava.$('span#bonus-points').click()

          // Assert
          const tableAfter = ava.$('table#bonus-points-table')
          const tableAfterHidden = tableAfter.getAttribute('hidden')

          assert.ok(!tableBeforeHidden)
          assert.ok(tableAfterHidden)
        })

        it('\'Bonus points...\' function', () => {
          // Assert
          s.assertPoints(ava, '0', '0')
          s.assertPoints(boo, '0', '0')
          s.assertPoints(dot, '0', '0')

          // Act
          ava.$('span#bonus-points').click()
          ava.$$('table#bonus-points-table span.sign')[1].click()
          ava.$$('table#bonus-points-table span.sign')[2].click()

          s.pause()

          // Assert
          s.assertPoints(ava, '1', '-1')
          s.assertPoints(boo, '1', '-1')
          s.assertPoints(dot, '1', '-1')
        })

        it('\'Merge players...\' toggle', () => {
          // Act
          ava.$('span#merge-players').click()

          const tableBefore = ava.$('table#merge-players-table')
          const tableBeforeHidden = tableBefore.getAttribute('hidden')

          ava.$('span#merge-players').click()

          // Assert
          const tableAfter = ava.$('table#merge-players-table')
          const tableAfterHidden = tableAfter.getAttribute('hidden')

          assert.ok(!tableBeforeHidden)
          assert.ok(tableAfterHidden)
        })

        it('\'Merge players...\' function', () => {
          // Arrange
          s.joinQuiz(kit, joinUrl, 'Kit')

          s.pause()

          // Assert
          s.assertPoints(ava, '1', '-1', '0')
          s.assertPoints(boo, '1', '-1', '0')
          s.assertPoints(dot, '1', '-1', '0')
          s.assertPoints(kit, '1', '-1', '0')

          // Act
          ava.$('span#merge-players').click()
          ava.$$('table#merge-players-table span.sign')[1].click()
          ava.$$('table#merge-players-table span.sign')[2].click()

          s.pause()

          // Assert
          const dotRoute = dot.getUrl().split('/')[3]
          const table = ava.$('table#points-table')

          const names = table.$$('tr.names td')
          const nameKit = names[1]
          const nameKitText = nameKit.getText()

          assert.equal(dotRoute, '')
          assert.equal(nameKitText, 'Kit')

          s.assertPoints(ava, '1', '-1')
          s.assertPoints(boo, '1', '-1')
          s.assertPoints(kit, '1', '-1')
        })

        it('\'Remove player...\' toggle', () => {
          // Act
          ava.$('span#remove-player').click()

          const tableBefore = ava.$('table#remove-player-table')
          const tableBeforeHidden = tableBefore.getAttribute('hidden')

          ava.$('span#remove-player').click()

          // Assert
          const tableAfter = ava.$('table#remove-player-table')
          const tableAfterHidden = tableAfter.getAttribute('hidden')

          assert.ok(!tableBeforeHidden)
          assert.ok(tableAfterHidden)
        })

        it('\'Remove player...\' function', () => {
          // Act
          ava.$('span#remove-player').click()
          ava.$$('table#remove-player-table span.sign')[1].click()

          s.pause()

          // Assert
          const kitRoute = kit.getUrl().split('/')[3]
          const table = ava.$('table#points-table')

          const names = table.$$('tr.names td')

          assert.equal(kitRoute, '')
          assert.equal(names.length, 1)

          s.assertPoints(ava, '1')
          s.assertPoints(boo, '1')
        })

        it('Clicking correct answers awards/removes points', () => {
          // Act
          const container = ava.$('//*[@id="0"]')
          const table = container.$('table')

          const answers = table.$$('tr.answers td')
          const answerBoo = answers[0]

          answerBoo.click()

          s.pause()

          // Assert
          s.assertPoints(ava, '2')
          s.assertPoints(boo, '2')
        })

        it('\'Guide\' link', () => {
          // Act
          ava.$('a.corner-link').click()
          ava.switchWindow(/\/guide/)

          // Assert
          const url = ava.getUrl()

          assert.match(url, /\/guide/)
        })

        it('The img-container-enlarged is hidden when new questions are added', () => {
          // Arrange
          s.enlargeImage(boo)

          // Assert
          s.assertEnlargedImage(boo, null, s.imgUrl)

          // Act
          ava.switchWindow(/\//)
          s.askQuestion(ava)

          // Assert
          s.assertEnlargedImage(boo)
        })
      })
    })

    context('Security', () => {
      it('Cannot be reached if the host hasn\'t yet been selected', () => {
        // Arrange
        s.createQuiz(ava)

        joinUrl = ava.getUrl()

        const split = joinUrl.split('/')

        gamecode = split[4]

        s.joinQuiz(ava, joinUrl, 'Ava')

        // Act
        ava.url(`/${gamecode}/game`)

        // Assert
        const url = ava.getUrl()

        assert.match(url, new RegExp(`/${gamecode}/host`))
      })

      it('Cannot be reached if the player hasn\'t yet joined', () => {
        // Act
        dot.url(`/${gamecode}/question`)

        // Assert
        const route = dot.getUrl().split('/')[3]

        assert.equal(route, '')
      })
    })
  })
})
