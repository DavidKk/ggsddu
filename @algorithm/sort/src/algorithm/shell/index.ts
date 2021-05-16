import defs from '@/libs/footprint'
import code from './code.md'

/** 希尔排序 */
export default function shellSort(numbers: number[]) {
  const { idle, compare, swap, freeze, freed, end, flush } = defs(numbers)

  // 动态定义间隔序列
  let gap = 1
  while (gap < numbers.length / 3) {
    gap = gap * 3 + 1
  }

  while (gap > 0) {
    // 分段处理
    for (let i = gap, j; i < numbers.length; i++) {
      freeze([i])
      const temp = numbers[i]

      // 插入排序
      j = i - gap
      while (j >= 0) {
        compare(j, j + gap)
        if (numbers[j] <= temp) {
          idle()
          break
        }

        swap(j, j + gap)
        numbers[j + gap] = numbers[j]
        idle()

        j -= gap
      }

      numbers[j + gap] = temp
      freed([i])
    }

    gap = Math.floor(gap / 3)
  }

  end()
  return flush()
}

export { code }
