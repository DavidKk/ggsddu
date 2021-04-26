export function isSymmetrical(context: string, closureTags: [string, string][]) {
  const chars = context.split('')
  const [openTags, closeTags] = closureTags.reduce(
    (result, [head, foot]) => {
      const [openTags, closeTags] = result
      openTags.push(head)
      closeTags.push(foot)
      return result
    },
    [[], []]
  )

  const stack = []
  while (true) {
    if (chars.length > 0) {
      const cur = chars.shift()
      const openIndex = openTags.indexOf(cur)
      if (-1 !== openIndex) {
        stack.push(cur)
        continue
      }

      const closeIndex = closeTags.indexOf(cur)
      if (-1 !== closeIndex) {
        if (stack.length === 0) {
          return false
        }

        const lastOpenTag = stack.pop()
        if (lastOpenTag !== openTags[closeIndex]) {
          return false
        }
      }

      continue
    }

    break
  }

  return stack.length === 0
}
