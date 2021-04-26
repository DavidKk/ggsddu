import { expect } from 'chai'
import { isSymmetrical } from './isSymmetrical'

describe('isSymmetrical', () => {
  const ClosureTags: [string, string][] = [
    ['[', ']'],
    ['{', '}'],
    ['(', ')'],
  ]

  it('can test symmetrical string', () => {
    const content = '[{()}{()}({})]{}[]()'
    expect(isSymmetrical(content, ClosureTags)).to.be.true
  })

  it('can test nonsymmetrical string', () => {
    const contentA = '[)]'
    expect(isSymmetrical(contentA, ClosureTags)).to.be.false

    const contentB = ')]'
    expect(isSymmetrical(contentB, ClosureTags)).to.be.false
  })
})
