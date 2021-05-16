import { ListNode } from '../types'

/** 判断是否为回文 */
export function isPalindrome(head: ListNode) {
  const stack = []

  let cur = head
  while (cur) {
    stack[stack.length - 1] === cur.value ? stack.pop() : stack.push(cur.value)

    cur = cur.next
  }

  return stack.length === 0
}
