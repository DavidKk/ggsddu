import defs from '@/libs/footprint'
import code from './code.md'

/** 插入排序 */
export default function insertionSort(numbers: number[]) {
  const { compare, insert, idle, freeze, end, flush } = defs(numbers)
  for (let i = 1; i < numbers.length; i++) {
    freeze([i - 1])

    let cursor = i
    while (cursor > 0) {
      const curr = numbers[cursor]
      const prev = numbers[cursor - 1]

      compare(cursor, cursor - 1)
      if (prev < curr) {
        idle()
        break
      }

      numbers.splice(cursor, 1)
      numbers.splice(cursor - 1, 0, curr)

      insert(cursor, cursor - 1)
      idle()

      cursor--
    }
  }

  end()

  return flush()
}

export { code }
