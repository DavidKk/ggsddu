```ts
/** 希尔排序 */
export default function shellSort(numbers: number[]) {
  // 动态定义间隔序列
  let gap = 1
  while (gap < numbers.length / 3) {
    gap = gap * 3 + 1
  }

  while (gap > 0) {
    // 分段处理
    for (let i = gap, j; i < numbers.length; i++) {
      let temp = numbers[i]

      // 插入排序
      j = i - gap
      while (j >= 0) {
        if (numbers[j] <= temp) {
          break
        }

        numbers[j + gap] = numbers[j]
        j -= gap
      }

      numbers[j + gap] = temp
    }

    gap = Math.floor(gap / 3)
  }

  return numbers
}
```
