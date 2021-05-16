import defs from '../libs/footprint'

export default function selectionSort(numbers: number[]) {
  const { idle, compare, swap, freeze, freed, end, flush } = defs(numbers)
  let index = 0
  for (let i = 0; i < numbers.length; i++) {
    freeze([i])
    index = i

    for (let j = i + 1; j < numbers.length; j++) {
      compare(j, index)
      if (numbers[j] < numbers[index]) {
        index = j
      }

      idle()
    }

    swap(i, index)
    const t = numbers[index]
    numbers[index] = numbers[i]
    numbers[i] = t

    freed()
  }

  end()

  return flush()
}
