import { ListNode } from '../types'

export function listifyArray(array: Array<string | number>): ListNode {
  const list = array.reduce<ListNode[]>((list, value) => {
    const item = { value, next: null }
    const last = list[list.length - 1]
    last && (last.next = item)
    list.push(item)
    return list
  }, [])

  return list[0]
}
