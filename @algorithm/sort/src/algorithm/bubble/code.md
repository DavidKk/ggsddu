```ts
/** 冒泡排序 */
export default function bubbleSort(numbers: number[]) {
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] > numbers[j]) {
        const t = numbers[j]
        numbers[j] = numbers[i]
        numbers[i] = t
      }
    }
  }

  return numbers
}
```
