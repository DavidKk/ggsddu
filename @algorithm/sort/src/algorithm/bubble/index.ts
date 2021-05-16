import defs from '@/libs/footprint'
import code from './code.md'

/** 冒泡排序 */
export default function bubbleSort(numbers: number[]) {
  const { compare, swap, idle, mark, freeze, end, flush } = defs(numbers)
  for (let i = 0; i < numbers.length - 1; i++) {
    freeze([i])

    for (let j = i + 1; j < numbers.length; j++) {
      compare(i, j)

      if (numbers[i] > numbers[j]) {
        swap(i, j)
        const t = numbers[j]
        numbers[j] = numbers[i]
        numbers[i] = t
      }

      idle()
    }

    mark([i])
  }

  end()
  return flush()
}

export { code }
