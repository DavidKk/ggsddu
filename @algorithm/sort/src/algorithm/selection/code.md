```ts
/** 选择排序 */
export default function selectionSort(numbers: number[]) {
  let index = 0
  for (let i = 0; i < numbers.length; i++) {
    index = i

    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[j] < numbers[index]) {
        index = j
      }
    }

    const t = numbers[index]
    numbers[index] = numbers[i]
    numbers[i] = t
  }

  return numbers
}
```
