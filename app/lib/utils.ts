export function generateHeadingNumber(headings: any[], currentHeading: any) {
  const numbers = [0, 0, 0, 0, 0, 0]
  let currentLevel = 1
  let result = ''

  for (const heading of headings) {
    if (heading.pos === currentHeading.pos) {
      numbers[heading.level - 1]++
      result = numbers.slice(0, heading.level).join('.')
      break
    }

    if (heading.level <= currentLevel) {
      numbers[heading.level - 1]++
      for (let i = heading.level; i < 6; i++) {
        numbers[i] = 0
      }
    } else {
      numbers[heading.level - 1]++
    }
    currentLevel = heading.level
  }

  return result
} 