/**
 * 获取二进制某位的值
 */
export function valueOfBit(num: number, bit: number) {
  return (num >> (bit - 1)) & 1
}
