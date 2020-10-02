const assert = require('assert').strict

module.exports = {
  addAnswer: function (client, answer) {
    client.$('div#answer input').setValue(answer)
    client.$('div#answer button.rubber').click()

    this.pause()
  },

  askNextQuestion: function (client) {
    client.$('a.rubber').click()

    this.pause()
  },

  askQuestion: function (client, askNextQuestion = true) {
    if (askNextQuestion) this.askNextQuestion(client)

    client.$('input[name=question]').setValue('Who directed this film?')
    client.$('input[name=answer]').setValue('Edgar Wright')
    client.$('input[name=picture]').setValue(this.imgUrl)
    client.$('button.rubber').click()

    this.pause()
  },

  copyLink: client => {
    client.$('span.corner-link').click()
  },

  createQuiz: client => {
    client.url('/create')
    client.$('input').setValue('NorEasWorFroHomSoc')
    client.$('button.rubber').click()
  },

  endCountdown: function (client) {
    let div
    let seconds = 30

    client.$('div#end-countdown button.rubber').click()

    do {
      this.pause()

      div = boo.$('div#countdown').getText()

      --seconds
    }
    while (div !== '' && seconds > 0)
  },

  enlargeImage: client => {
    client.$('//*[@id="0"]').$('div.img-container').click()
  },

  hideImage: client => {
    client.$('div#img-container-enlarged').click()
  },

  imgUrl: 'https://sites.temple.edu/thehootnews/files/2018/04/baby-driver.jpg',

  joinQuiz: function (client, url, name) {
    client.url(url)
    client.$('input[name=name]').setValue(name)
    client.$('button.rubber').click()

    this.pause()
  },

  pause: (seconds = 1, client = browser) => {
    client.pause(seconds * 1000)
  },

  selectHost: function (client, name) {
    client.$('select[name=id]').selectByVisibleText(name)
    client.$('button.rubber').click()

    this.pause()
  },

  assertAnswers: (client, player, a, blue = 2, visible = false) => {
    // Assert
    const container = client.$('//*[@id="0"]')
    const table = container.$('table')

    const answers = table.$$('tr.answers td')
    const answerBoo = answers[0]
    const answerBooText = answerBoo.getText()
    const answerDot = answers[1]
    const answerDotText = answerDot.getText()
    const highlighted = table.$$('tr.answers td.highlight-blue')

    switch (player) {
      case 'Ava':
        assert.equal(answerBooText, a[0])
        assert.equal(answerDotText, a[1])
        break
      case 'Boo':
        assert.equal(answerBooText, a[0])
        assert.equal(answerDotText, visible ? a[1] : '')
        break
      case 'Dot':
        assert.equal(answerBooText, visible ? a[0] : '')
        assert.equal(answerDotText, a[1])
        break
      case 'Kit':
        assert.equal(answerBooText, visible ? a[0] : '')
        assert.equal(answerDotText, visible ? a[1] : '')
        break
    }

    assert.equal(highlighted.length, blue)
  },

  assertEnlargedImage: (client, hidden = 'true', src = '') => {
    // Assert
    const container = client.$('div#img-container-enlarged')
    const containerHidden = container.getAttribute('hidden')
    const img = container.$('img')
    const imgSrc = img.getAttribute('src')

    assert.equal(containerHidden, hidden)
    assert.equal(imgSrc, src)
  },

  assertPoints: (client, a, b, c) => {
    // Assert
    const table = client.$('table#points-table')

    const points = table.$$('tr#points td')
    const pointsBoo = points[0]
    const pointsBooText = pointsBoo.getText()

    assert.equal(pointsBooText, a)

    if (b) {
      const pointsDot = points[1]
      const pointsDotText = pointsDot.getText()

      assert.equal(pointsDotText, b)
    }

    if (c) {
      const pointsKit = points[2]
      const pointsKitText = pointsKit.getText()

      assert.equal(pointsKitText, c)
    }
  }
}
