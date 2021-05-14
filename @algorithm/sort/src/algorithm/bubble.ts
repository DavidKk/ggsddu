import defs from '../libs/footprint'

export default function bubble(numbers: number[]) {
  const { compare, exchange, update, end, flush } = defs(numbers)
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      compare(i, j)

      if (numbers[i] < numbers[j]) {
        exchange(i, j)
        const t = numbers[j]
        numbers[j] = numbers[i]
        numbers[i] = t
      }

      update(numbers)
    }
  }

  end()

  return flush()
}
