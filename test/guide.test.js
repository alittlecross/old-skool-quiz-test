/* eslint-env mocha */

const assert = require('assert').strict

describe('/guide', () => {
  describe('the page has the correct elements', () => {
    // Arrange
    before(() => {
      ava.url('/guide')
    })

    it('title', () => {
      // Assert
      const title = ava.getTitle()

      assert.equal(title, 'Old Skool Quiz')
    })

    it('heading', () => {
      // Assert
      const heading = ava.$('div#heading').getText()

      assert.equal(heading, 'Guide')
    })

    it('sub-headings', () => {
      // Assert
      const subheadings = ava.$$('div.sub-heading')

      const a = subheadings[0].getText()
      const b = subheadings[1].getText()
      const c = subheadings[2].getText()
      const d = subheadings[3].getText()
      const e = subheadings[4].getText()

      assert.equal(subheadings.length, 5)

      assert.equal(a, 'Scoring...')
      assert.equal(b, 'Switch host...')
      assert.equal(c, 'Bonus points...')
      assert.equal(d, 'Merge players...')
      assert.equal(e, 'Remove player...')
    })

    it('paragraphs', () => {
      // Assert
      const paragraphs = ava.$$('p')

      const a = paragraphs[0].getText()
      const b = paragraphs[1].getText()
      const c = paragraphs[2].getText()
      const d = paragraphs[3].getText()
      const e = paragraphs[4].getText()
      const f = paragraphs[5].getText()
      const g = paragraphs[6].getText()
      const h = paragraphs[7].getText()
      const i = paragraphs[8].getText()
      const j = paragraphs[9].getText()
      const k = paragraphs[10].getText()

      assert.equal(paragraphs.length, 11)

      assert.equal(a, 'Click correct answers to give out points.')
      assert.equal(b, 'The lead score(s) will be highlighted yellow.')
      assert.equal(c, 'The bottom three scores will be highlighted pink.')
      assert.equal(d, 'This can be used to pass hosting duties to another player.')
      assert.equal(e, 'Click the ✓ below the player whom you want to pass hosting duties to.')
      assert.equal(f, 'Points can be adjusted if an answer is worth more than one point.')
      assert.equal(g, 'Click the + or - below a player to add or remove bonus points.')
      assert.equal(h, 'If for any reason a player joins twice, their columns can be merged.')
      assert.equal(i, 'Click the # below the two players to be merged.')
      assert.equal(j, 'A player might leave and not return.')
      assert.equal(k, 'Click the ✗ below a player to remove them.')
    })
  })
})
