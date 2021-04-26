import { expect } from 'chai'
import { valueOfBit } from './valueOfBit'

describe('valueOfBit', () => {
  it('can get value of binary number', () => {
    const num = 0b1010011001001001
    const str = num.toString(2)
    const { length } = str
    for (let i = 1; i <= length; i++) {
      const value = valueOfBit(num, i)
      const target = parseInt(str.charAt(length - i), 10)
      expect(value).to.equal(target)
    }
  })
})
