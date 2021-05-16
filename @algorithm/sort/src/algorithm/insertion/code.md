```ts
/** 插入排序 */
export default function insertionSort(numbers: number[]) {
  for (let i = 1; i < numbers.length; i++) {
    let cursor = i
    while (cursor > 0) {
      const curr = numbers[cursor]
      const prev = numbers[cursor - 1]

      if (prev < curr) {
        break
      }

      numbers.splice(cursor, 1)
      numbers.splice(cursor - 1, 0, curr)
      cursor--
    }
  }

  return numbers
}
```
