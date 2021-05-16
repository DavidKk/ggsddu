import { expect } from 'chai'
import { isPalindrome } from './isPalindrome'
import { listifyArray } from '../listifyArray/listifyArray'

describe('isPalindrome', () => {
  it('test palindrome list', () => {
    const array = [1, 2, 3, 3, 2, 1]
    const head = listifyArray(array)
    expect(isPalindrome(head)).to.be.true
  })

  it('test invalid palindrome list', () => {
    const array = [1, 2, 3, 2, 1]
    const head = listifyArray(array)
    expect(isPalindrome(head)).to.be.false
  })
})
